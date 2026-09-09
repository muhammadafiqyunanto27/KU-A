# DESIGN_SYSTEM — Tema Glassmorphism

> **WAJIB DIBACA sebelum bikin UI apa pun.** Prinsip: modern, bersih, glassmorphism. **DILARANG neon** dan apa pun yang mirip neon.

## Filosofi

- **Editorial & corporate** (referensi: quonota.com, h-sunad.co.jp, junni.co.jp, sumzap.co.jp, mota.inc, datagrid.co.jp). Minimalis, banyak *whitespace*, tipografi besar sebagai hero.
- **Typography-first.** Judul halaman super besar (`text-5xl`–`text-9xl`, `extrabold`, `tracking-tight`). Teks pendukung kecil & *uppercase* dengan *letter-spacing* lebar.
- **Hairline separators.** Pemisah tipis (`border-line`) menggantikan kotak besar — elemen terasa ringan & bersih.
- **Section label bernomor** (`01 — Anggota`, `02 — Kas Kelas`) + garis pembatas → irama editorial.
- **Glassmorphism dipakai hemat**: navbar transparan-blur, kartu interaktif, form. Area baca (heading & paragraf utama) di atas kanvas solid.
- **Dark mode flat tanpa gradasi**; light mode memakai radial glow lembut (navy/cocoa/sunshine) yang di-desaturasi, bukan neon.
- **Mobile-first** — semua halus dan rapi di layar kecil dulu.

## Mode Gelap (Dark Mode)

- **Warna dasar:** arang dalam (*near-black charcoal*), bukan hitam pekat murni. **Flat & bersih — tanpa gradasi, tanpa blob.** Kanvas gelap polos supaya kartu kaca & kontras teks menonjol.
- **Aksen pendukung:** coklat-emas (*cocoa/gold*), *cloudy* (abu-abu lembut), *navy* (biru laut gelap).
- **Teks:** putih lembut (bukan putih menyilaukan) untuk kontras nyaman di gelap.

| Role | Value (hex) |
|---|---|
| Base bg | `#0A0B0F` (charcoal) |
| Surface (card) | `rgba(22,24,33,0.58)` |
| Surface strong | `#15171F` |
| Text primary | `#EDEEF2` |
| Text muted | `#A7ABB6` |
| Text faint | `#696E7A` |
| Accent cocoa (gold) | `#B4825A` |
| Accent cloudy | `#B7BAC4` |
| Accent navy | `#4C5E8C` |
| Accent sunshine | `#E2B85C` |
| Accent sunrise | `#E5846B` |
| Accent sky | `#8FB6DC` |
| Accent cream (panel hangat) | `#241F18` |
| Border | `rgba(255,255,255,0.09)` |

## Mode Terang (Light Mode)

- **Warna dasar:** putih hangat (*warm paper white*) — bukan putih menyilat.
- **Aksen pendukung:** *cloudy*, *sunshine* (kuning lembut), *sunrise* (oranye lembut), *cream* (krem), *biru muda*.
- **Aksen utama:** cocoa (coklat hangat) untuk tombol & titik fokus.

| Role | Value (hex) |
|---|---|
| Base bg | `#F8F7F4` |
| Surface (card) | `rgba(255,255,255,0.72)` |
| Surface strong | `#FFFFFF` |
| Text primary | `#191A1F` |
| Text muted | `#5F6470` |
| Text faint | `#989DA9` |
| Accent cocoa | `#8F5B32` |
| Accent cloudy | `#C6C7CD` |
| Accent navy | `#42567A` |
| Accent sunshine | `#DE9F37` |
| Accent sunrise | `#D9775A` |
| Accent sky | `#8FB6DC` |
| Accent cream | `#F4EADD` |
| Border | `rgba(22,24,30,0.09)` |

## Aturan Glassmorphism

1. **Kartu/panel**: `background` semi-transparan (mis. `rgba(255,255,255,0.06)` di dark) + `backdrop-filter: blur(12–20px)` + border tipis `1px` dengan `rgba` halus.
2. **Blur hanya saat butuh** — jangan blur seluruh halaman.
3. **Border & shadow halus** — hindari bayangan tajam; gunakan bayangan lembut berlapis.
4. **Radius besar** — sudut membulat (`rounded-2xl` ke atas) untuk konsistensi.

## DILARANG (No-Go)

- ❌ Aksen neon (pink-magenta cerah, hijau lime, cyjan neon, ungu elektrik).
- ❌ Gradasi yang terlalu terang/menyilaukan.
- ❌ Bayangan berwarna neon / glow.
- ❌ Font dekoratif yang susah dibaca di judul (pakai font modern seperti Inter / Plus Jakarta Sans).

## Slider Kartu Horizontal (gaya Sumzap)

- **`CardSlider`** (`src/components/public/card-slider.tsx`): rail `overflow-x-auto` + `scroll-snap` (native swipe di HP), tombol panah kanan/kiri muncul di layar besar, fade gradient di kedua tepi.
- Kartu memakai `data-slide` + `snap-start shrink-0`; lebar kartu responsif (`w-[72vw] max-w-[300px]`).
- Dipakai konsisten di **beranda, halaman anggota, halaman keuangan** untuk list anggota & transaksi.
- Pola prop dari Sumzap: kartu visual besar (foto/avatar), label kecil, lalu teks.

## Background Slideshow (opsional, dari admin)

- Simpan tiap foto sebagai row di `class_backgrounds` (upload via Vercel Blob), diurutkan `position`.
- Render: `position: fixed`, `object-cover`, semua layer foto bertumpuk dengan **crossfade opacity** dan berganti otomatis tiap **2 detik**.
- Satu lapis **overlay gelap/terang** (`bg-white/65` di light, `bg-black/65` di dark) supaya teks selalu terbaca.
- Tanpa foto → fallback ke gradient & blob bawaan (`BackgroundBlobs`).
- **Hormati `prefers-reduced-motion`** — kalau user set reduced motion, slideshow berhenti di foto pertama (tidak auto-advance).
- **Jangan** pakai foto busy sebagai latar form/panel — panel tetap glass blur (backdrop-filter) biar teks naik.
- Rekomendasi: foto kelas/halaman yang tenang, resolusi tinggi (≥1600px lebar), maksimal 5MB per foto.

## Tipografi

- **Sans** (default): Inter atau Plus Jakarta Sans.
- **Heading**: bold, rapi, spasi longgar antar kata/larik sesuai.
- Ukuran: mobile-first, skala responsif (`text-3xl` → `text-5xl` untuk judul besar).

## Komponen UI Dasar (di `src/components/ui/`)

- `Button` — variasi primary / secondary / ghost / danger.
- `Card` — wadah glassmorphism standar.
- `Input`, `Textarea`, `Select` — field form glassmorphism.
- `Badge`, `Avatar`, `Skeleton` — elemen pendukung.
- `GlassPanel` — pembungkus panel kaca umum.

## Mode Toggle

Aplikasi mendukung dark & light (bisa via `class` strategy di Tailwind + `prefers-color-scheme` / toggle). Standar: ikut sistem, bisa toggle manual.
