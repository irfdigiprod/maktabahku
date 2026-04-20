CREATE DATABASE IF NOT EXISTS maktabahku;
USE maktabahku;

CREATE TABLE IF NOT EXISTS books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title TEXT NOT NULL,
  author TEXT
);

CREATE TABLE IF NOT EXISTS chapters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT NOT NULL,
  title TEXT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  content LONGTEXT NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- Mock Data for Testing
INSERT INTO books (id, title, author) VALUES 
(1, 'Sahih al-Bukhari', 'Muhammad ibn Ismail al-Bukhari'),
(2, 'Al-Muwatta', 'Malik ibn Anas');

INSERT INTO chapters (id, book_id, title) VALUES 
(1, 1, 'Kitab Wahyu (Permulaan Turunnya Wahyu)'),
(2, 1, 'Kitab Iman'),
(3, 2, 'Waktu Sholat');

INSERT INTO contents (id, chapter_id, content) VALUES
(1, 1, 'Bagaimana permulaan turunnya wahyu kepada Rasulullah ﷺ... (Hadits 1) Sesungguhnya setiap amalan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan. (...إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...)'),
(2, 2, 'Iman itu mencakup perkataan dan perbuatan, bisa bertambah dan bisa berkurang...'),
(3, 3, 'Waktu shalat dzuhur adalah ketika matahari telah tergelincir ke barat...');
