import { downloadBook, getBook, configure, downloadMasterDatabase, getMaster } from "shamela";

configure({
  logger: console
});

async function testFetch() {
  const url = "https://shamela.ws/books/001/11.rar"; // standard book url
  console.log("Shamela library try download");
  try {
    const bytes = await downloadBook(11);
    console.log("length:", bytes.length);
  } catch(e) { console.error("Error", e); }
}
testFetch();
