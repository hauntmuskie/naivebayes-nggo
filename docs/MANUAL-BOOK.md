# Manual Book
## Petunjuk Penggunaan Aplikasi

# APLIKASI KLASIFIKASI NAIVE BAYES
## SISTEM PREDIKSI DATA MENGGUNAKAN ALGORITMA NAIVE BAYES

**Dikembangkan untuk Keperluan Klasifikasi Data**

---

## DAFTAR ISI

1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi Aplikasi](#instalasi-aplikasi)
3. [Menjalankan Aplikasi](#menjalankan-aplikasi)
4. [Login ke Sistem](#login-ke-sistem)
5. [Dashboard Utama](#dashboard-utama)
6. [Mengelola Dataset](#mengelola-dataset)
7. [Melatih Model](#melatih-model)
8. [Klasifikasi Data](#klasifikasi-data)
9. [Melihat Riwayat](#melihat-riwayat)
10. [Laporan dan Analisis](#laporan-dan-analisis)
11. [Troubleshooting](#troubleshooting)

---

## Persyaratan Sistem

Sebelum menggunakan aplikasi, pastikan sistem Anda memiliki:

- **Node.js** versi 18 atau lebih baru
- **Bun** package manager (atau npm/yarn)
- **Browser** modern (Chrome, Firefox, Safari, Edge)
- **RAM** minimal 4GB
- **Storage** minimal 1GB ruang kosong

---

## Instalasi Aplikasi

### 1. Download dan Ekstrak Project
```bash
# Clone repository
git clone [repository-url]
cd naivebayes-nggo
```

### 2. Install Dependencies
```bash
# Install menggunakan Bun
bun install

# Atau menggunakan npm
npm install
```

### 3. Setup Database
```bash
# Generate database schema
bun run db:generate

# Push schema ke database
bun run db:push
```

### 4. Setup Environment
Buat file `.env.local` dan isi dengan konfigurasi database:
```env
DATABASE_URL="your-database-url"
```

---

## Menjalankan Aplikasi

### 1. Start Development Server
```bash
# Jalankan server development
bun run dev

# Atau menggunakan npm
npm run dev
```

### 2. Akses Aplikasi
Buka browser dan akses:
```
http://localhost:3000
```

### 3. Tampilan Loading
Aplikasi akan menampilkan loading screen saat pertama kali dibuka.

---

## Login ke Sistem

### 1. Halaman Login
- Buka aplikasi di browser
- Anda akan diarahkan ke halaman login
- Masukkan credentials yang valid

### 2. Form Login
- **Username/Email**: Masukkan username atau email
- **Password**: Masukkan password
- Klik tombol **"Login"**

### 3. Autentikasi
- Sistem akan memverifikasi credentials
- Jika berhasil, Anda akan diarahkan ke dashboard
- Jika gagal, akan muncul pesan error

---

## Dashboard Utama

### 1. Tampilan Dashboard
Dashboard menampilkan:
- **Statistik Model**: Jumlah model yang telah dibuat
- **Akurasi Rata-rata**: Performa model secara keseluruhan
- **Dataset**: Jumlah dataset yang tersedia
- **Klasifikasi**: Total prediksi yang telah dilakukan

### 2. Menu Navigasi
Sidebar menu terdiri dari:
- **Dashboard**: Halaman utama
- **Manage Dataset**: Kelola data training
- **Train Model**: Latih model baru
- **Classify**: Prediksi data baru
- **History**: Riwayat klasifikasi
- **Reports**: Laporan dan analisis

---

## Mengelola Dataset

### 1. Akses Menu Dataset
- Klik **"Manage Passengers"** atau **"Dataset"** di sidebar
- Halaman akan menampilkan daftar data yang tersedia

### 2. Upload Dataset
- Klik tombol **"Upload Data"**
- Pilih file CSV yang akan diupload
- Pastikan format sesuai dengan template
- Klik **"Upload"**

### 3. View Data
- Tabel akan menampilkan data yang telah diupload
- Gunakan pagination untuk navigasi data
- Filter data berdasarkan kolom tertentu

### 4. Edit/Delete Data
- Klik ikon **"Edit"** untuk mengubah data
- Klik ikon **"Delete"** untuk menghapus data
- Konfirmasi action sebelum menyimpan

---

## Melatih Model

### 1. Akses Menu Train Model
- Klik **"Models"** di sidebar
- Pilih **"Train New Model"**

### 2. Konfigurasi Model
- **Model Name**: Berikan nama untuk model
- **Dataset**: Pilih dataset untuk training
- **Target Column**: Pilih kolom yang akan diprediksi
- **Feature Columns**: Pilih kolom-kolom fitur

### 3. Parameter Training
- **Test Size**: Persentase data untuk testing (default: 20%)
- **Random State**: Seed untuk reproducibility
- **Algorithm**: Pilih variant Naive Bayes (Gaussian, Multinomial, Bernoulli)

### 4. Mulai Training
- Klik **"Train Model"**
- Progress bar akan menampilkan kemajuan training
- Tunggu hingga training selesai

### 5. Evaluasi Model
Setelah training selesai, sistem akan menampilkan:
- **Accuracy Score**: Akurasi model
- **Confusion Matrix**: Matriks konfusi
- **Classification Report**: Laporan detail klasifikasi
- **Feature Importance**: Pentingnya setiap fitur

---

## Klasifikasi Data

### 1. Akses Menu Classify
- Klik **"Classify"** di sidebar
- Pilih model yang akan digunakan

### 2. Input Data
Ada dua cara untuk klasifikasi:

#### a. Manual Input
- Isi form dengan data yang akan diprediksi
- Pastikan semua field terisi dengan benar
- Klik **"Predict"**

#### b. Batch Upload
- Klik **"Upload CSV"**
- Pilih file CSV dengan data yang akan diprediksi
- Format harus sesuai dengan training data
- Klik **"Process"**

### 3. Hasil Prediksi
Sistem akan menampilkan:
- **Prediction**: Hasil prediksi
- **Confidence**: Tingkat kepercayaan
- **Probability Distribution**: Distribusi probabilitas untuk setiap kelas

### 4. Save Results
- Klik **"Save Results"** untuk menyimpan ke database
- Hasil akan tersimpan di riwayat klasifikasi

---

## Melihat Riwayat

### 1. Akses Menu History
- Klik **"History"** di sidebar
- Halaman akan menampilkan riwayat klasifikasi

### 2. Filter Riwayat
- **Date Range**: Filter berdasarkan tanggal
- **Model**: Filter berdasarkan model yang digunakan
- **Accuracy**: Filter berdasarkan tingkat akurasi

### 3. Detail Riwayat
Setiap entry riwayat menampilkan:
- **Timestamp**: Waktu klasifikasi
- **Model Used**: Model yang digunakan
- **Input Data**: Data yang diprediksi
- **Prediction**: Hasil prediksi
- **Confidence**: Tingkat kepercayaan

### 4. Export Riwayat
- Klik **"Export"** untuk download riwayat
- Pilih format (CSV, Excel, PDF)
- File akan didownload otomatis

---

## Laporan dan Analisis

### 1. Akses Menu Reports
- Klik **"Reports"** di sidebar
- Pilih jenis laporan yang diinginkan

### 2. Dataset Analysis
- **Data Distribution**: Distribusi data per kelas
- **Feature Statistics**: Statistik setiap fitur
- **Missing Values**: Analisis data yang hilang
- **Correlation Matrix**: Matriks korelasi antar fitur

### 3. Model Performance
- **Accuracy Trends**: Tren akurasi model
- **Confusion Matrix**: Matriks konfusi detail
- **ROC Curve**: Kurva ROC untuk evaluasi
- **Precision-Recall**: Analisis precision dan recall

### 4. Classification Results
- **Prediction Summary**: Ringkasan hasil prediksi
- **Success Rate**: Tingkat keberhasilan prediksi
- **Error Analysis**: Analisis kesalahan prediksi
- **Performance Metrics**: Metrik performa detail

### 5. Export Reports
- Pilih format laporan (PDF, Excel, CSV)
- Klik **"Generate Report"**
- File laporan akan didownload

---

## Troubleshooting

### 1. Masalah Login
**Problem**: Tidak bisa login
**Solution**: 
- Periksa username/password
- Clear browser cache
- Restart aplikasi

### 2. Error Upload Data
**Problem**: Gagal upload dataset
**Solution**:
- Periksa format file (harus CSV)
- Pastikan ukuran file tidak terlalu besar
- Periksa encoding file (UTF-8)

### 3. Training Gagal
**Problem**: Model tidak bisa di-training
**Solution**:
- Periksa data training (tidak boleh kosong)
- Pastikan target column memiliki variasi
- Cek memory yang tersedia

### 4. Prediksi Error
**Problem**: Gagal melakukan prediksi
**Solution**:
- Pastikan model sudah ter-training
- Periksa format input data
- Pastikan semua fitur terisi

### 5. Performance Lambat
**Problem**: Aplikasi berjalan lambat
**Solution**:
- Tutup aplikasi lain yang tidak perlu
- Clear browser cache
- Restart aplikasi
- Periksa koneksi internet

---

## Kontak Support

Jika mengalami masalah yang tidak dapat diselesaikan:

- **Email**: support@naivebayes-app.com
- **Documentation**: Lihat file README.md
- **Issues**: Buat issue di repository GitHub

---

## Tips Penggunaan

1. **Backup Data**: Selalu backup dataset sebelum melakukan perubahan
2. **Monitor Performance**: Pantau akurasi model secara berkala
3. **Update Model**: Latih ulang model dengan data baru secara rutin
4. **Validate Results**: Selalu validasi hasil prediksi dengan expert domain
5. **Clean Data**: Pastikan data training bersih dan berkualitas

---

**© 2025 Naive Bayes Classification System**
