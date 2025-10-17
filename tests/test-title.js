const axios = require('axios')
const cheerio = require('cheerio')

const testTitle = async () => {
  const url = 'https://komiku.org/manga/solo-leveling-id/'
  
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  })
  
  const $ = cheerio.load(response.data)
  
  console.log('\n🔍 Testing title selectors:\n')
  
  console.log('1. #Judul h2:', $('#Judul h2').first().text().trim())
  console.log('2. .judul h1:', $('.judul h1').first().text().trim())
  console.log('3. h1[itemprop="name"]:', $('h1[itemprop="name"]').first().text().trim())
  console.log('4. h2[style*="font-size"]:', $('h2[style*="font-size: 17px"]').first().text().trim())
  console.log('5. .info h1:', $('.info h1').first().text().trim())
  console.log('6. h1:', $('h1').first().text().trim())
  console.log('7. .title:', $('.title').first().text().trim())
  console.log('8. meta[property="og:title"]:', $('meta[property="og:title"]').attr('content'))
}

testTitle()
