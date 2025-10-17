const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

// Headers
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Referer': 'https://komiku.org/'
}

// Delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Scrape manhwa detail
 */
const scrapeManhwaDetail = async (slug) => {
  try {
    const url = `https://komiku.org/manga/${slug}/`
    console.log(`\n📖 Scraping: ${slug}`)
    console.log(`🌐 URL: ${url}`)
    
    const response = await axios.get(url, { headers })
    const $ = cheerio.load(response.data)
    
    // Title - try multiple selectors
    const title = $('h1').first().text().trim() ||
                  $('.judul h1').first().text().trim() ||
                  $('h1[itemprop="name"]').first().text().trim() ||
                  $('#Judul h2').first().text().trim()
    
    // Alternative title (will be updated from table if found)
    let alternativeTitle = $('.judul .j2').text().trim() || ''
    
    // Synopsis - berdasarkan foto: <p class="desc">
    const synopsis = $('p.desc').text().trim() ||
                     $('.desc').text().trim() ||
                     $('p[itemprop="description"]').text().trim() ||
                     $('.sin').text().trim()
    
    // Image - berdasarkan foto: <div class="ims">
    const image = $('.ims img').attr('src') || 
                  $('.ims img').attr('data-src') ||
                  $('img[itemprop="image"]').attr('src')
    
    // Metadata - berdasarkan foto: <table class="inftable">
    let author = ''
    let status = ''
    let type = 'Manhwa'
    let released = ''
    let alternativeTitleFromTable = ''
    
    // Try table.inftable (main selector)
    $('table.inftable tr, .inftable tr').each((i, el) => {
      const $tds = $(el).find('td')
      if ($tds.length >= 2) {
        const key = $tds.eq(0).text().trim().toLowerCase()
        const value = $tds.eq(1).text().trim()
        
        // Debug log
        // console.log(`  Key: "${key}" → Value: "${value}"`)
        
        // Pengarang / Author
        if (key.includes('pengarang') || key.includes('author')) {
          author = value
        }
        // Status
        else if (key.includes('status')) {
          status = value
        }
        // Jenis Komik / Type
        else if (key.includes('jenis') || key.includes('type') || key.includes('komik')) {
          type = value
        }
        // Umur Pembaca / Released
        else if (key.includes('umur pembaca') || key.includes('umur') || key.includes('released') || key.includes('terbit')) {
          released = value
        }
        // Judul Indonesia (alternative title)
        else if (key.includes('judul indonesia') || key.includes('alternative') || key === 'judul indonesia') {
          alternativeTitleFromTable = value
        }
      }
    })
    
    // Try #Informasi > table.inftable as fallback
    if (!author || !status) {
      $('#Informasi table.inftable tr, #Informasi .inftable tr').each((i, el) => {
        const $tds = $(el).find('td')
        if ($tds.length >= 2) {
          const key = $tds.eq(0).text().trim().toLowerCase()
          const value = $tds.eq(1).text().trim()
          
          if (!author && (key.includes('pengarang') || key.includes('author'))) author = value
          if (!status && key.includes('status')) status = value
          if (!type && (key.includes('jenis') || key.includes('type'))) type = value
          if (!released && (key.includes('umur') || key.includes('released'))) released = value
        }
      })
    }
    
    // Genres - berdasarkan foto: <ul class="genre"> <li class="genre">
    const genres = []
    $('ul.genre li.genre').each((i, el) => {
      const genre = $(el).find('a span[itemprop="genre"]').text().trim() ||
                    $(el).find('a').text().trim()
      if (genre) genres.push(genre)
    })
    
    // Chapters - berdasarkan foto: <table id="Daftar_Chapter"> <tbody class="_3Rsjq">
    const chapters = []
    
    // Try selector dari foto
    $('#Daftar_Chapter tbody._3Rsjq tr').each((i, el) => {
      const $row = $(el)
      const $link = $row.find('td.judulseries a')
      
      const chapterTitle = $link.text().trim()
      let chapterUrl = $link.attr('href')
      const chapterNumber = $row.attr('data-ch') || 
                           chapterTitle.match(/Chapter\s+(\d+\.?\d*)/i)?.[1] ||
                           chapterTitle.match(/(\d+\.?\d*)/)?.[1] || ''
      const date = $row.find('td.tanggalseries').text().trim()
      
      // Fix URL if relative
      if (chapterUrl && !chapterUrl.startsWith('http')) {
        chapterUrl = `https://komiku.org${chapterUrl}`
      }
      
      if (chapterUrl) {
        chapters.push({
          number: chapterNumber,
          title: chapterTitle,
          url: chapterUrl,
          date
        })
      }
    })
    
    // Fallback selector jika tidak ada
    if (chapters.length === 0) {
      $('.chapter-list .judulseries, #Daftar_Chapter .judulseries').each((i, el) => {
        const $link = $(el).find('a')
        const chapterTitle = $link.text().trim()
        let chapterUrl = $link.attr('href')
        const chapterNumber = chapterTitle.match(/Chapter\s+(\d+\.?\d*)/i)?.[1] ||
                             chapterTitle.match(/(\d+\.?\d*)/)?.[1] || ''
        const date = $(el).find('.date, .tanggalseries').text().trim()
        
        // Fix URL if relative
        if (chapterUrl && !chapterUrl.startsWith('http')) {
          chapterUrl = `https://komiku.org${chapterUrl}`
        }
        
        if (chapterUrl) {
          chapters.push({
            number: chapterNumber,
            title: chapterTitle,
            url: chapterUrl,
            date
          })
        }
      })
    }
    
    // Use alternative title from table if found
    if (alternativeTitleFromTable) {
      alternativeTitle = alternativeTitleFromTable
    }
    
    // Prepare data
    const manhwaData = {
      manhwaTitle: title,
      alternativeTitle,
      manhwaUrl: url,
      slug,
      image,
      author,
      type,
      status,
      released,
      genres,
      synopsis,
      totalChapters: chapters.length,
      scrapedAt: new Date().toISOString(),
      chapters: chapters.reverse() // Ascending order
    }
    
    console.log(`✅ Title: ${manhwaData.manhwaTitle}`)
    console.log(`   Author: ${manhwaData.author}`)
    console.log(`   Status: ${manhwaData.status}`)
    console.log(`   Genres: ${manhwaData.genres.join(', ')}`)
    console.log(`   Chapters: ${manhwaData.totalChapters}`)
    
    // Save to JSON
    const outputDir = path.join(__dirname, '../public/Chapter/komiku')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    const filename = `${slug}.json`
    const filepath = path.join(outputDir, filename)
    fs.writeFileSync(filepath, JSON.stringify(manhwaData, null, 2))
    
    console.log(`💾 Saved: ${filename}\n`)
    
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
    console.log(`  📄 Scraping images: ${chapterUrl}`)
    
    const response = await axios.get(chapterUrl, { headers })
    const $ = cheerio.load(response.data)
    
    const images = []
    
    // Berdasarkan foto: <div id="Baca_Komik"> <img itemprop="image">
    $('#Baca_Komik img[itemprop="image"]').each((index, element) => {
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
    
    // Fallback: all images in #Baca_Komik
    if (images.length === 0) {
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
    }
    
    console.log(`  ✅ Found ${images.length} images`)
    return images
    
  } catch (error) {
    console.error(`  ❌ Error scraping images:`, error.message)
    return []
  }
}

/**
 * Scrape images in parallel (batch)
 */
const scrapeImagesParallel = async (chapters, batchSize = 10) => {
  const results = []
  
  for (let i = 0; i < chapters.length; i += batchSize) {
    const batch = chapters.slice(i, i + batchSize)
    console.log(`  📸 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chapters.length / batchSize)} (${batch.length} chapters)`)
    
    // Scrape batch in parallel
    const promises = batch.map(chapter => scrapeChapterImages(chapter.url))
    const batchResults = await Promise.all(promises)
    
    // Assign images to chapters
    batch.forEach((chapter, idx) => {
      chapter.images = batchResults[idx]
    })
    
    results.push(...batch)
    
    // Small delay between batches
    if (i + batchSize < chapters.length) {
      await delay(500)
    }
  }
  
  return results
}

/**
 * Scrape from list
 */
const scrapeFromList = async (maxManhwa = 10, includeImages = false) => {
  console.log(`\n🚀 Scraping manhwa from list...`)
  
  const listPath = path.join(__dirname, '../public/komiku-list.json')
  
  if (!fs.existsSync(listPath)) {
    console.error(`❌ List not found! Run: node list-manhwa.js first`)
    return
  }
  
  const manhwaList = JSON.parse(fs.readFileSync(listPath, 'utf8'))
  const toScrape = manhwaList.slice(0, maxManhwa)
  
  console.log(`📚 Total in list: ${manhwaList.length}`)
  console.log(`📖 Scraping: ${toScrape.length} manhwa`)
  console.log(`🖼️  Include images: ${includeImages}`)
  if (includeImages) {
    console.log(`⚡ Parallel scraping: 10 chapters at a time`)
  }
  console.log()
  
  let success = 0
  let failed = 0
  let skipped = 0
  
  const outputDir = path.join(__dirname, '../public/Chapter/komiku')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  for (let i = 0; i < toScrape.length; i++) {
    const manhwa = toScrape[i]
    console.log(`[${i + 1}/${toScrape.length}] ${manhwa.title}`)
    
    // Check if already scraped
    const filepath = path.join(outputDir, `${manhwa.slug}.json`)
    if (fs.existsSync(filepath)) {
      // Check if need to scrape images
      if (includeImages) {
        const existingData = JSON.parse(fs.readFileSync(filepath, 'utf8'))
        const hasImages = existingData.chapters.some(ch => ch.images && ch.images.length > 0)
        
        if (hasImages) {
          console.log(`  ⏭️  Already scraped with images, skipping...`)
          skipped++
          continue
        } else {
          console.log(`  📸 Already scraped, adding images...`)
          // Continue to scrape images
        }
      } else {
        console.log(`  ⏭️  Already scraped, skipping...`)
        skipped++
        continue
      }
    }
    
    try {
      const manhwaData = await scrapeManhwaDetail(manhwa.slug)
      
      if (manhwaData) {
        // Scrape images if requested
        if (includeImages && manhwaData.chapters.length > 0) {
          console.log(`  📸 Scraping images for ${manhwaData.chapters.length} chapters...`)
          
          // Use parallel scraping (10 chapters at a time)
          await scrapeImagesParallel(manhwaData.chapters, 10)
          
          // Re-save with images
          fs.writeFileSync(filepath, JSON.stringify(manhwaData, null, 2))
          
          const totalImages = manhwaData.chapters.reduce((sum, ch) => sum + (ch.images?.length || 0), 0)
          console.log(`  💾 Updated with ${totalImages} images`)
        }
        
        success++
      } else {
        failed++
      }
      
      if (i < toScrape.length - 1) {
        console.log(`⏳ Waiting 1s...`)
        await delay(1000)
      }
      
    } catch (error) {
      console.error(`❌ Failed: ${manhwa.title}`)
      failed++
    }
  }
  
  console.log(`\n✅ Complete!`)
  console.log(`   Success: ${success}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Total: ${toScrape.length}`)
}

// CLI
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
📚 Komiku Simple Scraper (Axios + Cheerio)

Usage:
  node scrape-simple.js <slug>                    # Scrape single manhwa
  node scrape-simple.js --list <count>            # Scrape from list
  node scrape-simple.js --list <count> --images   # Scrape with images

Examples:
  node scrape-simple.js solo-leveling-id
  node scrape-simple.js --list 10
  node scrape-simple.js --list 10 --images
  `)
  process.exit(0)
}

if (args[0] === '--list') {
  const count = parseInt(args[1]) || 10
  const includeImages = args.includes('--images')
  scrapeFromList(count, includeImages)
} else {
  const slug = args[0]
  scrapeManhwaDetail(slug)
}
