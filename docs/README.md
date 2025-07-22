# Dokumentasi Sistem Klasifikasi Naive Bayes

Folder ini berisi dokumentasi lengkap untuk sistem klasifikasi Naive Bayes yang digunakan untuk analisis kepuasan penumpang.

## 📁 Struktur Dokumentasi

### Activity Diagrams
- **Lokasi**: `activity-diagrams/`
- **Deskripsi**: Diagram aktivitas yang menggambarkan alur proses bisnis sistem
- **Format**: PlantUML (.puml)
- **Jumlah**: 7 diagram utama

**Daftar Activity Diagrams**:
1. `00-system-overview.puml` - Login Admin
2. `01-dashboard-analytics.puml` - Dashboard Analitik
3. `02-train-model.puml` - Pelatihan Model
4. `03-classify-data.puml` - Klasifikasi Data
5. `04-manage-dataset.puml` - Kelola Dataset
6. `05-model-management.puml` - Kelola Model
7. `06-classification-history.puml` - Riwayat Klasifikasi
8. `07-reports-generation.puml` - Generate Laporan Sistem

### Sequence Diagrams
- **Lokasi**: `sequence-diagrams/`
- **Deskripsi**: Diagram sequence yang menggambarkan interaksi antar komponen sistem
- **Format**: PlantUML (.puml)
- **Jumlah**: 6 diagram sesuai use case

**Daftar Sequence Diagrams**:
1. `01-dashboard-analytics.puml` - Sequence Dashboard
2. `02-train-model.puml` - Sequence Pelatihan Model
3. `03-classify-data.puml` - Sequence Klasifikasi
4. `04-manage-dataset.puml` - Sequence Kelola Dataset
5. `05-model-management.puml` - Sequence Kelola Model
6. `06-classification-history.puml` - Sequence Riwayat
7. `07-reports-generation.puml` - Sequence Generate Laporan

### Class Diagram
- **File**: `class-diagram.puml`
- **Dokumentasi**: `class-diagram-documentation.md`
- **Deskripsi**: Struktur kelas utama sistem dengan 5 entitas inti
- **Format**: PlantUML (.puml)

**Kelas Utama**:
- Admin - Pengelola sistem
- Model - Model Naive Bayes
- Klasifikasi - Hasil prediksi
- Dataset - Data training/testing
- History - Riwayat klasifikasi
- Reports - Sistem pelaporan

### BAB IV - Pemodelan Perangkat Lunak
- **File**: `BAB-IV.md`
- **Deskripsi**: Dokumentasi use case diagram dan skenario sistem
- **Isi**: Use case scenarios untuk 6 fitur utama sistem

## 🛠️ Tools dan Format

### PlantUML
Semua diagram menggunakan PlantUML untuk konsistensi dan kemudahan maintenance.

**Cara menggunakan**:
1. Install PlantUML extension di VS Code
2. Buka file .puml
3. Preview dengan `Ctrl+Shift+P` > "PlantUML: Preview Current Diagram"

### Markdown
Dokumentasi tekstual menggunakan format Markdown untuk readability.

## 📊 Fitur Sistem yang Didokumentasikan

### 1. Autentikasi
- Login admin
- Validasi kredensial
- Manajemen sesi

### 2. Dashboard Analitik
- Visualisasi statistik
- Metrik performa model
- Overview system health

### 3. Pelatihan Model
- Upload dataset training
- Konfigurasi model (target & feature columns)
- Training dengan algoritma Naive Bayes
- Evaluasi performa model

### 4. Klasifikasi Data
- Pemilihan model
- Upload data testing
- Prediksi batch
- Penyimpanan hasil

### 5. Manajemen Model
- Katalog model
- Detail performa
- Penghapusan model
- Model versioning

### 6. Manajemen Dataset
- Upload file CSV
- Validasi format
- Preview data
- Penyimpanan metadata

### 7. Riwayat Klasifikasi
- History klasifikasi batch
- Detail hasil
- Export laporan
- Filter dan pencarian

## 🎯 Tujuan Dokumentasi

1. **Pemahaman Sistem**: Memberikan gambaran lengkap tentang sistem
2. **Panduan Pengembangan**: Memandu developer dalam implementasi
3. **Referensi Maintenance**: Dokumentasi untuk pemeliharaan sistem
4. **Academic Reference**: Mendukung penulisan thesis/skripsi
5. **Stakeholder Communication**: Komunikasi dengan stakeholder non-teknis

## 📋 Standar Dokumentasi

### Naming Convention
- File menggunakan kebab-case
- Diagram menggunakan numbering (01-, 02-, dst.)
- Bahasa Indonesia untuk konten bisnis
- Bahasa Inggris untuk kode dan teknis

### Struktur Diagram
- Title yang jelas
- Swimlanes untuk activity diagram
- Actor dan boundary untuk sequence diagram
- Color coding untuk class diagram
- Consistent styling

### Kualitas Dokumentasi
- ✅ Lengkap dan detail
- ✅ Mudah dipahami
- ✅ Konsisten format
- ✅ Update sesuai development
- ✅ Visual yang informatif

## 🔄 Update dan Maintenance

Dokumentasi ini harus diupdate seiring dengan perubahan sistem:

1. **Penambahan Fitur**: Update diagram dan dokumentasi terkait
2. **Perubahan Alur**: Revisi activity dan sequence diagram
3. **Perubahan Database**: Update class diagram
4. **Bug Fix**: Koreksi dokumentasi jika diperlukan

## 📚 Referensi

- **PlantUML Documentation**: https://plantuml.com/
- **UML Best Practices**: Standard UML modeling practices
- **Next.js Documentation**: Framework reference
- **Naive Bayes Algorithm**: Machine learning reference

---

*Dokumentasi ini dibuat untuk mendukung pengembangan dan pemahaman sistem klasifikasi Naive Bayes untuk analisis kepuasan penumpang.*
