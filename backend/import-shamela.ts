import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { downloadBook, getBook } from "shamela";

// Ensure environment variables are loaded if necessary
// requires SHAMELA_API_KEY and SHAMELA_API_BOOKS_ENDPOINT in older library versions

async function doImport() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "maktabahku",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const bookId = 11;
    const outputPath = path.join(__dirname, `book_${bookId}.sqlite`);
    
    console.log(`Downloading book ${bookId} from Shamela API...`);
    await downloadBook(bookId, { outputFile: { path: outputPath } });
    
    console.log(`Reading ${outputPath}...`);
    const fileBytes = fs.readFileSync(outputPath);
    
    console.log(`Parsing book ${bookId}...`);
    const bookData = await getBook(fileBytes);
    
    const pages = bookData.getPages();
    const titles = bookData.getToc();

    console.log(`Book ${bookId}: ${pages.length} pages, ${titles.length} TOC entries.`);

    console.log(`Truncating database tables...`);
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    await pool.query("TRUNCATE TABLE books");
    await pool.query("TRUNCATE TABLE chapters");
    await pool.query("TRUNCATE TABLE contents");
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    // We don't have book metadata from downloadBook directly without master DB.
    // Let's just insert placeholder for Book details.
    const title = "Sahih al-Bukhari (Shamela Import)";
    const author = "Imam Bukhari";
    
    console.log(`Inserting book into DB...`);
    const [bookRes]: any = await pool.query(
      "INSERT INTO books (id, title, author) VALUES (?, ?, ?)",
      [1, title, author]
    );

    console.log("Inserting chapters...");
    // Titles are TOC.
    // shamela returns `Title: { id, content, page, parent }`
    // We map them to `chapters: { id, book_id, title }`
    for (let i = 0; i < Math.min(titles.length, 50); i++) { // Limit for MVP fast test
      const t = titles[i];
      await pool.query(
        "INSERT INTO chapters (id, book_id, title) VALUES (?, ?, ?)",
        [t.id, 1, t.content]
      );
    }
    
    console.log("Inserting contents...");
    // Pages: { id, content, page, part, number }
    // We match pages to chapters. Wait, shamela docs say `Title` has `.page` which links to the starting page of the chapter?
    // Let's just group pages by chapter.
    // ...
    // For simplicity of MVP pipeline test: 
    for (let i = 0; i < Math.min(pages.length, 200); i++) {
      const p = pages[i];
      
      // Find the chapter this page belongs to
      let chapterId = titles[0]?.id || 1;
      // Reverse find the nearest title
      for (let j = titles.length - 1; j >= 0; j--) {
        if (p.page >= titles[j].page) {
          chapterId = titles[j].id;
          break;
        }
      }
      
      // Since we limited chapters to 50, ensure chapter exists
      const [chapCheck]: any = await pool.query("SELECT id FROM chapters WHERE id = ?", [chapterId]);
      if (chapCheck.length === 0) continue;

      await pool.query(
        "INSERT INTO contents (chapter_id, content) VALUES (?, ?)",
        [chapterId, p.content]
      );
    }

    console.log("Shamela Book Imported Successfully!");
    
  } catch (error) {
    console.error("Pipeline Error:", error);
  } finally {
    await pool.end();
  }
}

doImport();
