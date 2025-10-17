const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON files
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

// Helper function to get all chapter files
const getAllChapterFiles = () => {
  const chapterDir = path.join(__dirname, 'Chapter', 'komiku');
  try {
    return fs.readdirSync(chapterDir).filter(file => file.endsWith('.json'));
  } catch (error) {
    return [];
  }
};

// ==================== MANGA LIST ENDPOINTS ====================

/**
 * GET /api/manga
 * Get all manga list
 * Query params: 
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 20)
 *   - search: search by title
 *   - genre: filter by genre
 */
app.get('/api/manga', (req, res) => {
  const mangaList = readJSONFile(path.join(__dirname, 'komiku-list.json'));
  
  if (!mangaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  let filteredList = [...mangaList];

  // Search filter
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredList = filteredList.filter(manga => 
      manga.title.toLowerCase().includes(searchTerm)
    );
  }

  // Genre filter
  if (req.query.genre) {
    const genreFilter = req.query.genre;
    filteredList = filteredList.filter(manga => 
      manga.genres && manga.genres.includes(genreFilter)
    );
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedList = filteredList.slice(startIndex, endIndex);

  res.json({
    success: true,
    page,
    limit,
    total: filteredList.length,
    totalPages: Math.ceil(filteredList.length / limit),
    data: paginatedList
  });
});

/**
 * GET /api/manga/:slug
 * Get manga details by slug
 */
app.get('/api/manga/:slug', (req, res) => {
  const mangaList = readJSONFile(path.join(__dirname, 'komiku-list.json'));
  
  if (!mangaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  const manga = mangaList.find(m => m.slug === req.params.slug);

  if (!manga) {
    return res.status(404).json({ 
      success: false,
      error: 'Manga not found' 
    });
  }

  res.json({
    success: true,
    data: manga
  });
});

/**
 * GET /api/genres
 * Get all available genres
 */
app.get('/api/genres', (req, res) => {
  const mangaList = readJSONFile(path.join(__dirname, 'komiku-list.json'));
  
  if (!mangaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  const genresSet = new Set();
  mangaList.forEach(manga => {
    if (manga.genres) {
      manga.genres.forEach(genre => genresSet.add(genre));
    }
  });

  const genres = Array.from(genresSet).sort();

  res.json({
    success: true,
    total: genres.length,
    data: genres
  });
});

// ==================== CHAPTER ENDPOINTS ====================

/**
 * GET /api/chapters/:slug
 * Get all chapters for a specific manga
 * Query params:
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 50)
 */
app.get('/api/chapters/:slug', (req, res) => {
  const chapterFile = path.join(__dirname, 'Chapter', 'komiku', `${req.params.slug}.json`);
  const chapterData = readJSONFile(chapterFile);

  if (!chapterData) {
    return res.status(404).json({ 
      success: false,
      error: 'Chapter data not found for this manga' 
    });
  }

  // Pagination for chapters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const chapters = chapterData.chapters || [];
  const paginatedChapters = chapters.slice(startIndex, endIndex);

  res.json({
    success: true,
    manhwaTitle: chapterData.manhwaTitle,
    slug: chapterData.slug,
    totalChapters: chapterData.totalChapters,
    page,
    limit,
    totalPages: Math.ceil(chapters.length / limit),
    data: paginatedChapters
  });
});

/**
 * GET /api/chapters/:slug/:chapterNumber
 * Get specific chapter details with images
 */
app.get('/api/chapters/:slug/:chapterNumber', (req, res) => {
  const chapterFile = path.join(__dirname, 'Chapter', 'komiku', `${req.params.slug}.json`);
  const chapterData = readJSONFile(chapterFile);

  if (!chapterData) {
    return res.status(404).json({ 
      success: false,
      error: 'Chapter data not found for this manga' 
    });
  }

  const chapter = chapterData.chapters.find(ch => ch.number === req.params.chapterNumber);

  if (!chapter) {
    return res.status(404).json({ 
      success: false,
      error: 'Chapter not found' 
    });
  }

  res.json({
    success: true,
    manhwaTitle: chapterData.manhwaTitle,
    slug: chapterData.slug,
    data: chapter
  });
});

/**
 * GET /api/manga/:slug/details
 * Get complete manga details including metadata from chapter file
 */
app.get('/api/manga/:slug/details', (req, res) => {
  const chapterFile = path.join(__dirname, 'Chapter', 'komiku', `${req.params.slug}.json`);
  const chapterData = readJSONFile(chapterFile);

  if (!chapterData) {
    return res.status(404).json({ 
      success: false,
      error: 'Manga details not found' 
    });
  }

  // Return metadata without all chapters
  const { chapters, ...metadata } = chapterData;

  res.json({
    success: true,
    data: {
      ...metadata,
      chapterCount: chapters ? chapters.length : 0
    }
  });
});

// ==================== LATEST UPDATES ENDPOINTS ====================

/**
 * GET /api/latest-updates
 * Get latest manga updates
 * Query params:
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 20)
 */
app.get('/api/latest-updates', (req, res) => {
  const latestUpdatesData = readJSONFile(path.join(__dirname, 'latest-updates.json'));
  
  if (!latestUpdatesData) {
    return res.status(500).json({ error: 'Failed to load latest updates' });
  }

  // Handle both array and object with updates property
  const latestUpdates = Array.isArray(latestUpdatesData) 
    ? latestUpdatesData 
    : (latestUpdatesData.updates || []);

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedList = latestUpdates.slice(startIndex, endIndex);

  res.json({
    success: true,
    page,
    limit,
    total: latestUpdates.length,
    totalPages: Math.ceil(latestUpdates.length / limit),
    data: paginatedList
  });
});

// ==================== SEARCH ENDPOINTS ====================

/**
 * GET /api/search
 * Advanced search across manga
 * Query params:
 *   - q: search query
 *   - genre: filter by genre
 *   - type: filter by type (Manhwa, Manga, Manhua)
 *   - status: filter by status (Ongoing, Completed)
 */
app.get('/api/search', (req, res) => {
  const mangaList = readJSONFile(path.join(__dirname, 'komiku-list.json'));
  
  if (!mangaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  let results = [...mangaList];

  // Text search
  if (req.query.q) {
    const searchTerm = req.query.q.toLowerCase();
    results = results.filter(manga => 
      manga.title.toLowerCase().includes(searchTerm) ||
      (manga.slug && manga.slug.toLowerCase().includes(searchTerm))
    );
  }

  // Genre filter
  if (req.query.genre) {
    results = results.filter(manga => 
      manga.genres && manga.genres.includes(req.query.genre)
    );
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    success: true,
    query: req.query.q || '',
    page,
    limit,
    total: results.length,
    totalPages: Math.ceil(results.length / limit),
    data: paginatedResults
  });
});

// ==================== STATISTICS ENDPOINTS ====================

/**
 * GET /api/stats
 * Get API statistics
 */
app.get('/api/stats', (req, res) => {
  const mangaList = readJSONFile(path.join(__dirname, 'komiku-list.json'));
  const chapterFiles = getAllChapterFiles();

  if (!mangaList) {
    return res.status(500).json({ error: 'Failed to load data' });
  }

  const genresSet = new Set();
  mangaList.forEach(manga => {
    if (manga.genres) {
      manga.genres.forEach(genre => genresSet.add(genre));
    }
  });

  res.json({
    success: true,
    data: {
      totalManga: mangaList.length,
      totalMangaWithChapters: chapterFiles.length,
      totalGenres: genresSet.size,
      lastUpdated: new Date().toISOString()
    }
  });
});

// ==================== ROOT & HEALTH CHECK ====================

/**
 * GET /
 * API root - documentation
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Komiku API',
    version: '1.0.0',
    description: 'RESTful API for Komiku manga data',
    endpoints: {
      manga: {
        'GET /api/manga': 'Get all manga (with pagination, search, genre filter)',
        'GET /api/manga/:slug': 'Get manga by slug',
        'GET /api/manga/:slug/details': 'Get complete manga details with metadata'
      },
      chapters: {
        'GET /api/chapters/:slug': 'Get all chapters for a manga',
        'GET /api/chapters/:slug/:chapterNumber': 'Get specific chapter with images'
      },
      genres: {
        'GET /api/genres': 'Get all available genres'
      },
      updates: {
        'GET /api/latest-updates': 'Get latest manga updates'
      },
      search: {
        'GET /api/search': 'Advanced search (query params: q, genre, page, limit)'
      },
      stats: {
        'GET /api/stats': 'Get API statistics'
      },
      health: {
        'GET /api/health': 'Health check endpoint'
      }
    },
    documentation: 'See API-README.md for detailed documentation'
  });
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║         Komiku API Server                 ║
╚═══════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}
📚 API Documentation: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/api/health

Available Endpoints:
  • GET  /api/manga
  • GET  /api/manga/:slug
  • GET  /api/manga/:slug/details
  • GET  /api/chapters/:slug
  • GET  /api/chapters/:slug/:chapterNumber
  • GET  /api/genres
  • GET  /api/latest-updates
  • GET  /api/search
  • GET  /api/stats
  • GET  /api/health

Press Ctrl+C to stop the server
  `);
});

module.exports = app;
