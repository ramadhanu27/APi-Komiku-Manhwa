const fs = require('fs')
const path = require('path')

/**
 * Generate komiku-list.json from Chapter/komiku/*.json files
 */
const generateList = () => {
  console.log('\n📚 Generating komiku-list.json...\n')
  
  const chapterDir = path.join(__dirname, '../data/Chapter/komiku')
  const outputPath = path.join(__dirname, '../data/komiku-list.json')
  
  if (!fs.existsSync(chapterDir)) {
    console.error('❌ Chapter/komiku directory not found!')
    return
  }
  
  const files = fs.readdirSync(chapterDir).filter(f => f.endsWith('.json'))
  console.log(`📁 Found ${files.length} manhwa files\n`)
  
  const manhwaList = []
  
  for (const file of files) {
    try {
      const filepath = path.join(chapterDir, file)
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      
      let title = data.manhwaTitle || data.title || data.slug || 'Unknown'
      
      // Clean up title
      // Remove "Komik " prefix
      title = title.replace(/^Komik\s+/i, '')
      
      // Remove number prefix (e.g., "12321-", "41231-")
      title = title.replace(/^\d+-/, '')
      
      // Convert slug to title if needed (replace hyphens with spaces and capitalize)
      if (title === data.slug || title.includes('-')) {
        title = title
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
      
      manhwaList.push({
        title: title.trim(),
        slug: data.slug,
        url: data.manhwaUrl || data.url,
        image: data.image,
        genres: data.genres || []
      })
      
      console.log(`  ✅ ${title}`)
    } catch (error) {
      console.error(`  ❌ Error reading ${file}:`, error.message)
    }
  }
  
  // Sort by title
  manhwaList.sort((a, b) => a.title.localeCompare(b.title))
  
  // Save to file
  fs.writeFileSync(outputPath, JSON.stringify(manhwaList, null, 2))
  
  console.log(`\n✅ Generated: data/komiku-list.json`)
  console.log(`📊 Total manhwa: ${manhwaList.length}`)
  
  // Show preview
  console.log(`\n📋 Preview (first 10):`)
  manhwaList.slice(0, 10).forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.title}`)
  })
  
  return manhwaList.length
}

// Run and show summary
const total = generateList()

console.log(`\n💡 Tip: Run 'node sync-list.js' to sync with scraped data`)
