# Sequence Diagrams - Simplified

Kumpulan sequence diagram sederhana yang menggambarkan alur utama dalam sistem Naive Bayes Classifier.

## Diagram yang Tersedia

1. **01-dashboard-analytics.puml** - Dashboard Analitik
   - Lihat overview sistem dan statistik model

2. **02-train-model.puml** - Pelatihan Model
   - Upload dataset dan training model Naive Bayes

3. **03-classify-data.puml** - Klasifikasi Data
   - Prediksi data baru menggunakan model

4. **04-manage-dataset.puml** - Kelola Dataset
   - Lihat data penumpang yang tersimpan

5. **05-model-management.puml** - Kelola Model
   - CRUD operations untuk model

6. **06-classification-history.puml** - History Klasifikasi
   - Lihat dan kelola riwayat prediksi

7. **07-reports-generation.puml** - Generate Laporan
   - Akses dan generate 4 jenis laporan sistem
   - Export laporan dalam format print/PDF

## Komponen Sederhana

### Actors
- **User**: Pengguna sistem

### Components
- **Pages/Forms**: UI components (React)
- **API**: Backend logic layer
- **DB**: Database layer (PostgreSQL + Drizzle)

## Pola Interaksi

Pola sederhana yang digunakan:
```
User → UI Component → API → Database → Response
```

## Fitur Utama per Diagram

- **Dashboard**: Statistik dan monitoring
- **Training**: Upload CSV → Train model → Save
- **Classification**: Pilih model → Upload data → Predict
- **Dataset**: View uploaded data
- **Models**: CRUD model management
- **History**: View & manage prediction history
