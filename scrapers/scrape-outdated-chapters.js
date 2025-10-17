/**
 * Scrape Outdated Chapters
 * Only scrape chapters that are older than specified days
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const CONFIG = {
  maxAgeDays: 7, // Scrape if older than 7 days
  maxConcurrent: 3, // Max 3 concurrent scrapes
  delayMs: 3000, // 3 seconds delay between scrapes
  dataDir: path.join(__dirname, '..', 'data')
};

// Get file age in days
function getFileAgeDays(filePath) {
  if (!fs.existsSync(filePath)) return Infinity;
  
  const stats = fs.statSync(filePath);
  const ageMs = Date.now() - stats.mtime.getTime();
  return ageMs / (1000 * 60 * 60 * 24); // Convert to days
}

// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Scrape single manga
async function scrapeManga(slug) {
  console.log(`📥 Scraping: ${slug}`);
  
  try {
    const { stdout, stderr } = await execPromise(
      `node scrapers/scraper.js single ${slug}`,
      { cwd: path.join(__dirname, '..') }
    );
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`✅ Completed: ${slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${slug} - ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting outdated chapters scraper\n');
  console.log(`Config: Max age ${CONFIG.maxAgeDays} days\n`);
  
  // Load manga list
  const listFile = path.join(CONFIG.dataDir, 'komiku-list.json');
  
  if (!fs.existsSync(listFile)) {
    console.error('❌ Manga list not found!');
    process.exit(1);
  }
  
  const mangaList = JSON.parse(fs.readFileSync(listFile, 'utf8'));
  console.log(`📚 Total manga: ${mangaList.length}\n`);
  
  // Find outdated chapters
  const chapterDir = path.join(CONFIG.dataDir, 'Chapter', 'komiku');
  const outdated = [];
  
  for (const manga of mangaList) {
    const chapterFile = path.join(chapterDir, `${manga.slug}.json`);
    const ageDays = getFileAgeDays(chapterFile);
    
    if (ageDays > CONFIG.maxAgeDays) {
      outdated.push({
        slug: manga.slug,
        title: manga.title,
        ageDays: ageDays.toFixed(1)
      });
    }
  }
  
  console.log(`📊 Found ${outdated.length} outdated manga:\n`);
  
  if (outdated.length === 0) {
    console.log('✅ All chapters are up to date!');
    return;
  }
  
  // Show list
  outdated.slice(0, 10).forEach((m, i) => {
    console.log(`${i + 1}. ${m.title} (${m.ageDays} days old)`);
  });
  
  if (outdated.length > 10) {
    console.log(`... and ${outdated.length - 10} more`);
  }
  
  console.log('\n🔄 Starting scraping process...\n');
  
  // Scrape outdated manga
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < outdated.length; i++) {
    const manga = outdated[i];
    
    console.log(`\n[${i + 1}/${outdated.length}] ${manga.title}`);
    
    const success = await scrapeManga(manga.slug);
    
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Delay between scrapes (except last one)
    if (i < outdated.length - 1) {
      console.log(`⏳ Waiting ${CONFIG.delayMs / 1000}s...`);
      await sleep(CONFIG.delayMs);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Scraping Summary');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📚 Total: ${outdated.length}`);
  console.log('='.repeat(60));
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
