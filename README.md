# 📚 Maktabah Digital (Syamilah Web)

Aplikasi web moderen, ringan, dan cepat untuk menelusuri kitab Islam berbasis API. 
Maktabah Digital menggunakan stack **Bun + Elysia + MySQL** di Backend dan **Svelte + Vite + Tailwind 3** di Frontend.

## 🌟 Fitur MVP
1. **Daftar Kitab**: Menampilkan kitab yang tersedia dalam database.
2. **Daftar Bab / Pasal**: Klik pada kitab untuk melihat indeks.
3. **Reader (Pembaca Arab)**: Teks dioptimalkan dengan pembaca RTL yang bersih, modern dan responsif.
4. **Pencarian Teks**: Anda dapat mencari potongan kalimat untuk segera menuju pasalnya.

## 🛠 Instalasi dan Konfigurasi

### 1. Persiapkan Database (MySQL)
Program ini menggunakan MySQL untuk menyimpan dan memanggil data secara relasional dan stabil.
Pastikan MySQL sudah berjalan di komputer / server Anda.

1. Buka MySQL client favorit Anda (DBeaver, phpMyAdmin, atau via Terminal).
2. Jalankan skrip `backend/schema.sql` untuk menginisalisasi Database, Tabel, dan beberapa Data Dummy (sebagai testing).

### 2. Jalankan API Backend
Pastikan [Bun](https://bun.sh/) sudah ter-install di server / OS Anda.

```bash
cd backend
bun install
bun run src/index.ts
```
Backend API akan berjalan di `http://localhost:3000`. Jika Anda ingin mengubah host / user MySQL, edit dan sesuaikan kredensial di file `.env` dalam folder `backend/`.

### 3. Jalankan Aplikasi Frontend (Web UI)
Frontend dibangun menggunakan Svelte dengan Vite JS dan memanggil API dari `localhost:3000`.

```bash
cd frontend
bun install
bun run dev
```

Anda dapat mengakses UI pada `http://localhost:5173`. UI / Tampilan sudah didukung dengan Tailwind CSS 3 yang cantik, Dark Mode otomatis (tergantung OS), font khusus untuk bahasa Arab (Amiri), dan Micro-animation.

## 🏗 Struktur Proyek
```text
maktabahku/
├── backend/
│   ├── .env          (Konfigurasi Database)
│   ├── schema.sql    (Skema Tabel dan Dummy Data)
│   ├── src/index.ts  (Routing Elysia API)
│   └── src/db.ts     (Koneksi MySQL)
└── frontend/
    ├── src/App.svelte (Implementasi UI dan Integrasi API)
    ├── src/app.css    (Sistem Design Tailwind / Font Arab)
    ├── tailwind.config.js
    └── ...
```

Semua MVP Request yang ditulis pada `PRD.md` telah diselesaikan dalam kerangka modular yang sangat mudah jika ingin diperluas dengan Phase 2 (Bookmark, dll).
