const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

// Base URL
const BASE_URL = 'https://komiku.org'
const MANHWA_LIST_URL = 'https://komiku.org/pustaka/?orderby=meta_value_num&tipe=manhwa&genre=&genre2=&status='

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Scrape manhwa list dengan Puppeteer (untuk infinite scroll)
 */
const scrapeManhwaListWithPuppeteer = async (maxScrolls = 5) => {
  console.log(`🚀 Launching browser...`)
  
  const browser = await puppeteer.launch({
    headless: true, // Set false untuk lihat browser
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    console.log(`📚 Navigating to: ${MANHWA_LIST_URL}`)
    await page.goto(MANHWA_LIST_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })
    
    console.log(`📜 Scrolling to load more manhwa...`)
    
    // Auto scroll untuk trigger lazy loading
    let previousHeight = 0
    let scrollCount = 0
    
    while (scrollCount < maxScrolls) {
      // Scroll ke bawah
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      
      console.log(`  📜 Scroll ${scrollCount + 1}/${maxScrolls}`)
      
      // Wait untuk content load
      await delay(2000)
      
      // Check apakah ada content baru
      const currentHeight = await page.evaluate(() => document.body.scrollHeight)
      
      if (currentHeight === previousHeight) {
        console.log(`  ✅ No more content to load`)
        break
      }
      
      previousHeight = currentHeight
      scrollCount++
    }
    
    console.log(`✅ Scrolling complete, extracting data...`)
    
    // Get HTML setelah scroll
    const html = await page.content()
    const $ = cheerio.load(html)
    
    const manhwaList = []
    
    // Selector berdasarkan screenshot
    $('.bge').each((index, element) => {
      const $element = $(element)
      const $link = $element.find('.kan a')
      const $title = $link.find('h3')
      const $image = $element.find('.bgei img')
      const $genre = $element.find('.genre span')
      
      const title = $title.text().trim()
      const url = $link.attr('href')
      const slug = url ? url.split('/manga/')[1]?.replace('/', '') : ''
      const image = $image.attr('src') || $image.attr('data-src')
      
      const genres = []
      $genre.each((i, el) => {
        genres.push($(el).text().trim())
      })
      
      if (title && url) {
        manhwaList.push({
          title,
          url,
          slug,
          image,
          genres
        })
      }
    })
    
    console.log(`✅ Found ${manhwaList.length} manhwa`)
    
    await browser.close()
    return manhwaList
    
  } catch (error) {
    console.error(`❌ Error:`, error.message)
    await browser.close()
    return []
  }
}

/**
 * Scrape detail manhwa (sama seperti sebelumnya)
 */
const scrapeManhwaDetail = async (manhwaUrl, slug) => {
  try {
    console.log(`📖 Scraping detail: ${slug}`)
    
    const response = await axios.get(manhwaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://komiku.org/'
      }
    })
    
    const $ = cheerio.load(response.data)
    
    const title = $('.judul h1').text().trim()
    const alternativeTitle = $('.judul .j2').text().trim()
    const image = $('.ims img').attr('src')
    const synopsis = $('.sin').text().trim()
    
    const metadata = {}
    $('.inftable tr').each((i, el) => {
      const key = $(el).find('td').first().text().trim().toLowerCase()
      const value = $(el).find('td').last().text().trim()
      
      if (key.includes('author')) metadata.author = value
      if (key.includes('status')) metadata.status = value
      if (key.includes('type')) metadata.type = value
      if (key.includes('released')) metadata.released = value
    })
    
    const genres = []
    $('.genre li a').each((i, el) => {
      genres.push($(el).text().trim())
    })
    
    const chapters = []
    $('.chapter-list .judulseries').each((i, el) => {
      const $link = $(el).find('a')
      const chapterTitle = $link.text().trim()
      const chapterUrl = $link.attr('href')
      const chapterNumber = chapterTitle.match(/Chapter\s+(\d+\.?\d*)/i)?.[1] || ''
      const date = $(el).find('.date').text().trim()
      
      if (chapterUrl) {
        chapters.push({
          number: chapterNumber,
          title: chapterTitle,
          url: chapterUrl,
          date
        })
      }
    })
    
    const manhwaData = {
      manhwaTitle: title,
      alternativeTitle,
      manhwaUrl,
      slug,
      image,
      author: metadata.author || '',
      type: metadata.type || 'Manhwa',
      status: metadata.status || '',
      released: metadata.released || '',
      genres,
      synopsis,
      totalChapters: chapters.length,
      scrapedAt: new Date().toISOString(),
      chapters: chapters.reverse()
    }
    
    console.log(`✅ Scraped: ${title} (${chapters.length} chapters)`)
    return manhwaData
    
  } catch (error) {
    console.error(`❌ Error scraping ${slug}:`, error.message)
    return null
  }
}

/**
 * Scrape chapter images
 */
const scrapeChapterImages = async (chapterUrl) => {
  try {
    console.log(`  📄 Scraping chapter: ${chapterUrl}`)
    
    const response = await axios.get(chapterUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://komiku.org/'
      }
    })
    
    const $ = cheerio.load(response.data)
    const images = []
    
    $('#Baca_Komik img').each((index, element) => {
      const $img = $(element)
      const imageUrl = $img.attr('src') || $img.attr('data-src')
      
      if (imageUrl && !imageUrl.includes('loading') && !imageUrl.includes('icon')) {
        images.push({
          page: index + 1,
          url: imageUrl,
          filename: `page-${String(index + 1).padStart(3, '0')}.jpg`
        })
      }
    })
    
    console.log(`  ✅ Found ${images.length} images`)
    return images
    
  } catch (error) {
    console.error(`  ❌ Error scraping chapter:`, error.message)
    return []
  }
}

/**
 * Main scraper function
 */
const scrapeAllManhwa = async (maxScrolls = 5, includeImages = false) => {
  console.log(`\n🚀 Starting Komiku scraper (Puppeteer)...`)
  console.log(`📜 Max scrolls: ${maxScrolls}`)
  console.log(`🖼️  Include images: ${includeImages}\n`)
  
  // Scrape manhwa list dengan puppeteer
  const manhwaList = await scrapeManhwaListWithPuppeteer(maxScrolls)
  
  if (manhwaList.length === 0) {
    console.log(`❌ No manhwa found!`)
    return
  }
  
  console.log(`\n📊 Total manhwa found: ${manhwaList.length}\n`)
  
  // Create output directory
  const outputDir = path.join(__dirname, '../public/Chapter/komiku')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // Scrape each manhwa detail
  let successCount = 0
  let failCount = 0
  
  for (let i = 0; i < manhwaList.length; i++) {
    const manhwa = manhwaList[i]
    console.log(`\n[${i + 1}/${manhwaList.length}] Processing: ${manhwa.title}`)
    
    try {
      const manhwaData = await scrapeManhwaDetail(manhwa.url, manhwa.slug)
      
      if (!manhwaData) {
        failCount++
        continue
      }
      
      // Scrape chapter images if requested
      if (includeImages && manhwaData.chapters.length > 0) {
        console.log(`  📸 Scraping images for ${manhwaData.chapters.length} chapters...`)
        
        for (const chapter of manhwaData.chapters) {
          const images = await scrapeChapterImages(chapter.url)
          chapter.images = images
          await delay(1000)
        }
      }
      
      // Save to JSON
      const filename = `${manhwaData.slug}.json`
      const filepath = path.join(outputDir, filename)
      fs.writeFileSync(filepath, JSON.stringify(manhwaData, null, 2))
      
      console.log(`  💾 Saved: ${filename}`)
      successCount++
      
      // Delay between manhwa
      if (i < manhwaList.length - 1) {
        console.log(`  ⏳ Waiting 3s before next manhwa...`)
        await delay(3000)
      }
      
    } catch (error) {
      console.error(`  ❌ Failed to process ${manhwa.title}:`, error.message)
      failCount++
    }
  }
  
  console.log(`\n✅ Scraping complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
  console.log(`   Total: ${manhwaList.length}`)
}

/**
 * Scrape single manhwa
 */
const scrapeSingleManhwa = async (slug, includeImages = false) => {
  console.log(`\n🚀 Scraping single manhwa: ${slug}`)
  
  const manhwaUrl = `${BASE_URL}/manga/${slug}/`
  const manhwaData = await scrapeManhwaDetail(manhwaUrl, slug)
  
  if (!manhwaData) {
    console.error(`❌ Failed to scrape ${slug}`)
    return
  }
  
  if (includeImages && manhwaData.chapters.length > 0) {
    console.log(`\n📸 Scraping images for ${manhwaData.chapters.length} chapters...`)
    
    for (const chapter of manhwaData.chapters) {
      const images = await scrapeChapterImages(chapter.url)
      chapter.images = images
      await delay(1000)
    }
  }
  
  const outputDir = path.join(__dirname, '../public/Chapter/komiku')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  const filename = `${manhwaData.slug}.json`
  const filepath = path.join(outputDir, filename)
  fs.writeFileSync(filepath, JSON.stringify(manhwaData, null, 2))
  
  console.log(`\n✅ Saved: ${filename}`)
  console.log(`   Chapters: ${manhwaData.chapters.length}`)
  if (includeImages) {
    const totalImages = manhwaData.chapters.reduce((sum, ch) => sum + (ch.images?.length || 0), 0)
    console.log(`   Images: ${totalImages}`)
  }
}

// CLI
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
📚 Komiku Scraper (Puppeteer - Infinite Scroll Support)

Usage:
  node scraper-puppeteer.js list <scrolls>         # Scrape manhwa list (with scrolling)
  node scraper-puppeteer.js all <scrolls> [--images]  # Scrape all manhwa
  node scraper-puppeteer.js single <slug> [--images]  # Scrape single manhwa

Examples:
  node scraper-puppeteer.js list 5                 # Scroll 5 times to load manhwa
  node scraper-puppeteer.js all 3                  # Scroll 3 times, scrape all
  node scraper-puppeteer.js all 5 --images         # Scroll 5 times, with images
  node scraper-puppeteer.js single solo-leveling   # Scrape single manhwa
  `)
  process.exit(0)
}

const command = args[0]
const param = args[1]
const includeImages = args.includes('--images')

switch (command) {
  case 'list':
    const scrolls = parseInt(param) || 5
    scrapeManhwaListWithPuppeteer(scrolls).then(list => {
      console.log(`\n📋 Manhwa List (${list.length} items):\n`)
      console.log(JSON.stringify(list, null, 2))
    })
    break
    
  case 'all':
    const maxScrolls = parseInt(param) || 5
    scrapeAllManhwa(maxScrolls, includeImages)
    break
    
  case 'single':
    if (!param) {
      console.error('❌ Please provide manhwa slug')
      process.exit(1)
    }
    scrapeSingleManhwa(param, includeImages)
    break
    
  default:
    console.error('❌ Unknown command:', command)
    process.exit(1)
}
