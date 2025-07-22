# BAB IV
# PEMODELAN PERANGKAT LUNAK

## 4.1 Use Case Diagram

![Use Case Diagram](../public/gapura-angkasa.jpeg)

**Gambar 4.1 Use Case Diagram**

Pada Gambar 4.1 menjelaskan tentang aktivitas use case diagram oleh user yaitu Admin. Proses awal dimulai dengan login, kemudian setelah login admin dapat mengakses beberapa fitur utama sistem yaitu:

1. Dashboard Analitik
2. Pelatihan Model Naive Bayes
3. Klasifikasi Kepuasan Penumpang
4. Lihat dan Kelola Data Penumpang
5. Lihat Laporan Hasil Klasifikasi

### Tabel 4.1 Use Case Scenario Login Admin

| Aspek | Keterangan |
|-------|------------|
| Use Case Name | Login Admin |
| Use Case Id | 1 |
| Actor | Admin |
| Description | Use Case ini menggambarkan proses autentikasi admin untuk mengakses sistem |
| Pre Condition | Actor berada pada halaman login |
| Trigger | Actor ingin mengakses sistem |
| Typical Course of Events | **Actor Action:** <br>1. Memasukkan username<br>2. Memasukkan password<br>3. Klik tombol "Login"<br><br>**System Response:**<br>1. Memvalidasi kredensial<br>2. Memberikan akses ke sistem |
| Alternate Course | - Jika kredensial tidak valid, sistem menampilkan pesan error<br>- Jika form tidak lengkap, sistem meminta melengkapi data |
| Conclusion | Admin berhasil login |
| Post Condition | Admin dapat mengakses fitur-fitur sistem |

### Tabel 4.2 Use Case Scenario Dashboard Analitik

| Aspek | Keterangan |
|-------|------------|
| Use Case Name | Dashboard Analitik |
| Use Case Id | 2 |
| Actor | Admin |
| Description | Use Case ini menggambarkan aktivitas melihat dashboard analitik kepuasan penumpang |
| Pre Condition | Actor sudah login ke sistem |
| Trigger | Actor ingin melihat ringkasan analitik |
| Typical Course of Events | **Actor Action:**<br>1. Memilih menu Dashboard<br><br>**System Response:**<br>1. Menampilkan visualisasi data<br>2. Menampilkan statistik kepuasan<br>3. Menampilkan performa model |
| Alternate Course | - Data tidak tersedia: sistem menampilkan pesan informasi |
| Conclusion | Admin melihat ringkasan analitik |
| Post Condition | Admin mendapatkan insight dari data |

### Tabel 4.3 Use Case Scenario Pelatihan Model

| Aspek | Keterangan |
|-------|------------|
| Use Case Name | Pelatihan Model Naive Bayes |
| Use Case Id | 3 |
| Actor | Admin |
| Description | Use Case ini menggambarkan proses pelatihan model Naive Bayes |
| Pre Condition | Actor sudah memiliki dataset pelatihan |
| Trigger | Actor ingin melatih model baru |
| Typical Course of Events | **Actor Action:**<br>1. Memilih menu Pelatihan Model<br>2. Upload dataset<br>3. Pilih kolom fitur<br>4. Pilih kolom target<br>5. Input nama model<br>6. Klik "Latih Model"<br><br>**System Response:**<br>1. Memvalidasi dataset<br>2. Melakukan pelatihan<br>3. Menampilkan metrik performa |
| Alternate Course | - Dataset invalid: sistem menampilkan pesan error<br>- Kolom tidak sesuai: sistem meminta pemilihan ulang |
| Conclusion | Model berhasil dilatih |
| Post Condition | Model tersimpan dan siap digunakan |

### Tabel 4.4 Use Case Scenario Klasifikasi Kepuasan

| Aspek | Keterangan |
|-------|------------|
| Use Case Name | Klasifikasi Kepuasan Penumpang |
| Use Case Id | 4 |
| Actor | Admin |
| Description | Use Case ini menggambarkan proses klasifikasi kepuasan penumpang |
| Pre Condition | Actor memiliki data yang akan diklasifikasi |
| Trigger | Actor ingin mengklasifikasi data penumpang |
| Typical Course of Events | **Actor Action:**<br>1. Memilih menu Klasifikasi<br>2. Pilih model<br>3. Input/upload data<br>4. Klik "Klasifikasi"<br><br>**System Response:**<br>1. Memproses data<br>2. Menampilkan hasil klasifikasi |
| Alternate Course | - Data tidak sesuai format: sistem meminta perbaikan<br>- Model tidak ditemukan: sistem meminta pemilihan ulang |
| Conclusion | Data berhasil diklasifikasi |
| Post Condition | Hasil klasifikasi tersimpan |

### Tabel 4.5 Use Case Scenario Kelola Data Penumpang

| Aspek | Keterangan |
|-------|------------|
| Use Case Name | Kelola Data Penumpang |
| Use Case Id | 5 |
| Actor | Admin |
| Description | Use Case ini menggambarkan pengelolaan data penumpang |
| Pre Condition | Actor sudah login |
| Trigger | Actor ingin mengelola data penumpang |
| Typical Course of Events | **Actor Action:**<br>1. Memilih menu Data Penumpang<br>2. Tambah/Edit/Hapus data<br>3. Klik "Simpan"<br><br>**System Response:**<br>1. Memvalidasi input<br>2. Menyimpan perubahan |
| Alternate Course | - Data tidak valid: sistem menampilkan pesan error<br>- Data duplikat: sistem meminta konfirmasi |
| Conclusion | Data penumpang terkelola |
| Post Condition | Perubahan data tersimpan di database |

### Tabel 4.6 Use Case Scenario Laporan Klasifikasi

| Aspek | Keterangan |
|-------|------------|
| Use Case Name | Laporan Hasil Klasifikasi |
| Use Case Id | 6 |
| Actor | Admin |
| Description | Use Case ini menggambarkan proses melihat dan mengunduh laporan |
| Pre Condition | Telah ada hasil klasifikasi |
| Trigger | Actor ingin melihat laporan klasifikasi |
| Typical Course of Events | **Actor Action:**<br>1. Memilih menu Laporan<br>2. Pilih periode laporan<br>3. Klik "Unduh" (opsional)<br><br>**System Response:**<br>1. Menampilkan laporan<br>2. Mengunduh file laporan |
| Alternate Course | - Data tidak tersedia: sistem menampilkan pesan informasi |
| Conclusion | Laporan berhasil ditampilkan/diunduh |
| Post Condition | Admin mendapatkan laporan yang dibutuhkan |
