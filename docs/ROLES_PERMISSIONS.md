# ROLES_PERMISSIONS — Matriks Otoritas

> **WAJIB DIBACA.** Ini aturan inti. Jangan pernah bocor izin antar peran, baik di UI, middleware, maupun server.

## Peran & Kode

| Peran | Kode | Keterangan |
|---|---|---|
| Super Admin | `super_admin` | Pemilik/developer. Bisa semua, satu-satunya yang mengubah role user. |
| Ketua Kelas | `ketua_kelas` | Edit profil class + keuangan. |
| Wakil Ketua Kelas | `wakil_ketua_kelas` | Edit profil class + keuangan. |
| Bendahara | `bendahara` | Manajemen keuangan kas kelas. |
| Sekretaris | `sekretaris` | Edit profil class. |
| Anggota | `anggota` | Mengelola profil/portofolio/foto dirinya. |

> Pengurus (ketua/wakil/bendahara/sekretaris) **adalah user nyata** yang role-nya
> diubah oleh Super Admin lewat `/dashboard/users`. Tidak ada akun khusus per role.

## Matriks Izin (CRUD)

Legend: ✅ boleh · ❌ tidak boleh

### Halaman Profil Class (`class_profile`)
| Aksi | Super Admin | Ketua | Wakil Ketua | Bendahara | Sekretaris | Anggota |
|---|---|---|---|---|---|---|
| Lihat (publik) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit teks/gambar/sosmed/kontak | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |

### Portofolio & Profil (`profiles` / `portfolios`)
| Aksi | Super Admin | Ketua | Wakil Ketua | Bendahara | Sekretaris | Anggota |
|---|---|---|---|---|---|---|
| Lihat semua (publik) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit profil **dirinya sendiri** (termasuk foto/avatar) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit profil **anggota lain** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete/kelola user lain | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> Semua peran kecuali Super Admin hanya bisa mengedit **data milik dirinya sendiri** (profile, portfolio, foto).

### Manajemen Keuangan (`finance_transactions`)
| Aksi | Super Admin | Ketua | Wakil Ketua | Bendahara | Sekretaris | Anggota |
|---|---|---|---|---|---|---|
| Lihat laporan (publik) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tambah/edit/hapus transaksi | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Kelola kategori pengeluaran | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

### Manajemen User (`profiles` / admin)
| Aksi | Super Admin | Lainnya |
|---|---|---|
| Lihat daftar user | ✅ | ✅ |
| Ganti role user | ✅ | ❌ |
| Hapus user | ✅ | ❌ |

## Aturan Enkapsulasi

1. **Selalu cek di server** (session JWT + cek role di server action / middleware), bukan cuma di UI. UI bisa dimanipulasi.
2. Middleware (`proxy.ts`) + setiap server action **menjadi tembok terakhir** — semua kueri harus melewati cek sesi & role.
3. Role disimpan di `profiles.role` dan di-`claim` dari sesi auth, bukan dari input user.
4. Upload foto avatar: path blob HARUS di-bagi per user (`avatar/<userId>/…`) — dicek di route + server action, user tidak bisa menimpa foto user lain.

## Default Role

- User baru yang daftar sendiri → `anggota`.
- Role `super_admin` dibuat manual oleh developer, dan hanya Super Admin yang bisa mengubah role user lain.