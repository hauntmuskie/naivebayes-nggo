# Sistem Pelaporan Klasifikasi Kepuasan Penumpang

## Overview
Sistem pelaporan ini menyediakan 4 jenis laporan komprehensif untuk analisis sistem klasifikasi Naive Bayes yang digunakan untuk menganalisis kepuasan penumpang. Setiap laporan dirancang untuk memberikan insights yang berbeda sesuai kebutuhan stakeholder.

## 🗂️ Jenis Laporan

### 1. **Laporan Performa Model Naive Bayes**
- **URL**: `/reports/model-performance`
- **Deskripsi**: Analisis lengkap performa semua model Naive Bayes
- **Fitur Utama**:
  - Metrics Performa (Akurasi, Precision, Recall, F1-Score)
  - Confusion Matrix untuk setiap model
  - Analisis Akurasi dan perbandingan antar model
  - Perbandingan Model berdasarkan performance metrics

### 2. **Laporan Hasil Klasifikasi Kepuasan**
- **URL**: `/reports/classification-results`
- **Deskripsi**: Ringkasan hasil klasifikasi kepuasan penumpang
- **Fitur Utama**:
  - Distribusi Kelas prediksi kepuasan
  - Confidence Analysis tingkat keyakinan prediksi
  - Hasil per Model yang telah digunakan
  - Tren Prediksi dari waktu ke waktu

### 3. **Laporan Analisis Dataset Penumpang**
- **URL**: `/reports/dataset-analysis`
- **Deskripsi**: Analisis mendalam dataset penumpang
- **Fitur Utama**:
  - Distribusi Data berdasarkan jenis dataset
  - Feature Analysis untuk atribut kepuasan
  - Data Quality assessment
  - Pattern Recognition dalam data

### 4. **Laporan Ringkasan Sistem Klasifikasi**
- **URL**: `/reports/system-summary`
- **Deskripsi**: Overview menyeluruh sistem klasifikasi
- **Fitur Utama**:
  - Statistik Keseluruhan sistem
  - Usage Analytics penggunaan sistem
  - Performance Trends performa dari waktu ke waktu
  - System Health status kesehatan sistem

## 📊 Fitur Umum Semua Laporan

### Mode Tampilan
- **Interactive Mode**: Tampilan normal dengan navigasi dan interaksi
- **Print Mode**: Format khusus untuk pencetakan PDF (`?print=true`)

### Akses Cepat
- Tombol "Lihat Laporan" untuk mode interactive
- Tombol printer untuk langsung ke mode print
- Quick actions untuk download PDF semua laporan

### Statistik Real-time
- Data terupdate secara real-time
- Informasi tanggal generate laporan
- Badge status kualitas sistem

## 🎯 Target Pengguna

### Admin Sistem
- Monitoring performa model
- Analisis hasil klasifikasi
- Evaluasi kualitas dataset
- Oversight keseluruhan sistem

### Data Analyst
- Deep dive analysis pada model performance
- Pattern recognition dalam data
- Trend analysis dari hasil klasifikasi

### Management/Stakeholder
- Executive summary dari system performance
- High-level insights untuk decision making
- ROI analysis dari implementasi sistem

## 📈 Metrics yang Dilacak

### Model Performance
- **Akurasi**: Persentase prediksi yang benar
- **Precision**: Ketepatan prediksi positif
- **Recall**: Kemampuan mendeteksi kelas positif
- **F1-Score**: Harmonic mean precision dan recall
- **Confusion Matrix**: Detail prediksi per kelas

### System Usage
- Total model yang telah dilatih
- Total klasifikasi yang telah dilakukan
- Total dataset records yang diproses
- Aktivitas dalam periode tertentu

### Data Quality
- Distribusi dataset berdasarkan tipe
- Kualitas feature dalam dataset
- Pattern dan anomali dalam data
- Coverage dan completeness data

## 🔧 Implementasi Teknis

### Technology Stack
- **Frontend**: Next.js 14 dengan App Router
- **UI Components**: Custom components dengan Tailwind CSS
- **Database**: PostgreSQL dengan Drizzle ORM
- **Print Support**: CSS print media queries
- **Icons**: Lucide React

### File Structure
```
app/reports/
├── page.tsx                 # Main reports dashboard
├── loading.tsx             # Loading state
├── _components/
│   └── report-card.tsx     # Reusable report card component
├── model-performance/
│   └── page.tsx           # Model performance report
├── classification-results/
│   └── page.tsx           # Classification results report
├── dataset-analysis/
│   └── page.tsx           # Dataset analysis report
└── system-summary/
    └── page.tsx           # System summary report
```

### Data Sources
- Models table: Informasi model yang telah dilatih
- Classifications table: Hasil klasifikasi individual
- Dataset Records table: Data training/testing
- Classification History table: Riwayat batch processing

## 🎨 Design Principles

### User Experience
- **Clarity**: Informasi disajikan dengan jelas dan mudah dipahami
- **Accessibility**: Design yang accessible untuk semua pengguna
- **Responsiveness**: Optimal di desktop dan mobile
- **Print-friendly**: Format khusus untuk pencetakan

### Visual Hierarchy
- Color coding untuk berbagai jenis informasi
- Typography yang konsisten
- Spacing yang optimal untuk readability
- Icons yang intuitive untuk quick recognition

### Performance
- Server-side rendering untuk load time optimal
- Efficient data fetching dengan parallel requests
- Optimized bundle size dengan tree shaking
- Caching strategy untuk frequently accessed data

## 📋 Cara Penggunaan

### Akses Laporan
1. Navigate ke `/reports` untuk dashboard utama
2. Pilih jenis laporan yang diinginkan
3. Klik "Lihat Laporan" untuk mode interactive
4. Klik icon printer untuk mode print/PDF

### Generate PDF
1. Klik tombol printer pada report card
2. Atau tambahkan `?print=true` di URL
3. Gunakan print browser untuk save as PDF
4. Atau gunakan quick actions di dashboard

### Interpretasi Data
- **Hijau**: Indicates good performance/positive metrics
- **Merah**: Indicates areas needing attention
- **Biru**: Neutral/informational data
- **Orange**: Warning/moderate performance

## 🔮 Future Enhancements

### Planned Features
- Export ke Excel/CSV format
- Automated report scheduling
- Email delivery untuk stakeholders
- Custom date range filtering
- Advanced filtering dan sorting
- Dashboard customization

### Advanced Analytics
- Predictive analytics untuk model performance
- Trend forecasting
- Anomaly detection dalam sistem
- Comparative analysis antar periode
- ROI calculation dan business metrics

---

*Dokumentasi ini akan terus diupdate seiring dengan pengembangan fitur baru dalam sistem pelaporan.*
