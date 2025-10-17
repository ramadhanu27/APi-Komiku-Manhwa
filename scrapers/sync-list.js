const fs = require('fs')
const path = require('path')

/**
 * Sync komiku-list.json with scraped manhwa in Chapter/komiku/
 * Add missing manhwa to list
 */
const syncList = () => {
  console.log('\n🔄 Syncing komiku-list.json with scraped data...\n')
  
  const chapterDir = path.join(__dirname, '../public/Chapter/komiku')
  const listPath = path.join(__dirname, '../public/komiku-list.json')
  
  if (!fs.existsSync(chapterDir)) {
    console.error('❌ Chapter/komiku directory not found!')
    return
  }
  
  // Load existing list
  let existingList = []
  if (fs.existsSync(listPath)) {
    existingList = JSON.parse(fs.readFileSync(listPath, 'utf8'))
    console.log(`📋 Current list: ${existingList.length} manhwa`)
  }
  
  // Get all scraped files
  const files = fs.readdirSync(chapterDir).filter(f => f.endsWith('.json'))
  console.log(`📁 Scraped files: ${files.length} manhwa\n`)
  
  // Create slug set for quick lookup
  const existingSlugs = new Set(existingList.map(m => m.slug))
  
  let added = 0
  let skipped = 0
  
  for (const file of files) {
    try {
      const filepath = path.join(chapterDir, file)
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      
      // Check if already in list
      if (existingSlugs.has(data.slug)) {
        skipped++
        continue
      }
      
      // Clean title
      let title = data.manhwaTitle || data.title || data.slug || 'Unknown'
      title = title.replace(/^Komik\s+/i, '')
      title = title.replace(/^\d+-/, '')
      
      if (title === data.slug || title.includes('-')) {
        title = title
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
      
      // Add to list
      existingList.push({
        title: title.trim(),
        slug: data.slug,
        url: data.manhwaUrl || data.url,
        image: data.image,
        genres: data.genres || []
      })
      
      console.log(`  ✅ Added: ${title}`)
      added++
      
    } catch (error) {
      console.error(`  ❌ Error reading ${file}:`, error.message)
    }
  }
  
  // Sort by title
  existingList.sort((a, b) => a.title.localeCompare(b.title))
  
  // Save updated list
  fs.writeFileSync(listPath, JSON.stringify(existingList, null, 2))
  
  console.log(`\n✅ Sync complete!`)
  console.log(`   Added: ${added}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Total: ${existingList.length}`)
}

syncList()
