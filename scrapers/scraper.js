const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

// Base URL
const BASE_URL = 'https://komiku.org'
const MANHWA_LIST_URL = 'https://komiku.org/pustaka/?orderby=meta_value_num&tipe=manhwa&genre=&genre2=&status='

// Headers untuk request
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Referer': 'https://komiku.org/'
}

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Scrape manhwa list dari halaman pustaka
 */
const scrapeManhwaList = async (page = 1) => {
  try {
    const url = page > 1 ? `${MANHWA_LIST_URL}&page=${page}` : MANHWA_LIST_URL
    console.log(`📚 Scraping page ${page}: ${url}`)
    
    const response = await axios.get(url, { headers })
    const $ = cheerio.load(response.data)
    const manhwaList = []
    
    // Selector berdasarkan screenshot: div.bge > div.kan > a
    $('.bge').each((index, element) => {
      const $element = $(element)
      const $link = $element.find('.kan a')
      const $title = $link.find('h3')
      const $image = $element.find('.bgei img')
      const $genre = $element.find('.genre span')
      
      // Extract data
      const title = $title.text().trim()
      const url = $link.attr('href')
      const slug = url ? url.split('/manga/')[1]?.replace('/', '') : ''
      const image = $image.attr('src') || $image.attr('data-src')
      
      // Extract genres
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
    
    console.log(`✅ Found ${manhwaList.length} manhwa on page ${page}`)
    return manhwaList
    
  } catch (error) {
    console.error(`❌ Error scraping page ${page}:`, error.message)
    return []
  }
}

/**
 * Scrape detail manhwa
 */
const scrapeManhwaDetail = async (manhwaUrl, slug) => {
  try {
    console.log(`📖 Scraping detail: ${slug}`)
    
    const response = await axios.get(manhwaUrl, { headers })
    const $ = cheerio.load(response.data)
    
    // Extract detail info
    const title = $('.judul h1').text().trim()
    const alternativeTitle = $('.judul .j2').text().trim()
    const image = $('.ims img').attr('src')
    const synopsis = $('.sin').text().trim()
    
    // Extract metadata
    const metadata = {}
    $('.inftable tr').each((i, el) => {
      const key = $(el).find('td').first().text().trim().toLowerCase()
      const value = $(el).find('td').last().text().trim()
      
      if (key.includes('author')) metadata.author = value
      if (key.includes('status')) metadata.status = value
      if (key.includes('type')) metadata.type = value
      if (key.includes('released')) metadata.released = value
    })
    
    // Extract genres
    const genres = []
    $('.genre li a').each((i, el) => {
      genres.push($(el).text().trim())
    })
    
    // Extract chapters
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
      chapters: chapters.reverse() // Reverse to get ascending order
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
    
    const response = await axios.get(chapterUrl, { headers })
    const $ = cheerio.load(response.data)
    
    const images = []
    
    // Komiku uses #Baca_Komik img for chapter images
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
 * Scrape all manhwa with chapters and images
 */
const scrapeAllManhwa = async (maxPages = 1, includeImages = false) => {
  console.log(`\n🚀 Starting Komiku scraper...`)
  console.log(`📚 Max pages: ${maxPages}`)
  console.log(`🖼️  Include images: ${includeImages}\n`)
  
  const allManhwa = []
  
  // Scrape manhwa list from multiple pages
  for (let page = 1; page <= maxPages; page++) {
    const manhwaList = await scrapeManhwaList(page)
    allManhwa.push(...manhwaList)
    
    if (page < maxPages) {
      console.log(`⏳ Waiting 2s before next page...`)
      await delay(2000)
    }
  }
  
  console.log(`\n📊 Total manhwa found: ${allManhwa.length}\n`)
  
  // Create output directory
  const outputDir = path.join(__dirname, '../public/Chapter/komiku')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // Scrape each manhwa detail
  let successCount = 0
  let failCount = 0
  
  for (let i = 0; i < allManhwa.length; i++) {
    const manhwa = allManhwa[i]
    console.log(`\n[${i + 1}/${allManhwa.length}] Processing: ${manhwa.title}`)
    
    try {
      // Scrape manhwa detail
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
          await delay(1000) // Delay between chapters
        }
      }
      
      // Save to JSON
      const filename = `${manhwaData.slug}.json`
      const filepath = path.join(outputDir, filename)
      fs.writeFileSync(filepath, JSON.stringify(manhwaData, null, 2))
      
      console.log(`  💾 Saved: ${filename}`)
      successCount++
      
      // Delay between manhwa
      if (i < allManhwa.length - 1) {
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
  console.log(`   Total: ${allManhwa.length}`)
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
  
  // Scrape chapter images if requested
  if (includeImages && manhwaData.chapters.length > 0) {
    console.log(`\n📸 Scraping images for ${manhwaData.chapters.length} chapters...`)
    
    for (const chapter of manhwaData.chapters) {
      const images = await scrapeChapterImages(chapter.url)
      chapter.images = images
      await delay(1000)
    }
  }
  
  // Save to JSON
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
📚 Komiku Scraper

Usage:
  node scraper.js list <pages>              # Scrape manhwa list (multiple pages)
  node scraper.js all <pages> [--images]    # Scrape all manhwa with details
  node scraper.js single <slug> [--images]  # Scrape single manhwa

Examples:
  node scraper.js list 3                    # Scrape 3 pages of manhwa list
  node scraper.js all 1                     # Scrape all manhwa from page 1 (no images)
  node scraper.js all 1 --images            # Scrape all manhwa from page 1 (with images)
  node scraper.js single solo-leveling      # Scrape Solo Leveling (no images)
  node scraper.js single solo-leveling --images  # Scrape Solo Leveling (with images)
  `)
  process.exit(0)
}

const command = args[0]
const param = args[1]
const includeImages = args.includes('--images')

switch (command) {
  case 'list':
    const pages = parseInt(param) || 1
    scrapeManhwaList(pages).then(list => {
      console.log(JSON.stringify(list, null, 2))
    })
    break
    
  case 'all':
    const maxPages = parseInt(param) || 1
    scrapeAllManhwa(maxPages, includeImages)
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
