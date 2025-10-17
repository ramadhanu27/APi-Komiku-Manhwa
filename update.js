#!/usr/bin/env node

/**
 * Quick Update Script
 * Easy command to update manga data
 */

const { performUpdate, updateMangaList, updateLatestUpdates, updateAllChapters } = require('./scrapers/auto-update');

const commands = {
  all: {
    desc: 'Update everything (list, updates, chapters)',
    fn: performUpdate
  },
  list: {
    desc: 'Update manga list only',
    fn: updateMangaList
  },
  updates: {
    desc: 'Update latest updates only',
    fn: updateLatestUpdates
  },
  chapters: {
    desc: 'Update all chapters',
    fn: updateAllChapters
  }
};

function showHelp() {
  console.log('\n📚 Komiku Auto-Update\n');
  console.log('Usage: node update.js [command]\n');
  console.log('Commands:');
  Object.keys(commands).forEach(cmd => {
    console.log(`  ${cmd.padEnd(12)} - ${commands[cmd].desc}`);
  });
  console.log('\nExamples:');
  console.log('  node update.js all       # Update everything');
  console.log('  node update.js list      # Update manga list only');
  console.log('  node update.js updates   # Update latest updates only');
  console.log('  node update.js chapters  # Update chapters only\n');
}

async function main() {
  const command = process.argv[2] || 'all';
  
  if (command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }
  
  if (!commands[command]) {
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }
  
  console.log(`\n🚀 Running: ${commands[command].desc}\n`);
  
  try {
    await commands[command].fn();
    console.log('\n✅ Update completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
    process.exit(1);
  }
}

main();
