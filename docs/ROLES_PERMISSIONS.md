# ROLES_PERMISSIONS — Matriks Otoritas

> **WAJIB DIBACA.** Ini aturan inti. Jangan pernah bocor izin antar peran, baik di UI, middleware, maupun server.

## Peran & Jumlah

| Peran | Kode | Keterangan |
|---|---|---|
| Super Admin | `super_admin` | Pemilik/developer. Bisa semua. |
| Ketua Kelas | `ketua_kelas` | Mengelola halaman profil class. |
| Bendahara | `bendahara` | Manajemen keuangan kas kelas. |
| Anggota | `anggota` | Mengelola portofolio/profil dirinya. |

## Matriks Izin (CRUD)

Legend: ✅ boleh · ❌ tidak boleh

### Halaman Profil Class (`class_profile`)
| Aksi | Super Admin | Ketua Kelas | Bendahara | Anggota |
|---|---|---|---|---|
| Lihat (publik) | ✅ | ✅ | ✅ | ✅ |
| Edit heading/teks/gambar/sosmed/kontak | ✅ | ✅ | ❌ | ❌ |

### Portofolio Anggota (`profiles` / `portfolios`)
| Aksi | Super Admin | Ketua Kelas | Bendahara | Anggota |
|---|---|---|---|---|
| Lihat semua (publik) | ✅ | ✅ | ✅ | ✅ |
| Edit profil **dirinya sendiri** | ✅ | ✅ (yg dimiliki) | ✅ (yg dimiliki) | ✅ (yg dimiliki) |
| Edit profil **anggota lain** | ✅ | ❌ | ❌ | ❌ |
| Delete/kelola user lain | ✅ | ❌ | ❌ | ❌ |

> Semua peran kecuali Super Admin hanya bisa mengedit **data milik dirinya sendiri** (profile & portfolio). Anggota tidak bisa mengubah data user lain.

### Manajemen Keuangan (`finance_transactions`)
| Aksi | Super Admin | Ketua Kelas | Bendahara | Anggota |
|---|---|---|---|---|
| Lihat laporan (publik) | ✅ | ✅ | ✅ | ✅ |
| Tambah/edit/hapus transaksi | ✅ | ❌ | ✅ | ❌ |
| Kelola kategori pengeluaran | ✅ | ❌ | ✅ | ❌ |

### Manajemen User (`profiles` / admin)
| Aksi | Super Admin | Ketua Kelas | Bendahara | Anggota |
|---|---|---|---|---|
| Lihat daftar user | ✅ | ✅ | ✅ | ✅ |
| Ganti role user | ✅ | ❌ | ❌ | ❌ |
| Hapus user | ✅ | ❌ | ❌ | ❌ |

## Aturan Enkapsulasi

1. **Selalu cek di server** (session JWT + cek role di server action / middleware), bukan cuma di UI. UI bisa dimanipulasi.
2. Middleware + setiap server action **menjadi tembok terakhir** — semua kueri harus melewati cek sesi & role.
3. Middleware Next.js melindungi route; server-side memastikan aksi aman.
4. Role disimpan di `profiles.role` dan di-`claim` dari sesi auth, bukan dari input user.

## Default Role

- User baru yang daftar sendiri → `anggota`.
- Role `super_admin` dibuat manual oleh developer (seed/console).
