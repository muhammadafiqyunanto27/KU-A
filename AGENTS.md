# AGENTS.md — Petunjuk Kerja untuk AI Agent

> Goal: supaya AI (dan manusia) tetap **fokus pada tugas & purpose aplikasi**. Baca file ini + semua file di `docs/` SEBELUM mulai ngerjain apa pun.

## Purpose Aplikasi (Ringkasan)

Website profil class **KU-A**:

- **Publik** melihat hasil akhir: halaman profil class, daftar anggota + portofolio, dan laporan keuangan.
- **User login** untuk mengedit **hanya sesuai otoritas masing-masing**. Tidak ada user yang bisa mengubah konten di luar otoritasnya.

## Sebelum Ngoding

1. Baca `docs/PROJECT_BRIEF.md` — kenapa aplikasi ini ada.
2. Baca `docs/ROLES_PERMISSIONS.md` — **WAJIB**. Jangan pernah bocor izin antar peran.
3. Baca `docs/DATABASE_SCHEMA.md` — struktur DB & RLS.
4. Baca `docs/DESIGN_SYSTEM.md` — **WAJIB** untuk semua UI (glassmorphism, palet dark/light, **DILARANG neon**).
5. Baca `docs/PAGES_ROUTES.md` — route mana publik / protected.
6. Baca `docs/ROADMAP.md` — kita fokus MVP (Phase 1) dulu.

## Aturan yang Jangan Pernah Dilanggar

- **Security & server-side checks dulu.** Semua akses data dibatasi oleh cek sesi/role di server (server action + middleware). Jangan pernah "mempercepat" fitur dengan melempar query ke server tanpa cek role.
- **Role-based protection di middleware + server.** Auth cek peran (Super Admin / Ketua Kelas / Bendahara / Anggota) di server, bukan cuma di UI.
- **No neon.** Tema harus glassmorphism, palet sesuai `DESIGN_SYSTEM.md`. Dilarang aksen neon.
- **Baca dulu, baru ubah.** Sebelum mengubah file, baca file & konteks sekitarnya biar konsisten dengan style yang ada.
- **Tidak ada komentar tidak perlu.** Jangan menambahkan komentar kecuali diminta.
- **MVP dulu.** Kalau ragu antara fitur tambahan vs ngerampungin MVP, pilih MVP (lihat ROADMAP).

## Konvensi

- TypeScript strict. Semua tabel DB punya type di `src/lib/types.ts`.
- Komponen UI reusable di `src/components/ui/`.
- Komponen gagal aman (fail-safe): tampilkan placeholder/skeleton, jangan crash.
- Mobile-first responsive.
