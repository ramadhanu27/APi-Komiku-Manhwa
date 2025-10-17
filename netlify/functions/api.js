const fs = require('fs');
const path = require('path');

// Helper function to read JSON files
function readJSONFile(filename) {
    try {
        // Try multiple possible paths for Netlify
        const possiblePaths = [
            path.join(process.cwd(), 'data', filename),
            path.join(__dirname, '..', '..', 'data', filename),
            path.join('/opt/build/repo/data', filename),
            path.join(process.env.LAMBDA_TASK_ROOT || '', '..', '..', 'data', filename)
        ];
        
        let data = null;
        let lastError = null;
        
        for (const filePath of possiblePaths) {
            try {
                if (fs.existsSync(filePath)) {
                    console.log(`Reading from: ${filePath}`);
                    data = fs.readFileSync(filePath, 'utf8');
                    return JSON.parse(data);
                }
            } catch (err) {
                lastError = err;
                continue;
            }
        }
        
        console.error(`Error reading ${filename}:`, lastError);
        console.error('Tried paths:', possiblePaths);
        console.error('Current directory:', process.cwd());
        console.error('__dirname:', __dirname);
        return null;
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

// Helper function to paginate data
function paginate(data, page = 1, limit = 20) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
        data: paginatedData,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(data.length / limit),
            totalItems: data.length,
            itemsPerPage: parseInt(limit),
            hasNextPage: endIndex < data.length,
            hasPrevPage: page > 1
        }
    };
}

// Main handler
exports.handler = async (event, context) => {
    const { path: requestPath, httpMethod, queryStringParameters } = event;
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow GET requests
    if (httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Extract the API path (remove /.netlify/functions/api prefix)
        const apiPath = requestPath.replace('/.netlify/functions/api', '') || '/';
        const pathParts = apiPath.split('/').filter(p => p);

        // Route: /api/debug - Debug endpoint
        if (pathParts[0] === 'debug' || (pathParts[0] === 'api' && pathParts[1] === 'debug')) {
            const dataPath = path.join(process.cwd(), 'data');
            const publicPath = path.join(process.cwd(), 'public');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    status: 'debug',
                    cwd: process.cwd(),
                    dirname: __dirname,
                    dataExists: fs.existsSync(dataPath),
                    publicExists: fs.existsSync(publicPath),
                    dataFiles: fs.existsSync(dataPath) ? fs.readdirSync(dataPath) : [],
                    env: {
                        LAMBDA_TASK_ROOT: process.env.LAMBDA_TASK_ROOT,
                        NODE_ENV: process.env.NODE_ENV
                    }
                })
            };
        }

        // Route: /api/health or /health
        if (pathParts[0] === 'health' || (pathParts[0] === 'api' && pathParts[1] === 'health')) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    status: 'ok',
                    message: 'API is running',
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Route: /api/stats or /stats
        if (pathParts[0] === 'stats' || (pathParts[0] === 'api' && pathParts[1] === 'stats')) {
            const list = readJSONFile('komiku-list.json');
            const updates = readJSONFile('latest-updates.json');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: {
                        totalManga: list ? list.length : 0,
                        totalUpdates: updates ? updates.length : 0,
                        lastUpdate: new Date().toISOString()
                    }
                })
            };
        }

        // Route: /api/list or /list
        if (pathParts[0] === 'list' || (pathParts[0] === 'api' && pathParts[1] === 'list')) {
            const list = readJSONFile('komiku-list.json');
            
            if (!list) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to load manga list' })
                };
            }

            const page = parseInt(queryStringParameters?.page) || 1;
            const limit = parseInt(queryStringParameters?.limit) || 20;
            const search = queryStringParameters?.search?.toLowerCase();
            const genre = queryStringParameters?.genre?.toLowerCase();

            let filteredList = list;

            // Apply search filter
            if (search) {
                filteredList = filteredList.filter(manga => 
                    manga.title?.toLowerCase().includes(search) ||
                    manga.slug?.toLowerCase().includes(search)
                );
            }

            // Apply genre filter
            if (genre) {
                filteredList = filteredList.filter(manga => 
                    manga.genres?.some(g => g.toLowerCase().includes(genre))
                );
            }

            const result = paginate(filteredList, page, limit);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    ...result
                })
            };
        }

        // Route: /api/manga or /manga
        if (pathParts[0] === 'manga' || (pathParts[0] === 'api' && pathParts[1] === 'manga')) {
            const list = readJSONFile('komiku-list.json');
            
            if (!list) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to load manga list' })
                };
            }

            // Get specific manga by slug
            const slugIndex = pathParts[0] === 'manga' ? 1 : 2;
            const slug = pathParts[slugIndex];

            if (slug) {
                const manga = list.find(m => m.slug === slug);
                
                if (!manga) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Manga not found' })
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: manga
                    })
                };
            }

            // Return all manga with pagination
            const page = parseInt(queryStringParameters?.page) || 1;
            const limit = parseInt(queryStringParameters?.limit) || 20;
            const search = queryStringParameters?.search?.toLowerCase();
            const genre = queryStringParameters?.genre?.toLowerCase();

            let filteredList = list;

            if (search) {
                filteredList = filteredList.filter(manga => 
                    manga.title?.toLowerCase().includes(search)
                );
            }

            if (genre) {
                filteredList = filteredList.filter(manga => 
                    manga.genres?.some(g => g.toLowerCase().includes(genre))
                );
            }

            const result = paginate(filteredList, page, limit);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    ...result
                })
            };
        }

        // Route: /api/latest-updates or /latest-updates
        if (pathParts[0] === 'latest-updates' || (pathParts[0] === 'api' && pathParts[1] === 'latest-updates')) {
            const updates = readJSONFile('latest-updates.json');
            
            if (!updates) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to load latest updates' })
                };
            }

            const limit = parseInt(queryStringParameters?.limit) || 20;
            const limitedUpdates = updates.slice(0, limit);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: limitedUpdates,
                    total: updates.length
                })
            };
        }

        // Route: /api/genres or /genres
        if (pathParts[0] === 'genres' || (pathParts[0] === 'api' && pathParts[1] === 'genres')) {
            const list = readJSONFile('komiku-list.json');
            
            if (!list) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to load manga list' })
                };
            }

            const genresSet = new Set();
            list.forEach(manga => {
                if (manga.genres && Array.isArray(manga.genres)) {
                    manga.genres.forEach(genre => genresSet.add(genre));
                }
            });

            const genres = Array.from(genresSet).sort();

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: genres,
                    total: genres.length
                })
            };
        }

        // Route: /api/search or /search
        if (pathParts[0] === 'search' || (pathParts[0] === 'api' && pathParts[1] === 'search')) {
            const list = readJSONFile('komiku-list.json');
            
            if (!list) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to load manga list' })
                };
            }

            const query = queryStringParameters?.q?.toLowerCase();
            const genre = queryStringParameters?.genre?.toLowerCase();
            const page = parseInt(queryStringParameters?.page) || 1;
            const limit = parseInt(queryStringParameters?.limit) || 20;

            let results = list;

            if (query) {
                results = results.filter(manga => 
                    manga.title?.toLowerCase().includes(query) ||
                    manga.slug?.toLowerCase().includes(query) ||
                    manga.description?.toLowerCase().includes(query)
                );
            }

            if (genre) {
                results = results.filter(manga => 
                    manga.genres?.some(g => g.toLowerCase().includes(genre))
                );
            }

            const paginatedResults = paginate(results, page, limit);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    query: query || '',
                    ...paginatedResults
                })
            };
        }

        // Route: /api/chapters/:slug or /chapters/:slug
        if (pathParts[0] === 'chapters' || (pathParts[0] === 'api' && pathParts[1] === 'chapters')) {
            const slugIndex = pathParts[0] === 'chapters' ? 1 : 2;
            const slug = pathParts[slugIndex];
            const chapterNum = pathParts[slugIndex + 1];

            if (!slug) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Manga slug is required' })
                };
            }

            // Try to read chapter data
            try {
                // Try multiple possible paths for chapter files
                const possibleChapterPaths = [
                    path.join(process.cwd(), 'public', 'Chapter', 'komiku', `${slug}.json`),
                    path.join(__dirname, '..', '..', 'public', 'Chapter', 'komiku', `${slug}.json`),
                    path.join('/opt/build/repo/public/Chapter/komiku', `${slug}.json`)
                ];
                
                let chapters = null;
                let foundPath = null;
                
                for (const chapterPath of possibleChapterPaths) {
                    if (fs.existsSync(chapterPath)) {
                        foundPath = chapterPath;
                        chapters = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
                        break;
                    }
                }
                
                if (!chapters) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ 
                            error: 'Chapters not found for this manga',
                            slug: slug,
                            triedPaths: possibleChapterPaths
                        })
                    };
                }

                // If specific chapter number requested
                if (chapterNum) {
                    const chapter = chapters.find(c => c.chapter === chapterNum || c.chapterNumber === chapterNum);
                    
                    if (!chapter) {
                        return {
                            statusCode: 404,
                            headers,
                            body: JSON.stringify({ error: 'Chapter not found' })
                        };
                    }

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            data: chapter
                        })
                    };
                }

                // Return all chapters with pagination
                const page = parseInt(queryStringParameters?.page) || 1;
                const limit = parseInt(queryStringParameters?.limit) || 50;
                const result = paginate(chapters, page, limit);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        slug: slug,
                        ...result
                    })
                };

            } catch (error) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to load chapters' })
                };
            }
        }

        // Default: API info
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Komiku API - Netlify Functions',
                version: '1.0.0',
                endpoints: [
                    'GET /.netlify/functions/api/health',
                    'GET /.netlify/functions/api/stats',
                    'GET /.netlify/functions/api/list',
                    'GET /.netlify/functions/api/manga',
                    'GET /.netlify/functions/api/manga/:slug',
                    'GET /.netlify/functions/api/latest-updates',
                    'GET /.netlify/functions/api/genres',
                    'GET /.netlify/functions/api/search?q=query',
                    'GET /.netlify/functions/api/chapters/:slug',
                    'GET /.netlify/functions/api/chapters/:slug/:chapterNumber'
                ]
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
