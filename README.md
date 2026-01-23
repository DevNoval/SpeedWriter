# Speed Writer Typing Test
___

## 1. 📌 Deskripsi Proyek
**Speed Writer** adalah aplikasi web interaktif untuk mengukur kecepatan dan akurasi mengetik pengguna. Website ini memiliki berbagai macam pengaturan yang bisa disesuaikan oleh usernya.

Proyek ini dirancang khusus untuk penggunaan desktop dan tidak kompatibel untuk mobile.

Kunjungi halaman webnya: https://DevNoval.github.io/SpeedWriter

___

## 2. 🎯 Tujuan Pembuatan
- Melatih kecepatan dan ketepatan mengetik
- Mengukur **WPM (Words Per Minute)** dan **Accuracy**
- Menerapkan konsep:
    1. DOM manipulation
    2. State management
    3. Modular JavaScript
    4. Persistent settings (localStorage)
- Membuat UI interaktif dengan animasi dan transisi halus

___

## 3. 🧩 Fitur Utama

### ✨ Fitur Inti
- Mode **Timer**, **Random Words**, dan **Quote**
- Caret kustom yang bergerak mengikuti teks
- Highlight kata benar & salah
- Scoreboard muncul setelah tes selesai

### ⚙️ Pengaturan (Settings)
- Tema (Light / Dark)
- Bahasa (Indonesia / English)
- Ukuran Font (Small / Medium / Large)
- Suara (ON / OFF)
- Semua setting disimpan otomatis (tanpa tombol save)

___

## 4. 📁 Struktur Folder

```
project-root/ 
│ 
├── index.html                # Halaman tes mengetik
├── README.md                 # Dokumentasi project
├── changelog.md              # Data perubahan versi
├── .gitignore                # Git ignore rules  
│ 
├── assets/ 
│   ├── css/ 
│   │   └── styles.css        # Semua styling & animasi 
│   │ 
│   ├── js/ 
│   │   ├── input.js          # Menangani logic input
│   │   ├── reset.js          # Sistem reset dan scoreboard
│   │   └── setting.js        # Manajemen settings & UI 
│   │ 
│   ├── data/ 
│   │   └── data.json        # Data kata 
│   │
│   ├── audio/               # Folder Audio
│   │
│   ├── fonts/               # Folder font 
│   │
│   └── img/                 # Folder img
```
---

## 5. 🧠 Arsitektur & Konsep

### 🧩 State Management
Menggunakan objek global `STATE` untuk menyimpan:
- currentIndex
- elapsed time
- mode (timer / words)
- settings pengguna
- daftar kata

### 💾 Persistent Settings
- Semua setting disimpan di `localStorage`

___

## 6. 📄 Penjelasan File JavaScript

### `input.js`
Menangani:
- Render kata
- Input user
- Caret movement

### `reset.js`
Menangani:
- Restart test
- Hitung WPM & Accuracy
- Timer
- Scoreboard

### `setting.js`
Menangani:
- Toggle panel settings
- Sinkronisasi UI ↔ localStorage
- Apply tema, font, bahasa
- Responsif sidebar settings


___

## 7. ⚠️ Batasan
- Tidak mendukung mobile device
- Tidak ada backend (pure frontend)
- Tidak menyimpan data pengguna secara online

---

## 8. 🚀 Cara Menjalankan
1. Clone atau download project
2. Buka `index.html` 
3. Atur preferensi dengan menekan tombol ⚙️
4. Mulai tes dan selamat mencoba!

_