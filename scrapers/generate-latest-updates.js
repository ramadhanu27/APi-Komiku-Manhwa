const fs = require('fs')
const path = require('path')

console.log('\n📅 Generating latest-updates.json...\n')

// Read all chapter JSON files
const chapterDir = path.join(__dirname, '../public/Chapter/komiku')
const files = fs.readdirSync(chapterDir).filter(f => f.endsWith('.json'))

console.log(`📁 Found ${files.length} manhwa files\n`)

const updates = []

files.forEach(file => {
  try {
    const filePath = path.join(chapterDir, file)
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (data.chapters && data.chapters.length > 0) {
      // Get latest chapter
      const latestChapter = data.chapters[data.chapters.length - 1]
      const slug = data.slug || file.replace('.json', '')
      
      // Parse date (format: DD/MM/YYYY)
      let updateDate = new Date()
      if (latestChapter.date) {
        const [day, month, year] = latestChapter.date.split('/')
        updateDate = new Date(year, month - 1, day)
      } else if (data.scrapedAt) {
        updateDate = new Date(data.scrapedAt)
      }
      
      updates.push({
        slug: slug,
        title: data.manhwaTitle || data.title || slug,
        latestChapter: latestChapter.title || `Chapter ${latestChapter.number}`,
        date: updateDate.toISOString(),
        timestamp: updateDate.getTime()
      })
      
      console.log(`  ✅ ${data.manhwaTitle || slug}`)
      console.log(`     Latest: ${latestChapter.title || `Chapter ${latestChapter.number}`}`)
      console.log(`     Date: ${latestChapter.date || 'N/A'}\n`)
    }
  } catch (error) {
    console.log(`  ❌ Error reading ${file}:`, error.message)
  }
})

// Sort by date (newest first)
updates.sort((a, b) => b.timestamp - a.timestamp)

// Remove timestamp (not needed in output)
const output = {
  updates: updates.map(({ slug, title, latestChapter, date }) => ({
    slug,
    title,
    latestChapter,
    date
  })),
  generatedAt: new Date().toISOString(),
  total: updates.length
}

// Save to public folder
const outputPath = path.join(__dirname, '../public/latest-updates.json')
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))

console.log(`\n✅ Generated: public/latest-updates.json`)
console.log(`📊 Total updates: ${updates.length}`)
console.log(`\n📋 Latest 10 updates:`)
updates.slice(0, 10).forEach((u, i) => {
  console.log(`  ${i + 1}. ${u.title}`)
  console.log(`     ${u.latestChapter} - ${new Date(u.date).toLocaleDateString('id-ID')}`)
})

console.log(`\n💡 Tip: Run this script after scraping new chapters`)
console.log(`   node generate-latest-updates.js\n`)
