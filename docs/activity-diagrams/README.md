# Activity Diagrams - Naive Bayes Classifier System

Folder ini berisi activity diagram untuk sistem klasifikasi Naive Bayes yang menggambarkan alur aktivitas antara Admin dan System dalam format swimlanes yang disederhanakan.

## Format Diagram

Semua activity diagram menggunakan format PlantUML dengan dua kolom (swimlanes):
- **Admin** (warna biru muda): Menunjukkan aktivitas yang dilakukan oleh pengguna admin
- **System** (warna hijau muda): Menunjukkan respons dan proses yang dilakukan oleh sistem

## Daftar Activity Diagram

### 1. Login Admin (00-system-overview.puml)
Menggambarkan proses autentikasi admin untuk mengakses sistem:
- Admin membuka aplikasi dan input kredensial
- System memvalidasi dan memberikan akses

### 2. Dashboard Analitik (01-dashboard-analytics.puml)
Menggambarkan aktivitas melihat dashboard analitik:
- Admin memilih menu Dashboard
- System menampilkan statistik dan visualisasi data

### 3. Pelatihan Model Naive Bayes (02-train-model.puml)
Menggambarkan proses pelatihan model:
- Admin upload dataset dan konfigurasi
- System melatih model dan menampilkan hasil

### 4. Klasifikasi Kepuasan Penumpang (03-classify-data.puml)
Menggambarkan proses klasifikasi data:
- Admin pilih model dan input data
- System melakukan prediksi dan menampilkan hasil

### 5. Kelola Data Penumpang (04-manage-dataset.puml)
Menggambarkan pengelolaan data penumpang:
- Admin melakukan operasi CRUD pada data
- System memvalidasi dan menyimpan perubahan

### 6. Kelola Model (05-model-management.puml)
Menggambarkan pengelolaan model yang tersimpan:
- Admin melihat, detail, atau hapus model
- System menampilkan informasi dan mengelola model

### 7. Laporan Hasil Klasifikasi (06-classification-history.puml)
Menggambarkan akses ke laporan dan history:
- Admin melihat history dan download laporan
- System menyediakan data dan generate laporan

### 8. Generate Laporan Sistem (07-reports-generation.puml)
Menggambarkan proses generate laporan komprehensif:
- Admin mengakses sistem pelaporan
- Pilih jenis laporan (4 jenis tersedia)
- Generate dalam mode interaktif atau print/PDF
- Download dan export laporan

## Cara Menggunakan

1. Install PlantUML extension di VS Code
2. Buka file .puml
3. Preview diagram dengan Ctrl+Shift+P > "PlantUML: Preview Current Diagram"

## Karakteristik Diagram

- **Sederhana**: Fokus pada alur utama tanpa detail teknis berlebihan
- **Dua Kolom**: Pemisahan jelas antara aktivitas Admin dan System
- **Visual**: Menggunakan warna untuk membedakan aktor
- **Konsisten**: Format yang sama untuk semua diagram

Diagram ini sesuai dengan use case yang didefinisikan dalam BAB IV dan mencerminkan fitur-fitur utama aplikasi Naive Bayes Classifier.
