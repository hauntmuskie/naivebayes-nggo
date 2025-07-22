# Class Diagram - Sistem Klasifikasi Naive Bayes

## Deskripsi
Class diagram ini menggambarkan struktur kelas utama dalam sistem klasifikasi Naive Bayes untuk analisis kepuasan penumpang. Diagram ini dibuat dengan pendekatan sederhana yang fokus pada entitas inti dan hubungan dasarnya.

## Struktur Kelas

### 1. Admin
**Deskripsi**: Kelas yang merepresentasikan pengguna administrator sistem.

**Atribut**:
- `id: string` - Identitas unik admin
- `username: string` - Nama pengguna untuk login
- `password: string` - Kata sandi (terenkripsi)

**Method**:
- `login(): boolean` - Melakukan proses autentikasi
- `logout(): void` - Mengakhiri sesi pengguna

**Tanggung Jawab**:
- Mengelola akses sistem
- Melakukan operasi CRUD pada model
- Mengunggah dan mengelola dataset
- Melihat riwayat klasifikasi

### 2. Model
**Deskripsi**: Kelas yang merepresentasikan model Naive Bayes yang telah dilatih.

**Atribut**:
- `id: string` - Identitas unik model
- `namaModel: string` - Nama yang diberikan untuk model
- `targetColumn: string` - Kolom target untuk prediksi
- `featureColumns: string[]` - Daftar kolom fitur yang digunakan
- `accuracy: number` - Tingkat akurasi model (0-1)
- `tanggalDibuat: Date` - Waktu pembuatan model

**Method**:
- `latihModel(): void` - Melakukan proses pelatihan model
- `prediksi(data: any): string` - Melakukan prediksi terhadap data input

**Tanggung Jawab**:
- Menyimpan konfigurasi model
- Melakukan prediksi klasifikasi
- Menyimpan informasi performa model

### 3. Klasifikasi
**Deskripsi**: Kelas yang merepresentasikan hasil klasifikasi individual.

**Atribut**:
- `id: string` - Identitas unik hasil klasifikasi
- `modelId: string` - Referensi ke model yang digunakan
- `data: string` - Data input yang diklasifikasi (dalam format JSON)
- `hasilPrediksi: string` - Hasil prediksi kelas
- `confidence: number` - Tingkat kepercayaan prediksi (0-1)
- `tanggal: Date` - Waktu klasifikasi dilakukan

**Tanggung Jawab**:
- Menyimpan hasil prediksi individual
- Menyimpan tingkat kepercayaan prediksi
- Mencatat waktu klasifikasi

### 4. Dataset
**Deskripsi**: Kelas yang merepresentasikan dataset yang diunggah untuk pelatihan atau testing.

**Atribut**:
- `id: string` - Identitas unik dataset
- `namaFile: string` - Nama file dataset
- `tipeDataset: string` - Jenis dataset (training/testing/validation)
- `data: any` - Konten data dalam format yang sesuai
- `tanggalUpload: Date` - Waktu upload dataset

**Method**:
- `uploadFile(): boolean` - Mengunggah file dataset
- `validasiFormat(): boolean` - Memvalidasi format file CSV

**Tanggung Jawab**:
- Mengelola file dataset
- Memvalidasi format dan struktur data
- Menyimpan metadata dataset

### 5. History
**Deskripsi**: Kelas yang merepresentasikan riwayat klasifikasi batch.

**Atribut**:
- `id: string` - Identitas unik riwayat
- `namaFile: string` - Nama file yang diklasifikasi
- `namaModel: string` - Nama model yang digunakan
- `jumlahRecord: number` - Jumlah record yang diklasifikasi
- `hasilKlasifikasi: string` - Hasil klasifikasi lengkap (JSON)
- `tanggal: Date` - Waktu klasifikasi batch

**Method**:
- `simpanHasil(): void` - Menyimpan hasil klasifikasi batch
- `lihatDetail(): any` - Menampilkan detail hasil klasifikasi

**Tanggung Jawab**:
- Menyimpan riwayat klasifikasi batch
- Menyediakan laporan hasil klasifikasi
- Mencatat statistik klasifikasi

### 6. Reports
**Deskripsi**: Kelas yang merepresentasikan sistem pelaporan komprehensif.

**Atribut**:
- `id: string` - Identitas unik laporan
- `jenisLaporan: string` - Jenis laporan (model performance, classification results, etc.)
- `title: string` - Judul laporan
- `description: string` - Deskripsi laporan
- `tanggalGenerate: Date` - Waktu generate laporan
- `format: string` - Format output (interactive, print, PDF)

**Method**:
- `generateModelPerformance(): any` - Generate laporan performa model
- `generateClassificationResults(): any` - Generate laporan hasil klasifikasi
- `generateDatasetAnalysis(): any` - Generate laporan analisis dataset
- `generateSystemSummary(): any` - Generate laporan ringkasan sistem
- `exportToPDF(): boolean` - Export laporan ke format PDF

**Tanggung Jawab**:
- Menghasilkan 4 jenis laporan sistem
- Menyediakan format interaktif dan print
- Export laporan dalam berbagai format
- Analisis komprehensif data sistem

## Hubungan Antar Kelas

### 1. Admin → Model (1:N)
- **Relasi**: "mengelola"
- **Deskripsi**: Satu admin dapat mengelola banyak model
- **Operasi**: Create, Read, Update, Delete model

### 2. Model → Klasifikasi (1:N)
- **Relasi**: "menghasilkan"
- **Deskripsi**: Satu model dapat menghasilkan banyak hasil klasifikasi
- **Operasi**: Model melakukan prediksi dan mencatat hasilnya

### 3. Admin → Dataset (1:N)
- **Relasi**: "mengunggah"
- **Deskripsi**: Satu admin dapat mengunggah banyak dataset
- **Operasi**: Upload, validasi, dan pengelolaan dataset

### 4. Admin → History (1:N)
- **Relasi**: "melihat"
- **Deskripsi**: Satu admin dapat melihat banyak riwayat klasifikasi
- **Operasi**: View, filter, dan download laporan

### 5. Model → History (1:N)
- **Relasi**: "tercatat dalam"
- **Deskripsi**: Satu model dapat tercatat dalam banyak riwayat klasifikasi
- **Operasi**: Pencatatan penggunaan model untuk audit

### 6. Admin → Reports (1:N)
- **Relasi**: "mengakses"
- **Deskripsi**: Satu admin dapat mengakses berbagai jenis laporan
- **Operasi**: Generate, view, dan export laporan

### 7. Model → Reports (1:N)
- **Relasi**: "dianalisis dalam"
- **Deskripsi**: Data model dianalisis dalam laporan performa
- **Operasi**: Analisis metrics dan perbandingan model

### 8. Klasifikasi → Reports (1:N)
- **Relasi**: "dilaporkan dalam"
- **Deskripsi**: Hasil klasifikasi dilaporkan dalam laporan
- **Operasi**: Statistik dan trend analysis

### 9. Dataset → Reports (1:N)
- **Relasi**: "dianalisis dalam"
- **Deskripsi**: Dataset dianalisis dalam laporan dataset
- **Operasi**: Data quality dan pattern analysis

## Alur Kerja Sistem

### 1. Pelatihan Model
1. Admin mengunggah **Dataset** pelatihan
2. Sistem memvalidasi format dataset
3. Admin membuat **Model** baru dengan konfigurasi
4. Sistem melatih model menggunakan algoritma Naive Bayes
5. Model tersimpan dengan informasi akurasi

### 2. Klasifikasi Data
1. Admin memilih **Model** yang akan digunakan
2. Admin mengunggah **Dataset** untuk klasifikasi
3. Model melakukan prediksi untuk setiap record
4. Hasil disimpan sebagai **Klasifikasi** individual
5. Ringkasan disimpan dalam **History**

### 3. Pengelolaan Sistem
1. Admin dapat melihat daftar **Model** yang tersedia
2. Admin dapat menghapus model yang tidak diperlukan
3. Admin dapat melihat **History** klasifikasi
4. Admin dapat mengunduh laporan hasil klasifikasi
5. Admin dapat mengakses **Reports** untuk analisis komprehensif
6. **Reports** menghasilkan 4 jenis laporan berbeda
7. Admin dapat export laporan dalam format PDF

## Prinsip Desain

### 1. Simplicity (Kesederhanaan)
- Fokus pada entitas inti sistem
- Menghindari kompleksitas yang tidak perlu
- Interface yang mudah dipahami

### 2. Separation of Concerns
- Setiap kelas memiliki tanggung jawab yang jelas
- Pemisahan antara data, logic, dan presentation
- Modular dan mudah dimaintain

### 3. Scalability
- Desain mendukung penambahan model baru
- Dapat menangani volume data yang besar
- Fleksibel untuk pengembangan fitur

### 4. Data Integrity
- Relasi yang jelas antar entitas
- Validasi data pada setiap level
- Audit trail melalui history

## Teknologi Implementasi

### Database
- **PostgreSQL** untuk penyimpanan data
- **Drizzle ORM** untuk akses database
- **Schema validation** untuk integritas data

### Backend
- **Next.js** dengan App Router
- **Server Actions** untuk business logic
- **TypeScript** untuk type safety

### Frontend
- **React Components** untuk UI
- **Tailwind CSS** untuk styling
- **Form validation** untuk input handling

## File Terkait

- **Database Schema**: `/database/schema.ts`
- **Server Actions**: `/_actions/index.ts`
- **Type Definitions**: Berdasarkan Drizzle schema
- **Components**: `/app/*/components/`

## Cara Membaca Diagram

1. **Kotak**: Merepresentasikan kelas
2. **Garis dengan panah**: Menunjukkan relasi dan arah dependensi
3. **Teks di garis**: Menjelaskan jenis relasi
4. **Simbol 1:N**: Menunjukkan kardinalitas hubungan

Diagram ini memberikan pandangan high-level tentang struktur sistem dan dapat digunakan sebagai referensi untuk pengembangan dan maintenance aplikasi.
