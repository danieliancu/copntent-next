import puppeteer from "puppeteer";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

const sitesConfig = {
    g4media: {
      url: "https://g4media.ro",
      tags: [{ tag: "div.post-review", contentSelector: "h3" }],
      cat: "Actualitate",
    },
    hotnews: {
      url: "https://hotnews.ro",
      tags: [{ tag: "article", contentSelector: "h2" }],
      cat: "Actualitate",
    },
    spotmedia: {
      url: "https://spotmedia.ro",
      tags: [{ tag: "div.jet-smart-listing__post", contentSelector: "div.mbm-h5" }],
      tags: [{ tag: "div.jet-smart-listing__post", contentSelector: "div.mbm-h6" }],
      cat: "Actualitate",
    },
    ziare: {
      url: "https://ziare.com",
      tags: [
        { tag: "div.spotlight__article", contentSelector: "h1.spotlight__article__title" },
        { tag: "div.spotlight__article", contentSelector: "h2.spotlight__article__title" },
        { tag: "div.news__article", contentSelector: "h3.news__article__title" },
      ],
      cat: "Actualitate",
    },
    digi24: {
      url: "https://digi24.ro",
      tags: [
        { tag: "article.article-alt", contentSelector: "h3.article-title" },
        { tag: "article", contentSelector: "h4.article-title" },      
      ],
      cat: "Actualitate",
    },
    libertatea: {
      url: "https://libertatea.ro",
      tags: [
        { tag: "div.news-item", contentSelector: "h3.article-title" },
        { tag: "div.news-item", contentSelector: "h2.article-title" },
      ],
      cat: "Actualitate",
    },
    stirileprotv: {
      url: "https://stirileprotv.ro",
      tags: [{ tag: "article.article", contentSelector: "h3.article-title-daily" }],
      cat: "Actualitate",
    }, 
    news: {
      url: "https://news.ro",
      tags: [{ tag: "article.article", contentSelector: "h2" }],
      cat: "Actualitate",
    },   
    gsp: {
      url: "https://gsp.ro",
      tags: [{ tag: "div.news-item", contentSelector: "h2" }],
      cat: "Sport",
    },          
    prosport: {
      url: "https://prosport.ro",
      tags: [{ tag: "div.article--wide", contentSelector: "h2.article__title" }],
      cat: "Sport",
    },            
  };

  const scrapeTags = async (page, tags, source) => {
    const results = [];
    const seenLinks = new Set();
  
    for (const { tag, contentSelector } of tags) {
      const elements = await page.$$eval(
        tag,
        (elements, contentSelector) =>
          elements.map((el) => {
            const imgElement = el.querySelector("img");
            const imgSrc =
              imgElement?.getAttribute("data-src") || imgElement?.src || null;
  
            const contentElement = el.querySelector(contentSelector);
            const link = contentElement ? contentElement.querySelector("a") : null;
  
            return {
              imgSrc: imgSrc,
              text: contentElement ? contentElement.textContent.trim() : null,
              href: link ? link.href : null,
            };
          }),
        contentSelector
      );
  
      elements.forEach((element) => {
        if (element.href && !seenLinks.has(element.href)) {
          seenLinks.add(element.href);
          results.push({ ...element, source });
        }
      });
    }
    return results;
  };
  

export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const report = {
      totalScraped: 0,
      inserted: 0,
      skipped: 0,
      details: [],
    };
  
    try {
      const browser = await puppeteer.launch({ headless: true });
  
      for (const source in sitesConfig) {
        const { url, tags } = sitesConfig[source];
  
        try {
          const page = await browser.newPage();
          await page.goto(url, { waitUntil: "domcontentloaded" });
  
          const scrapedData = await scrapeTags(page, tags, source);
          report.totalScraped += scrapedData.length;
  
          const connection = await pool.getConnection();
  
          for (const item of scrapedData) {
            const [existing] = await connection.query(
              "SELECT id FROM articles WHERE href = ?",
              [item.href]
            );
  
            if (existing.length === 0) {
              // Insert în baza de date
              await connection.query(
                "INSERT INTO articles (source, text, href, imgSrc) VALUES (?, ?, ?, ?)",
                [item.source, item.text, item.href, item.imgSrc]
              );
              report.inserted += 1;
              report.details.push({ action: "inserted", item });
            } else {
              // Skipped deoarece articolul există deja
              report.skipped += 1;
              report.details.push({
                action: "skipped",
                reason: "Already exists",
                item,
              });
            }
          }
  
          connection.release();
          await page.close();
        } catch (siteError) {
          console.error(`Error scraping site ${source}:`, siteError.message);
        }
      }
  
      await browser.close();
  
      // Afișarea raportului în terminal
      console.log("\nScraping Report:");
      console.log(`- Total articles scraped: ${report.totalScraped}`);
      console.log(`- Total articles inserted: ${report.inserted}`);
      console.log(`- Total articles skipped: ${report.skipped}`);
      console.log("\nDetails:");
      report.details.forEach((detail, index) => {
        console.log(`${index + 1}. Action: ${detail.action}`);
        if (detail.action === "skipped") {
          console.log(`   Reason: ${detail.reason}`);
        }
        console.log(`   Source: ${detail.item.source}`);
        console.log(`   Title: ${detail.item.text}`);
        console.log(`   Link: ${detail.item.href}`);
      });
  
      res.json({
        message: "Scraping completed.",
        report: {
          totalScraped: report.totalScraped,
          inserted: report.inserted,
          skipped: report.skipped,
        },
      });
    } catch (error) {
      console.error("Error in scraping:", error.message);
      res.status(500).json({ error: "Scraping failed" });
    }
  }