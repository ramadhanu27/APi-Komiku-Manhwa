const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Global state for graceful shutdown
let isShuttingDown = false
let currentManhwaList = []
let currentFilepath = ''

/**
 * Save manhwa list to file
 */
const saveManhwaList = (manhwaList, filepath, isAutoSave = false) => {
  const prefix = isAutoSave ? '💾 Auto-save:' : '💾 Saved to:'
  fs.writeFileSync(filepath, JSON.stringify(manhwaList, null, 2))
  console.log(`${prefix} ${manhwaList.length} manhwa saved`)
  
  // Update global state
  currentManhwaList = manhwaList
  currentFilepath = filepath
}

/**
 * Graceful shutdown handler
 */
const handleShutdown = () => {
  if (isShuttingDown) return
  isShuttingDown = true
  
  console.log('\n\n⚠️  Stopping scraper...')
  console.log('💾 Saving current progress...')
  
  if (currentManhwaList.length > 0 && currentFilepath) {
    // Save without calling saveManhwaList to avoid recursion
    fs.writeFileSync(currentFilepath, JSON.stringify(currentManhwaList, null, 2))
    console.log(`✅ Progress saved successfully! (${currentManhwaList.length} manhwa)`)
  } else {
    console.log('⚠️  No data to save yet')
  }
  
  console.log('👋 Goodbye!\n')
  process.exit(0)
}

// Register shutdown handlers
process.on('SIGINT', handleShutdown)  // Ctrl+C
process.on('SIGTERM', handleShutdown) // Kill command

/**
 * Scrape manhwa list saja (tanpa detail)
 */
const scrapeManhwaList = async (maxScrolls = 25) => {
  console.log(`\n🚀 Starting Komiku List Scraper...`)
  console.log(`📜 Max scrolls: ${maxScrolls}\n`)
  
  console.log(`🌐 Launching browser...`)
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    const url = 'https://komiku.org/pustaka/?orderby=meta_value_num&tipe=manhwa&genre=&genre2=&status='
    
    console.log(`📚 Navigating to: ${url}`)
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })
    
    console.log(`\n📜 Scrolling to load manhwa...`)
    
    // Auto scroll
    let previousHeight = 0
    let scrollCount = 0
    let noChangeCount = 0
    
    while (scrollCount < maxScrolls && !isShuttingDown) {
      // Scroll ke bawah
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      
      console.log(`  📜 Scroll ${scrollCount + 1}/${maxScrolls}`)
      
      // Wait untuk content load (faster scroll)
      await delay(800)
      
      // Check if shutting down
      if (isShuttingDown) {
        console.log(`  ⚠️  Stopping scroll...`)
        break
      }
      
      // Check height
      const currentHeight = await page.evaluate(() => document.body.scrollHeight)
      
      if (currentHeight === previousHeight) {
        noChangeCount++
        console.log(`  ⚠️  No new content (${noChangeCount}/3)`)
        
        if (noChangeCount >= 3) {
          console.log(`  ✅ Reached end of list`)
          break
        }
      } else {
        noChangeCount = 0
      }
      
      previousHeight = currentHeight
      scrollCount++
    }
    
    console.log(`\n✅ Scrolling complete, extracting data...\n`)
    
    // Get HTML
    const html = await page.content()
    const $ = cheerio.load(html)
    
    // Setup output path
    const outputDir = path.join(__dirname, '../public')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    const filename = 'komiku-list.json'
    const filepath = path.join(outputDir, filename)
    
    // Set global filepath for shutdown handler
    currentFilepath = filepath
    
    // Load existing list
    let existingList = []
    if (fs.existsSync(filepath)) {
      try {
        existingList = JSON.parse(fs.readFileSync(filepath, 'utf8'))
        console.log(`📋 Loaded existing list: ${existingList.length} manhwa\n`)
      } catch (error) {
        console.log(`⚠️  Could not load existing list, creating new one\n`)
      }
    }
    
    // Initialize global state with existing list
    currentManhwaList = [...existingList]
    
    const manhwaList = []
    const existingListSlugs = new Set(existingList.map(m => m.slug))
    let newAddedCount = 0
    
    // Extract manhwa (get all, no filtering yet)
    $('.bge').each((index, element) => {
      const $element = $(element)
      const $link = $element.find('.kan a')
      const $title = $link.find('h3')
      const $imageContainer = $element.find('.bgei')
      const $genre = $element.find('.genre span')
      
      const title = $title.text().trim()
      const url = $link.attr('href')
      const slug = url ? url.split('/manga/')[1]?.replace('/', '') : ''
      
      // Get image - try multiple selectors
      let image = ''
      const $img = $imageContainer.find('img')
      if ($img.length > 0) {
        image = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src') || ''
      }
      
      // If no image found, try to get from style background
      if (!image) {
        const bgStyle = $imageContainer.attr('style')
        if (bgStyle) {
          const bgMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/)
          if (bgMatch) {
            image = bgMatch[1]
          }
        }
      }
      
      const genres = []
      $genre.each((i, el) => {
        genres.push($(el).text().trim())
      })
      
      if (title && url && slug && image) {
        const newManhwa = {
          title,
          slug,
          url,
          image,
          genres
        }
        
        manhwaList.push(newManhwa)
        
        // Real-time save: Save immediately when new manhwa found
        if (!existingListSlugs.has(slug)) {
          newAddedCount++
          existingListSlugs.add(slug) // Add to set to prevent duplicates
          
          // Add to existing list immediately
          existingList.push(newManhwa)
          existingList.sort((a, b) => a.title.localeCompare(b.title))
          
          // Update global state for shutdown handler
          currentManhwaList = [...existingList]
          
          // Save immediately
          saveManhwaList(existingList, filepath, true)
          console.log(`  ✨ New: ${title}`)
        }
      }
    })
    
    console.log(`\n✅ Extracted ${manhwaList.length} manhwa from Komiku`)
    console.log(`   - With images: ${manhwaList.filter(m => m.image).length}`)
    console.log(`   - Without images: ${manhwaList.filter(m => !m.image).length}`)
    console.log(`   - New manhwa added: ${newAddedCount}\n`)
    
    await browser.close()
    
    // Final merge and save
    const mergedList = [...existingList]
    let addedCount = 0
    
    manhwaList.forEach(newManhwa => {
      if (!existingListSlugs.has(newManhwa.slug)) {
        mergedList.push(newManhwa)
        addedCount++
      }
    })
    
    // Sort by title
    mergedList.sort((a, b) => a.title.localeCompare(b.title))
    
    // Final save
    saveManhwaList(mergedList, filepath)
    
    console.log(`📊 Total manhwa in list: ${mergedList.length}`)
    console.log(`   - Previous: ${existingList.length}`)
    console.log(`   - New added: ${addedCount}`)
    console.log(`   - Duplicates skipped: ${manhwaList.length - addedCount}`)
    
    // Show preview
    console.log(`\n📋 Preview (first 10):`)
    manhwaList.slice(0, 20).forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.title} (${m.slug})`)
    })
    
    return manhwaList
    
  } catch (error) {
    console.error(`❌ Error:`, error.message)
    await browser.close()
    return []
  }
}

// CLI
const args = process.argv.slice(2)
const maxScrolls = parseInt(args[0]) || 100

scrapeManhwaList(maxScrolls)
