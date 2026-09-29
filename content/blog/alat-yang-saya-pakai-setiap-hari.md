---
title: "Alat yang Saya Pakai Setiap Hari untuk Ngoding"
slug: alat-yang-saya-pakai-setiap-hari
date: 2026-09-29
excerpt: "Pertanyaan yang paling sering muncul dari developer lain: pakai apa? Ini daftar lengkapnya — OS, editor, terminal, bahasa, dan alat ops yang saya pakai untuk bangun portfolio ini."
tags: [Tools, Setup, Linux]
---

Pertanyaan yang paling sering saya dengar dari sesama developer bukan "gimana caranya?" tapi **"pakai apa?"** — editor apa, terminal apa, OS apa.

Jadi ini jawabannya, lengkap. Semua yang saya pakai untuk membangun dan mengurus situs ini, dari laptop sampai server.

## Sistem Operasi: CachyOS

Saya pakai **CachyOS** — distro Linux berbasis Arch, tapi dengan kernel yang sudah dioptimasi (BORE scheduler, paket kompilasi dengan flag performa).

Kenapa Arch-based? Karena saya suka kontrol penuh atas apa yang terpasang. Tidak ada aplikasi bawaan yang tidak saya pakai, tidak ada update yang datang tanpa saya minta. `pacman` cepat, AUR punya hampir semua yang saya butuh.

CachyOS-nya sendiri menyumbang satu hal besar: **paket yang sudah dioptimasi**. Build kernel dan library-nya dikompilasi untuk performa, jadi terasa lebih responsif dari Arch polos — terutama waktu compile atau jalan container.

Kalau kamu tertarik Arch tapi malas setup dari nol, CachyOS salah satu titik masuk yang bagus.

## Terminal: Fish Shell

Terminal saya **Fish**, bukan Bash atau Zsh.

Alasannya sederhana: **autosuggestion dan syntax highlighting sudah built-in**. Saya tidak perlu pasang oh-my-zsh, plugin, dan config 200 baris cuma buat dapat dua fitur itu. Di Fish, ketik `docker ` dan dia langsung menyaranakan perintah yang pernah saya pakai.

Yang saya simpan di config cuma hal-hal yang benar-benar sering dipakai. Contohnya alias untuk Docker — karena di laptop ini Docker saya matikan kalau tidak dipakai (biar baterai awet dan RAM lega):

```bash
alias docker-start 'sudo systemctl unmask docker.socket; sudo systemctl start docker.service'
alias docker-stop  'sudo systemctl stop docker.socket docker.service; sudo systemctl mask docker.socket'
```

Satu baris pendek, hemat empat perintah yang harus dihafal.

## Editor: VS Code

Editor saya **VS Code**, dengan sekitar 25 extension. Tapi yang benar-benar mengubah cara kerja cuma beberapa:

- **Volar** — wajib untuk Vue. Tanpa ini, `<script setup>` dan template terasa seperti dua bahasa terpisah yang saling tidak kenal.
- **Tailwind CSS IntelliSense** — autocomplete class Tailwind. Terdengar sepele sampai kamu salah ketik `gap-4` jadi `gap4` dan tidak ada yang memberi tahu.
- **ESLint** — saya pakai mode `--max-warnings=0`. Peringatan sekecil apa pun menggagalkan build.
- **Dart & Flutter** — untuk kerjaan mobile.
- **Dracula** — tema gelap. Ini murni selera, tapi mata saya sudah terlanjur cocok.

Saya juga sesekali pakai **Neovim** untuk edit file cepat dari terminal. Tidak pakai config rumit — cukup yang bisa dibuka, diubah, dan ditutup.

## Bahasa & Runtime

Ini yang paling sering ditanya, jadi saya rinci:

**Vue 3 + TypeScript** untuk frontend. Composition API, `<script setup>`, dan Vite. Untuk styling: **Tailwind v4** plus **daisyUI v5** — komponen siap pakai yang tetap bisa dikustom.

**Go** untuk backend. Situs ini dilayani satu service Go yang menangani kutipan, tautan, cuplikan, dan pesan pengunjung. Satu binary, satu container, tanpa dependency runtime yang aneh.

**Bun** sebagai package manager dan test runner. `bun install` selesai dalam sekejap, `bun test` juga jalan. Ini bagian yang paling terasa bedanya dibanding npm.

**Docker Compose** untuk menjalankan semuanya. Di server, service Go, database Postgres, dan preview server untuk kartu Open Graph semuanya naik dengan satu perintah.

## Server & Deploy

Situs ini jalan di **VPS** dengan:

- **Nginx** sebagai reverse proxy dan penyaji file statis
- **Cloudflare** di depan sebagai CDN dan pelindung
- **GitHub Actions** untuk CI/CD — push ke `main`, build jalan di runner, hasilnya dikirim ke server

Alur deploy saya sengaja dibuat membosankan:

1. Edit kode di laptop
2. Push ke branch `development` → otomatis naik ke situs uji
3. Cek tampilannya
4. Push `development` ke `main` → naik ke situs produksi

Tidak ada langkah manual, tidak ada `rsync` yang harus diingat urutannya, tidak ada "eh lupa upload file yang ini".

## Database: PostgreSQL

Semua data dinamis — kutipan, tautan, cuplikan, pengalaman kerja, pesan pengunjung — ada di **PostgreSQL**, di dalam container Docker.

Kenapa Postgres dan bukan yang lebih ringan? Karena saya butuh hal-hal seperti constraint, foreign key, dan tipe data yang serius. Untuk data yang isinya sedikit tapi penting, database yang tepat lebih berharga daripada database yang cepat di-setup.

## Alat Bantu

Beberapa hal kecil yang ternyata sering kepakai:

- **direnv** — otomatis memuat environment variable saat masuk folder proyek. Tidak perlu lagi `source .env` manual.
- **ffmpeg** — untuk urusan video dan gambar. Sekali pakai, langsung hafal perintahnya.
- **Wakatime** — mencatat waktu ngoding. Bukan untuk pamer, tapi supaya saya tahu proyek mana yang sebenarnya saya kerjakan dan mana yang cuma saya pikirkan.

## Yang Tidak Saya Pakai

Ini mungkin lebih menarik dari daftar di atas:

**Tidak pakai framework CSS custom.** Saya tidak menulis sistem grid, spacing scale, atau warna dari nol. Tailwind dan daisyUI sudah cukup, dan hasilnya konsisten tanpa saya harus jadi desainer.

**Tidak pakai ORM.** Query SQL saya tulis langsung. Untuk skala ini, ORM menambah lapisan yang harus dipelajari tanpa menyelesaikan masalah yang saya punya.

**Tidak pakai state manager di frontend.** Pinia, Vuex — tidak ada di sini. Vue punya `ref` dan `computed`, dan untuk aplikasi sebesar ini itu sudah cukup. Saya tambahkan kalau memang perlu, bukan karena orang lain pakai.

## Intinya

Alat terbaik bukan yang paling populer atau paling canggih. Alat terbaik adalah yang **kamu tidak perlu pikirkan lagi** — yang sudah cukup kamu kenal sampai bisa dipakai tanpa lihat dokumentasi.

Daftar saya bisa berubah besok. Tapi prinsipnya tidak: pilih alat yang menghilangkan pekerjaan, bukan yang menambah pelajaran baru.
