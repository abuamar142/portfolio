---
title: "5 Koleksi Komponen Copy-Paste yang Bisa Langsung Dipakai di Claude / Codex"
slug: koleksi-komponen-copy-paste-claude-codex
date: 2026-08-30
excerpt: "Capek nulis UI dari nol? Ini 5 situs curasi komponen copy-paste yang bisa langsung kamu suruh Claude / Codex pakai — dari Beautiful UI, AI CSS, Transitions, Micro-interactions, sampai Canvas UI."
tags: [ui, components, claude, codex, webdev, tailwind]
---

Capek nulis UI dari nol? Ini 5 situs curasi komponen copy-paste yang bisa langsung kamu suruh Claude / Codex pakai — dari Beautiful UI, AI CSS, Transitions, Micro-interactions, sampai Canvas UI.

Satu hal yang bikin kelima situs ini beda dari katalog komponen biasa: **mereka dibangun untuk agen AI**. Ada yang menyediakan *skill* yang bisa dibaca Claude Code, ada yang punya MCP server, ada yang pakai registry shadcn sehingga `npx shadcn add` langsung menarik kodenya ke repo kamu.

Aku sudah buka kelimanya, dan ini catatan jujurnya — termasuk mana yang gratis dan mana yang tidak.

## 1. [Beautiful UI](https://www.beautifului.dev) — beautifului.dev

Koleksi primitif untuk **antarmuka yang berisi agen AI**. Isinya bukan button dan card biasa, tapi hal-hal yang muncul kalau kamu bangun produk dengan LLM di dalamnya:

- **Loading state** — pixel-grid loader dengan shimmer dan penghitung waktu
- **Thinking** — trace yang bisa dibuka: langkah, reasoning, pencarian, coding
- **Streaming text** — jawaban yang mengalir dengan sumber inline dan tindak lanjut
- **Approval card** — pertanyaan *human-in-the-loop* sebelum agen bertindak
- **Tool chips, task rows, prompt bar, context cards**

Kalau kamu sedang membangun chat dengan AI dan bingung bagaimana menampilkan "sedang berpikir" atau "minta konfirmasi", di sini jawabannya sudah jadi.

**Lisensi:** MIT — gratis, termasuk untuk komersial.

## 2. [AICSS](https://www.aicss.dev) — aicss.dev

Namanya mirip, tapi fokusnya beda: **komponen untuk percakapan dengan agen**. Ada 17 komponen yang mencakup thinking state, tool call, streaming text, sitasi, dan tabel.

Yang menarik: kodenya tersedia dalam **React, Vue, dan Svelte**. Kalau stack-mu Vue seperti punyaku, ini salah satu dari sedikit koleksi yang menyediakan versi Vue secara resmi.

**Lisensi:** sebagian gratis, sisanya butuh lisensi Pro. Personal $89 sekali bayar (bukan langganan), Enterprise $299.

## 3. [Transitions](https://transitions.dev) — transitions.dev

Koleksi **transisi UI** yang paling sering dibutuhkan: modal membuka, dropdown, panel reveal, badge notifikasi, angka yang berubah, teks yang bertukar, skeleton ke konten.

Ini yang paling menarik dari sisi alur kerja AI. Situsnya menyediakan **skill** — file instruksi yang bisa kamu berikan ke Claude Code, Codex, atau Cursor. Jadi kamu tidak perlu copy-paste manual: suruh agennya yang memasang.

Contoh transisi yang ada:

- **Card resize** — kartu yang berubah ukuran dengan halus
- **Number pop-in** — angka berganti dengan blur dan stagger
- **Text states swap** — teks bertukar dengan blur
- **Success check** — centang sukses dengan rotasi
- **Skeleton loader and reveal** — pulse ke konten, cross-fade

**Lisensi:** versi gratis berisi transisi inti dengan snippet siap copy. Pro $9/bulan atau $149 sekali bayar (lifetime) untuk 36+ transisi plus skill versi lengkap.

## 4. [Micro-interactions](https://www.interior.dev) — interior.dev

**54 komponen React micro-interaction**, dan ini yang paling rapi dari segi kode: TypeScript, Tailwind, Motion — semuanya **MIT**.

Pemasangannya lewat registry shadcn, jadi satu perintah langsung menarik sumbernya ke repo:

```bash
npx shadcn@latest add https://www.interior.dev/r/copy-button.json
```

```tsx
import { CopyButton } from "@/components/interior/copy-button";

<CopyButton value="hello@interior.dev" />
```

Filosofinya bagus: **perilakunya sudah selesai, styling-nya milikmu**. Jadi kamu tidak terjebak dengan tampilan orang lain — kamu dapat logika animasi yang sudah dipikirkan sampai ke frame-nya, lalu kamu sesuaikan.

**Lisensi:** MIT, gratis.

## 5. [Canvas UI](https://canvasui.dev) — canvasui.dev

Yang paling ambisius dari kelimanya. Ini **html-in-canvas**: HTML asli kamu dirender di atas canvas, lalu diberi efek WebGL/WebGPU.

Efeknya: Blaze, Liquid, Glass, Shatter, Particle Reveal, VHS. 35 komponen dan terus bertambah.

Dua hal yang bikin ini relevan untuk kita:

- **Framework-agnostic** — setiap efek tersedia dalam React, Solid, Preact, **Vue**, Svelte, dan vanilla TypeScript
- **AI-ready** — registry-nya bicara protokol shadcn, jadi asisten dengan MCP server bisa mencari, membaca dokumentasi, dan memasang komponennya hanya dari satu prompt

Peringatan jujur: efek yang menggambar HTML langsung ke canvas bergantung pada kemampuan browser yang masih eksperimental (di Chrome masih di balik flag). Di browser lain efeknya turun dengan anggun — konten tetap tampil sebagai HTML biasa, dan sebagian efek tetap jalan sebagai overlay GPU murni.

**Lisensi:** MIT + Commons Clause — gratis selamanya, termasuk komersial. Satu-satunya larangan: menjual ulang komponennya.

## Cara pakai yang sebenarnya

Kalau kamu pakai Claude Code atau Codex, ini urutan yang paling masuk akal:

**1. Sebut situsnya di prompt, bukan cuma "bikin komponen bagus".**

```text
Ambil transisi modal dari transitions.dev, terapkan ke ConfirmModal.vue
```

Agen yang tahu sumbernya akan meniru kode yang sudah terbukti, bukan mengarang animasi sendiri.

**2. Pakai registry kalau ada.**

Untuk Canvas UI dan interior.dev, kamu tidak perlu copy-paste sama sekali — `npx shadcn add` menarik kodenya ke repo, dan setelah itu kode itu milikmu. Tidak ada paket yang harus di-*update*, tidak ada versi yang harus di-*pin*.

**3. Baca lisensinya sebelum dipakai di proyek klien.**

Ini yang sering dilewatkan. Tiga dari lima di atas gratis penuh (Beautiful UI, interior.dev, Canvas UI), satu punya versi gratis + Pro (Transitions), satu berbayar untuk sebagian besar komponennya (AICSS).

## Yang berubah dari cara lama

Dulu, memilih komponen itu soal selera visual. Sekarang ada pertanyaan baru yang sama pentingnya: **apakah agen AI bisa membacanya?**

Situs yang punya skill, MCP server, atau registry shadcn bukan sekadar memudahkan manusia — mereka membuat komponennya bisa ditemukan dan dipasang oleh agen. Itu alasan kenapa kelima situs ini masuk daftar, dan bukan lima katalog komponen cantik lainnya.

Kalau kamu punya koleksi favorit yang belum ada di sini, kabari aku.
