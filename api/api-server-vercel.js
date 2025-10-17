const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub raw URL for data
// Try separate data repo first, fallback to main repo
const DATA_REPO_BASE = 'https://raw.githubusercontent.com/ramadhanu27/Komiku-Data/main/data';
const MAIN_REPO_BASE = 'https://raw.githubusercontent.com/ramadhanu27/APi-Komiku-Manhwa/main/data';

let GITHUB_RAW_BASE = DATA_REPO_BASE; // Start with data repo

// Cache for data
let cachedManhwaList = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to fetch from GitHub with fallback
const fetchFromGitHub = async (path) => {
  try {
    // Try data repo first
    const response = await axios.get(`${DATA_REPO_BASE}/${path}`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.log('Data repo failed, trying main repo...', error.message);
    
    try {
      // Fallback to main repo
      const response = await axios.get(`${MAIN_REPO_BASE}/${path}`, { timeout: 10000 });
      GITHUB_RAW_BASE = MAIN_REPO_BASE; // Switch to main repo for future requests
      return response.data;
    } catch (fallbackError) {
      console.error('Both repos failed:', path, fallbackError.message);
      return null;
    }
  }
};

// Helper function to get manga list with cache
const getManhwaList = async () => {
  const now = Date.now();
  if (cachedManhwaList && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedManhwaList;
  }
  
  const data = await fetchFromGitHub('komiku-list.json');
  if (data) {
    cachedManhwaList = data;
    cacheTimestamp = now;
  }
  return data;
};

// ==================== SERVE STATIC HTML ====================

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Komiku API is running',
    timestamp: new Date().toISOString(),
    dataSource: 'GitHub Raw',
    currentRepo: GITHUB_RAW_BASE === DATA_REPO_BASE ? 'komiku-data' : 'APi-Komiku-Manhwa'
  });
});

// ==================== MANGA LIST ENDPOINTS ====================

app.get('/api/manga', async (req, res) => {
  try {
    const manhwaList = await getManhwaList();
    
    if (!manhwaList) {
      return res.status(500).json({ 
        error: 'Failed to load manga list',
        message: 'Data source unavailable. Please try again later.'
      });
    }

  const { page = 1, limit = 20, search, genre } = req.query;
  
  let filtered = [...manhwaList];
  
  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(m => 
      m.title.toLowerCase().includes(searchLower)
    );
  }
  
  // Genre filter
  if (genre) {
    filtered = filtered.filter(m => 
      m.genres && m.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedData = filtered.slice(startIndex, endIndex);
  
    res.json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      data: paginatedData
    });
  } catch (error) {
    console.error('Error in /api/manga:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

app.get('/api/list', async (req, res) => {
  const manhwaList = await getManhwaList();
  
  if (!manhwaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  res.json(manhwaList);
});

app.get('/api/manga/:slug', async (req, res) => {
  const manhwaList = await getManhwaList();
  
  if (!manhwaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  const manga = manhwaList.find(m => m.slug === req.params.slug);
  
  if (!manga) {
    return res.status(404).json({ error: 'Manga not found' });
  }

  res.json({
    success: true,
    data: manga
  });
});

// ==================== GENRES ENDPOINT ====================

app.get('/api/genres', async (req, res) => {
  const manhwaList = await getManhwaList();
  
  if (!manhwaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  const genresSet = new Set();
  manhwaList.forEach(manga => {
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

app.get('/api/chapters/:slug', async (req, res) => {
  const chapterData = await fetchFromGitHub(`Chapter/komiku/${req.params.slug}.json`);
  
  if (!chapterData) {
    return res.status(404).json({ error: 'Manga not found' });
  }

  const { page = 1, limit = 50 } = req.query;
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedChapters = chapterData.chapters.slice(startIndex, endIndex);

  res.json({
    success: true,
    manhwaTitle: chapterData.manhwaTitle,
    slug: chapterData.slug,
    totalChapters: chapterData.totalChapters,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(chapterData.totalChapters / limit),
    chapters: paginatedChapters
  });
});

app.get('/api/chapters/:slug/:chapterNumber', async (req, res) => {
  const chapterData = await fetchFromGitHub(`Chapter/komiku/${req.params.slug}.json`);
  
  if (!chapterData) {
    return res.status(404).json({ error: 'Manga not found' });
  }

  const chapter = chapterData.chapters.find(
    ch => ch.number === req.params.chapterNumber
  );

  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  res.json({
    success: true,
    manhwaTitle: chapterData.manhwaTitle,
    slug: chapterData.slug,
    chapter: chapter
  });
});

// ==================== STATISTICS ENDPOINT ====================

app.get('/api/stats', async (req, res) => {
  const manhwaList = await getManhwaList();
  
  if (!manhwaList) {
    return res.status(500).json({ error: 'Failed to load data' });
  }

  const genresSet = new Set();
  manhwaList.forEach(manga => {
    if (manga.genres) {
      manga.genres.forEach(genre => genresSet.add(genre));
    }
  });

  res.json({
    success: true,
    data: {
      totalManga: manhwaList.length,
      totalGenres: genresSet.size,
      lastUpdated: new Date().toISOString(),
      dataSource: 'GitHub Raw'
    }
  });
});

// ==================== SEARCH ENDPOINT ====================

app.get('/api/search', async (req, res) => {
  const manhwaList = await getManhwaList();
  
  if (!manhwaList) {
    return res.status(500).json({ error: 'Failed to load manga list' });
  }

  const { q, genre } = req.query;
  
  if (!q && !genre) {
    return res.status(400).json({ error: 'Query parameter "q" or "genre" is required' });
  }

  let results = [...manhwaList];
  
  if (q) {
    const searchLower = q.toLowerCase();
    results = results.filter(m => 
      m.title.toLowerCase().includes(searchLower)
    );
  }
  
  if (genre) {
    results = results.filter(m => 
      m.genres && m.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }

  res.json({
    success: true,
    query: q,
    genre: genre,
    total: results.length,
    data: results
  });
});

// ==================== LATEST UPDATES ====================

app.get('/api/latest-updates', async (req, res) => {
  const latestData = await fetchFromGitHub('latest-updates.json');
  
  if (!latestData) {
    return res.status(500).json({ error: 'Failed to load latest updates' });
  }

  res.json(latestData);
});

// ==================== ERROR HANDLERS ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.path} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/manga',
      '/api/list',
      '/api/genres',
      '/api/chapters/:slug',
      '/api/stats',
      '/api/search'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// ==================== START SERVER ====================

// For Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Komiku API Server running on port ${PORT}`);
    console.log(`📍 Base URL: http://localhost:${PORT}`);
    console.log(`📊 Data source: GitHub Raw`);
  });
}
