/**
 * Auto Update Script
 * Automatically update manga list, chapters, and latest updates
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configuration
const CONFIG = {
  updateInterval: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
  dataDir: path.join(__dirname, '..', 'data'),
  scrapersDir: __dirname,
  logFile: path.join(__dirname, '..', 'update.log')
};

// Logger
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(logMessage.trim());
  fs.appendFileSync(CONFIG.logFile, logMessage);
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Get file age in hours
function getFileAgeHours(filePath) {
  if (!fileExists(filePath)) return Infinity;
  
  const stats = fs.statSync(filePath);
  const ageMs = Date.now() - stats.mtime.getTime();
  return ageMs / (1000 * 60 * 60); // Convert to hours
}

// Run scraper command
async function runScraper(command, description) {
  log(`Starting: ${description}`);
  
  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: path.join(__dirname, '..')
    });
    
    if (stdout) log(`Output: ${stdout}`);
    if (stderr) log(`Error: ${stderr}`);
    
    log(`Completed: ${description}`);
    return true;
  } catch (error) {
    log(`Failed: ${description} - ${error.message}`);
    return false;
  }
}

// Update manga list
async function updateMangaList() {
  const listFile = path.join(CONFIG.dataDir, 'komiku-list.json');
  const ageHours = getFileAgeHours(listFile);
  
  log(`Manga list age: ${ageHours.toFixed(2)} hours`);
  
  if (ageHours > 24) { // Update if older than 24 hours
    log('Updating manga list...');
    await runScraper(
      'node scrapers/generate-list.js',
      'Generate manga list'
    );
  } else {
    log('Manga list is up to date');
  }
}

// Update latest updates
async function updateLatestUpdates() {
  const updatesFile = path.join(CONFIG.dataDir, 'latest-updates.json');
  const ageHours = getFileAgeHours(updatesFile);
  
  log(`Latest updates age: ${ageHours.toFixed(2)} hours`);
  
  if (ageHours > 6) { // Update if older than 6 hours
    log('Updating latest updates...');
    await runScraper(
      'node scrapers/generate-latest-updates.js',
      'Generate latest updates'
    );
  } else {
    log('Latest updates is up to date');
  }
}

// Update specific manga chapters
async function updateMangaChapters(slug) {
  log(`Updating chapters for: ${slug}`);
  
  await runScraper(
    `node scrapers/scraper.js single ${slug}`,
    `Update chapters for ${slug}`
  );
}

// Update all manga chapters (selective)
async function updateAllChapters() {
  log('Checking for manga that need chapter updates...');
  
  const listFile = path.join(CONFIG.dataDir, 'komiku-list.json');
  
  if (!fileExists(listFile)) {
    log('Manga list not found. Skipping chapter updates.');
    return;
  }
  
  const mangaList = JSON.parse(fs.readFileSync(listFile, 'utf8'));
  const chapterDir = path.join(CONFIG.dataDir, 'Chapter', 'komiku');
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const manga of mangaList) {
    const chapterFile = path.join(chapterDir, `${manga.slug}.json`);
    const ageHours = getFileAgeHours(chapterFile);
    
    // Update if file doesn't exist or older than 24 hours
    if (ageHours > 24) {
      log(`Updating ${manga.slug} (age: ${ageHours.toFixed(2)}h)`);
      await updateMangaChapters(manga.slug);
      updatedCount++;
      
      // Wait 2 seconds between updates to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      skippedCount++;
    }
  }
  
  log(`Chapter update complete. Updated: ${updatedCount}, Skipped: ${skippedCount}`);
}

// Main update function
async function performUpdate() {
  log('='.repeat(60));
  log('Starting auto-update process');
  log('='.repeat(60));
  
  try {
    // 1. Update manga list (once per day)
    await updateMangaList();
    
    // 2. Update latest updates (every 6 hours)
    await updateLatestUpdates();
    
    // 3. Update chapters for outdated manga
    await updateAllChapters();
    
    log('='.repeat(60));
    log('Auto-update process completed successfully');
    log('='.repeat(60));
    
    return true;
  } catch (error) {
    log(`Auto-update failed: ${error.message}`);
    log(error.stack);
    return false;
  }
}

// Schedule updates
function scheduleUpdates() {
  log('Auto-update scheduler started');
  log(`Update interval: ${CONFIG.updateInterval / (1000 * 60 * 60)} hours`);
  
  // Run immediately on start
  performUpdate();
  
  // Then run on schedule
  setInterval(performUpdate, CONFIG.updateInterval);
}

// Manual update mode
async function manualUpdate(mode = 'all') {
  log(`Manual update mode: ${mode}`);
  
  switch (mode) {
    case 'list':
      await updateMangaList();
      break;
    case 'updates':
      await updateLatestUpdates();
      break;
    case 'chapters':
      await updateAllChapters();
      break;
    case 'all':
    default:
      await performUpdate();
      break;
  }
  
  log('Manual update completed');
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0] || 'schedule';
  
  if (mode === 'schedule') {
    // Run as scheduled service
    scheduleUpdates();
  } else {
    // Run manual update
    manualUpdate(mode).then(() => {
      process.exit(0);
    }).catch(error => {
      log(`Error: ${error.message}`);
      process.exit(1);
    });
  }
}

module.exports = {
  performUpdate,
  updateMangaList,
  updateLatestUpdates,
  updateMangaChapters,
  updateAllChapters
};
