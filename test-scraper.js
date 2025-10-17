#!/usr/bin/env node

/**
 * Test Scraper
 * Quick test untuk scraper dengan output detail
 */

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const execPromise = util.promisify(exec);

async function testScraper(type) {
  console.log('\n🧪 Testing Scraper\n');
  console.log('='.repeat(60));
  
  let command = '';
  let dataFile = '';
  
  switch (type) {
    case 'list':
      command = 'node scrapers/generate-list.js';
      dataFile = 'data/komiku-list.json';
      console.log('📚 Testing: Manga List Scraper');
      break;
    case 'updates':
      command = 'node scrapers/generate-latest-updates.js';
      dataFile = 'data/latest-updates.json';
      console.log('🔄 Testing: Latest Updates Scraper');
      break;
    case 'chapter':
      const slug = process.argv[3] || '99-wooden-stick';
      command = `node scrapers/scraper.js single ${slug}`;
      dataFile = `data/Chapter/komiku/${slug}.json`;
      console.log(`📖 Testing: Chapter Scraper (${slug})`);
      break;
    default:
      console.error('❌ Unknown type. Use: list, updates, or chapter');
      process.exit(1);
  }
  
  console.log('='.repeat(60));
  console.log('\n⏳ Running scraper...\n');
  
  // Get file stats before
  let beforeSize = 0;
  let beforeTime = null;
  if (fs.existsSync(dataFile)) {
    const stats = fs.statSync(dataFile);
    beforeSize = stats.size;
    beforeTime = stats.mtime;
  }
  
  try {
    const { stdout, stderr } = await execPromise(command);
    
    if (stdout) console.log(stdout);
    if (stderr) console.error('⚠️ Warnings:', stderr);
    
    // Get file stats after
    if (fs.existsSync(dataFile)) {
      const stats = fs.statSync(dataFile);
      const afterSize = stats.size;
      const afterTime = stats.mtime;
      
      console.log('\n' + '='.repeat(60));
      console.log('📊 Results:');
      console.log('='.repeat(60));
      
      if (beforeTime && afterTime > beforeTime) {
        console.log('✅ File updated!');
        console.log(`📦 Size: ${beforeSize} → ${afterSize} bytes`);
        console.log(`📈 Change: ${afterSize - beforeSize > 0 ? '+' : ''}${afterSize - beforeSize} bytes`);
        
        // Show data count
        if (type === 'list') {
          const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
          console.log(`📚 Total manga: ${data.length}`);
        } else if (type === 'updates') {
          const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
          console.log(`🔄 Total updates: ${data.updates ? data.updates.length : 0}`);
        } else if (type === 'chapter') {
          const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
          console.log(`📖 Total chapters: ${data.chapters ? data.chapters.length : 0}`);
        }
      } else {
        console.log('ℹ️  No changes detected');
        console.log(`📦 Size: ${afterSize} bytes (unchanged)`);
      }
      
      console.log(`📅 Last modified: ${afterTime.toLocaleString()}`);
      console.log(`📁 File: ${dataFile}`);
      
    } else {
      console.log('❌ Output file not found!');
    }
    
    console.log('='.repeat(60));
    console.log('✅ Test completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// CLI
const type = process.argv[2];

if (!type || type === 'help' || type === '--help') {
  console.log('\n📚 Test Scraper\n');
  console.log('Usage: node test-scraper.js <type> [slug]\n');
  console.log('Types:');
  console.log('  list      - Test manga list scraper');
  console.log('  updates   - Test latest updates scraper');
  console.log('  chapter   - Test chapter scraper (optional: slug)\n');
  console.log('Examples:');
  console.log('  node test-scraper.js list');
  console.log('  node test-scraper.js updates');
  console.log('  node test-scraper.js chapter');
  console.log('  node test-scraper.js chapter 99-wooden-stick\n');
  process.exit(0);
}

testScraper(type);
