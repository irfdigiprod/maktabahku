# 📚 Product Requirements Document (PRD)

## Perpustakaan Online Berbasis Kitab (Shamela Integration)

---

# 1. 📌 Overview

## 1.1 Nama Produk

Perpustakaan Digital Kitab Kampus

## 1.2 Deskripsi

Aplikasi web untuk membaca dan mencari kitab-kitab Islam berbasis data dari library API:

- ragaeeb/shamela

Sistem memungkinkan pengguna:

- Menjelajahi kitab
- Membaca isi kitab
- Melakukan pencarian teks

---

# 2. 🎯 Tujuan Produk

## 2.1 Tujuan Utama

- Menyediakan akses digital kitab untuk mahasiswa
- Mempermudah pencarian referensi ilmiah
- Mengurangi ketergantungan pada aplikasi desktop

## 2.2 Target Pengguna

- Mahasiswa
- Dosen
- Peneliti

---

# 3. 🧱 Scope Produk

## 3.1 In Scope (MVP)

- List kitab
- Detail kitab (bab)
- Reader isi kitab
- Pencarian teks sederhana

## 3.2 Out of Scope (Versi Awal)

- Login user
- Bookmark
- Highlight
- Sinkronisasi cloud

---

# 4. 🏗️ Arsitektur Sistem

## 4.1 Teknologi

### Backend

- Bun (runtime JavaScript)
- MySQL

### Frontend

- Svelte

### Data Source

- Shamela API (ragaeeb/shamela)

---

## 4.2 Data Flow

Shamela API → JSON → Import Script → MySQL → API (Bun) → Frontend (Svelte)

---

# 5. 📦 Fitur Produk

---

## 5.1 Fitur: Daftar Kitab

### Deskripsi

Menampilkan semua kitab dalam database

### Endpoint

GET /books

### Output

- id
- title
- author

---

## 5.2 Fitur: Detail Kitab

### Deskripsi

Menampilkan daftar bab dalam kitab

### Endpoint

GET /book?id={book_id}

### Output

- data kitab
- daftar bab

---

## 5.3 Fitur: Reader Kitab

### Deskripsi

Menampilkan isi kitab per bab

### Endpoint

GET /content?chapter_id={id}

### Output

- teks isi kitab

---

## 5.4 Fitur: Search

### Deskripsi

Pencarian teks dalam isi kitab

### Endpoint

GET /search?q=keyword

### Behavior

- mencari teks menggunakan LIKE
- limit 50 hasil

---

# 6. 🗄️ Data Model

---

## 6.1 Table: books

| Field  | Type |
| ------ | ---- |
| id     | INT  |
| title  | TEXT |
| author | TEXT |

---

## 6.2 Table: chapters

| Field   | Type |
| ------- | ---- |
| id      | INT  |
| book_id | INT  |
| title   | TEXT |

---

## 6.3 Table: contents

| Field      | Type     |
| ---------- | -------- |
| id         | INT      |
| chapter_id | INT      |
| content    | LONGTEXT |

---

# 7. 🔄 Data Pipeline

---

## 7.1 Download Data

- Menggunakan script dari shamela library
- Output JSON

## 7.2 Import Data

- JSON → MySQL via Bun script

## 7.3 Penyimpanan

- Semua data lokal (tidak tergantung API runtime)

---

# 8. 🎨 UI / UX Requirements

---

## 8.1 Halaman Home

- List kitab
- Search input

## 8.2 Halaman Detail

- List bab

## 8.3 Halaman Reader

- Teks Arabic
- RTL (right-to-left)
- Font besar & nyaman dibaca

---

# 9. ⚙️ Non-Functional Requirements

---

## 9.1 Performance

- Response API < 500ms
- Query dibatasi (limit)

## 9.2 Scalability

- Awal: 10–50 kitab
- Bisa dikembangkan ke ribuan

## 9.3 Reliability

- Data disimpan lokal
- Tidak bergantung API eksternal saat runtime

---

# 10. ⚠️ Risiko & Mitigasi

---

## Risiko 1: Data besar

Solusi:

- Mulai dari sedikit kitab

## Risiko 2: Struktur JSON tidak konsisten

Solusi:

- Mapping manual 1 kitab dulu

## Risiko 3: Pencarian lambat

Solusi:

- Gunakan LIMIT
- Upgrade ke FULLTEXT

---

# 11. 📊 Success Metrics

---

## MVP berhasil jika:

- User bisa membuka kitab
- User bisa membaca isi
- Search menghasilkan hasil relevan

---

# 12. 🚀 Roadmap

---

## Phase 1 (MVP)

- Basic reader
- Basic search

## Phase 2

- Bookmark
- Highlight

## Phase 3

- Fulltext search
- Multi kitab search

---

# 13. 📋 Development Plan

---

## Backend Tasks

- Setup Bun server
- Setup MySQL
- Import script
- API endpoints

## Frontend Tasks

- Setup Svelte
- Halaman list kitab
- Halaman reader
- Integrasi API

---

# 14. ✅ Acceptance Criteria

---

## Fitur dianggap selesai jika:

### List Kitab

- Data tampil tanpa error

### Reader

- Teks muncul dengan benar

### Search

- Mengembalikan hasil relevan

---

# 15. 📌 Catatan Penting

- Gunakan data kecil dulu
- Hindari download massal di awal
- Fokus ke stabilitas, bukan fitur banyak

---

# 🎯 Kesimpulan

Produk ini adalah:

- Versi web ringan dari Syamilah
- Fokus ke akses dan pencarian kitab
- Dibangun dengan stack modern & ringan

Flow utama:
Download → Import → API → UI
