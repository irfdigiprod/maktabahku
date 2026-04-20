import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import pool from "./db";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Welcome to Maktabah Syamilah API")
  
  // 5.1 Fitur: Daftar Kitab
  .get("/books", async () => {
    try {
      const [rows] = await pool.query("SELECT id, title, author FROM books");
      return { success: true, data: rows };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  })

  // 5.2 Fitur: Detail Kitab
  .get("/book", async ({ query }) => {
    const { id } = query;
    if (!id) return { success: false, error: "Missing book id" };
    try {
      const [bookResult]: any = await pool.query(
        "SELECT id, title, author FROM books WHERE id = ?",
        [id]
      );
      if (bookResult.length === 0) return { success: false, error: "Book not found" };

      const [chapters]: any = await pool.query(
        "SELECT id, title FROM chapters WHERE book_id = ?",
        [id]
      );

      return {
        success: true,
        data: {
          book: bookResult[0],
          chapters,
        },
      };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  })

  // 5.3 Fitur: Reader Kitab
  .get("/content", async ({ query }) => {
    const { chapter_id } = query;
    if (!chapter_id) return { success: false, error: "Missing chapter_id" };
    try {
      const [contents]: any = await pool.query(
        "SELECT id, content FROM contents WHERE chapter_id = ?",
        [chapter_id]
      );
      
      const [chapterResult]: any = await pool.query(
        "SELECT id, book_id, title FROM chapters WHERE id = ?",
        [chapter_id]
      );

      return { 
        success: true, 
        data: {
          chapter: chapterResult[0] || null,
          contents: contents
        }
      };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  })

  // 5.4 Fitur: Search
  .get("/search", async ({ query }) => {
    const { q } = query;
    if (!q) return { success: false, error: "Missing query q" };
    try {
      const keyword = `%${q}%`;
      const [results]: any = await pool.query(
        `SELECT c.id, c.chapter_id, c.content, ch.title as chapter_title, ch.book_id
         FROM contents c
         JOIN chapters ch ON c.chapter_id = ch.id
         WHERE c.content LIKE ?
         LIMIT 50`,
        [keyword]
      );

      return { success: true, data: results };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
