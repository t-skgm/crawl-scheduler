const crypto = require('crypto');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

const args = process.argv.slice(2)

const mongoUrl = 'mongodb://root:password@mongodb:27017';

const dbConfig = {
  name: 'crawler',
  collections: {
    contents: 'contents'
  }
};

function calcMd5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

async function saveToMongo(url, body) {
  const conn = await MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const contentsColl = conn.db(dbConfig.name).collection(dbConfig.collections.contents);
  const res = await contentsColl.insertOne({
    urlMd5: calcMd5(url),
    url,
    body,
    crawledAt: new Date()
  });
  console.log('mongo res:', res.result);

  await conn.close();
}

// ===========================

async function crawl(url) {
  console.log('start to crawl:', url)
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();
  await browser.close();
  return content
}

// ===========================

async function main() {
  const url = args[0];
  if (!url) throw Error('url is required');

  const content = await crawl(url);
  await saveToMongo(url, content);
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
