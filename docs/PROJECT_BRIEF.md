# PROJECT_BRIEF — Website Profil Class KU-A

## Kenapa Aplikasi Ini Ada

Class **KU-A** butuh satu tempat digital yang jadi **wajah & arsip** kelas:
- Halaman profil class yang memperkenalkan kelas ke publik.
- Portofolio / profil setiap anggota kelas.
- Laporan keuangan kas kelas yang transparan.

Yang penting: **hasil isian user → yang dilihat publik**. Publik tidak pernah mengedit; user mengedit isi sesuai otoritasnya.

## Tujuan (Goals)

1. Memberi publik tampilan profil class KU-A yang rapi, informatif, dan modern.
2. Memberi tiap anggota tempat untuk menampilkan portofolio/profil dirinya.
3. Memberi bendahara alat manajemen keuangan yang transparan untuk publik.
4. Menjamin **setiap user hanya bisa mengubah konten sesuai perannya** — tidak lebih.

## Bukan Tujuan (Non-Goals) untuk MVP

- Tidak ada forum / chat.
- Tidak ada sistem komentar.
- Tidak ada e-commerce / pembayaran online.
- Tidak ada streaming / personalisasi konten publik per user.

## Prinsip

- **Transparansi keuangan** untuk publik.
- **Pemisahan otoritas** yang tegas (lihat ROLES_PERMISSIONS.md).
- **Modern & enteng** — cepat dibuka, mobile-first.
- **No neon** — desain glassmorphism yang bersih (lihat DESIGN_SYSTEM.md).

## Peran (ringkas — detail di ROLES_PERMISSIONS.md)

| Peran | Inti tanggung jawab |
|---|---|
| Super Admin | Mengubah semua & mengelola user |
| Ketua Kelas (Admin) | Mengubah halaman profil class |
| Bendahara | Manajemen keuangan |
| Anggota | Portofolio/profil dirinya sendiri |

## Metrik Kesuksesan MVP

- Login & role-based protection berfungsi penuh (tidak ada celah izin).
- Publik bisa melihat profil class, anggota, dan laporan keuangan tanpa login.
- Tiap peran bisa menyelesaikan tugasnya di dashboard tanpa kebingungan.
