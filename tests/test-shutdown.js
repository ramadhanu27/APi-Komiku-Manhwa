const fs = require('fs')
const path = require('path')

// Global state
let currentManhwaList = []
let currentFilepath = ''

// Shutdown handler
const handleShutdown = () => {
  console.log('\n\n⚠️  Stopping scraper...')
  console.log('💾 Saving current progress...')
  
  if (currentManhwaList.length > 0 && currentFilepath) {
    fs.writeFileSync(currentFilepath, JSON.stringify(currentManhwaList, null, 2))
    console.log(`✅ Progress saved successfully! (${currentManhwaList.length} manhwa)`)
  } else {
    console.log('⚠️  No data to save yet')
  }
  
  console.log('👋 Goodbye!\n')
  process.exit(0)
}

// Register handlers
process.on('SIGINT', handleShutdown)

// Test
console.log('🧪 Testing shutdown handler...')
console.log('Press Ctrl+C to test\n')

// Setup
const filepath = path.join(__dirname, '../public/test-shutdown.json')
currentFilepath = filepath

// Load existing
if (fs.existsSync(filepath)) {
  currentManhwaList = JSON.parse(fs.readFileSync(filepath, 'utf8'))
  console.log(`📋 Loaded: ${currentManhwaList.length} items\n`)
}

// Simulate adding data
let count = currentManhwaList.length
setInterval(() => {
  count++
  const newItem = {
    id: count,
    title: `Item ${count}`,
    timestamp: new Date().toISOString()
  }
  
  currentManhwaList.push(newItem)
  fs.writeFileSync(filepath, JSON.stringify(currentManhwaList, null, 2))
  
  console.log(`✨ Added: Item ${count} (Total: ${currentManhwaList.length})`)
}, 2000)

console.log('Adding items every 2 seconds...')
console.log('Press Ctrl+C to stop and save\n')
