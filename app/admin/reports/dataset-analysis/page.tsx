import { fetchDatasetRecords } from "@/_actions";
import { ReportLayout } from "@/app/admin/reports/_components/report-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, BarChart3, Users, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Laporan Analisis Dataset - Pengklasifikasi Naive Bayes",
    description:
      "Laporan analisis komprehensif dataset penumpang untuk training model klasifikasi",
  };
}

export default async function DatasetAnalysisPage() {
  const datasetRecords = await fetchDatasetRecords();

  // Dataset analysis calculations
  const totalRecords = datasetRecords.length;

  // Satisfaction distribution
  const satisfiedCount = datasetRecords.filter(
    (r) => r.rawData.satisfaction === "satisfied"
  ).length;
  const dissatisfiedCount = datasetRecords.filter(
    (r) => r.rawData.satisfaction === "dissatisfied"
  ).length;
  const neutralCount = datasetRecords.filter(
    (r) => r.rawData.satisfaction === "neutral"
  ).length;

  // Gender distribution
  const maleCount = datasetRecords.filter(
    (r) => r.rawData.gender === "Male"
  ).length;
  const femaleCount = datasetRecords.filter(
    (r) => r.rawData.gender === "Female"
  ).length;

  // Age analysis
  const ages = datasetRecords
    .map((r) => r.rawData.age)
    .filter((age) => age !== null && age !== undefined);
  const avgAge =
    ages.length > 0 ? ages.reduce((sum, age) => sum + age, 0) / ages.length : 0;
  const minAge = ages.length > 0 ? Math.min(...ages) : 0;
  const maxAge = ages.length > 0 ? Math.max(...ages) : 0;

  // Customer type distribution
  const loyalCustomers = datasetRecords.filter(
    (r) => r.rawData.customer_type === "Loyal Customer"
  ).length;
  const disLoyalCustomers = datasetRecords.filter(
    (r) => r.rawData.customer_type === "disloyal Customer"
  ).length;

  // Class distribution
  const businessClass = datasetRecords.filter(
    (r) => r.rawData.class === "Business"
  ).length;
  const ecoClass = datasetRecords.filter(
    (r) => r.rawData.class === "Eco"
  ).length;
  const ecoPlusClass = datasetRecords.filter(
    (r) => r.rawData.class === "Eco Plus"
  ).length;

  // Travel type distribution
  const businessTravel = datasetRecords.filter(
    (r) => r.rawData.type_of_travel === "Business travel"
  ).length;
  const personalTravel = datasetRecords.filter(
    (r) => r.rawData.type_of_travel === "Personal Travel"
  ).length;

  // Flight distance analysis
  const distances = datasetRecords
    .map((r) => r.rawData.flight_distance)
    .filter((d) => d !== null && d !== undefined);
  const avgDistance =
    distances.length > 0
      ? distances.reduce((sum, d) => sum + d, 0) / distances.length
      : 0;

  // Data quality analysis
  const completeRecords = datasetRecords.filter(
    (r) =>
      r.rawData.satisfaction &&
      r.rawData.gender &&
      r.rawData.age &&
      r.rawData.customer_type &&
      r.rawData.class &&
      r.rawData.type_of_travel &&
      r.rawData.flight_distance !== null
  ).length;
  const dataQuality = (completeRecords / totalRecords) * 100;

  return (
    <ReportLayout
      title="LAPORAN ANALISIS DATASET PENUMPANG"
      subtitle="Analisis Komprehensif Data Training Model Klasifikasi Kepuasan"
    >
      {/* Dataset Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          IKHTISAR DATASET
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-700 font-medium">
                    Total Records
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {totalRecords.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-emerald-700 font-medium">
                    Kualitas Data
                  </div>
                  <div className="text-2xl font-bold text-emerald-800">
                    {dataQuality.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-violet-700 font-medium">
                    Rata-rata Usia
                  </div>
                  <div className="text-2xl font-bold text-violet-800">
                    {avgAge.toFixed(1)} tahun
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-amber-700 font-medium">
                    Avg. Distance
                  </div>
                  <div className="text-2xl font-bold text-amber-800">
                    {avgDistance.toFixed(0)} mil
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Distribution Analysis */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ANALISIS DISTRIBUSI DATA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Satisfaction Distribution */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">
                Distribusi Kepuasan Penumpang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-green-700">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Puas (Satisfied)
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {satisfiedCount} (
                    {((satisfiedCount / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(satisfiedCount / totalRecords) * 100}
                  className="h-3 bg-green-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-green-700">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Tidak Puas (Dissatisfied)
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {dissatisfiedCount} (
                    {((dissatisfiedCount / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(dissatisfiedCount / totalRecords) * 100}
                  className="h-3 bg-red-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-green-700">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Netral (Neutral)
                  </span>
                  <span className="text-sm font-bold text-green-800">
                    {neutralCount} (
                    {((neutralCount / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(neutralCount / totalRecords) * 100}
                  className="h-3 bg-blue-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Gender Distribution */}
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-pink-800">
                Distribusi Jenis Kelamin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-pink-700">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Pria (Male)
                  </span>
                  <span className="text-sm font-bold text-pink-800">
                    {maleCount} ({((maleCount / totalRecords) * 100).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  value={(maleCount / totalRecords) * 100}
                  className="h-3 bg-blue-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-pink-700">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    Wanita (Female)
                  </span>
                  <span className="text-sm font-bold text-pink-800">
                    {femaleCount} (
                    {((femaleCount / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(femaleCount / totalRecords) * 100}
                  className="h-3 bg-pink-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Type Distribution */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-800">
                Distribusi Tipe Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-emerald-700">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    Loyal Customer
                  </span>
                  <span className="text-sm font-bold text-emerald-800">
                    {loyalCustomers} (
                    {((loyalCustomers / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(loyalCustomers / totalRecords) * 100}
                  className="h-3 bg-emerald-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-emerald-700">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Disloyal Customer
                  </span>
                  <span className="text-sm font-bold text-emerald-800">
                    {disLoyalCustomers} (
                    {((disLoyalCustomers / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(disLoyalCustomers / totalRecords) * 100}
                  className="h-3 bg-yellow-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Class Distribution */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">
                Distribusi Kelas Penerbangan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-purple-700">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Business Class
                  </span>
                  <span className="text-sm font-bold text-purple-800">
                    {businessClass} (
                    {((businessClass / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(businessClass / totalRecords) * 100}
                  className="h-3 bg-purple-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-purple-700">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    Economy Class
                  </span>
                  <span className="text-sm font-bold text-purple-800">
                    {ecoClass} ({((ecoClass / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(ecoClass / totalRecords) * 100}
                  className="h-3 bg-orange-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2 text-purple-700">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    Eco Plus Class
                  </span>
                  <span className="text-sm font-bold text-purple-800">
                    {ecoPlusClass} (
                    {((ecoPlusClass / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={(ecoPlusClass / totalRecords) * 100}
                  className="h-3 bg-teal-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ANALISIS STATISTIK
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-800">
                Karakteristik Demografis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-indigo-600">Usia Minimum</span>
                  <span className="font-semibold text-indigo-800">
                    {minAge} tahun
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-indigo-600">Usia Maksimum</span>
                  <span className="font-semibold text-indigo-800">
                    {maxAge} tahun
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-indigo-600">
                    Usia Rata-rata
                  </span>
                  <span className="font-semibold text-indigo-800">
                    {avgAge.toFixed(1)} tahun
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-indigo-600">
                    Dominasi Gender
                  </span>
                  <span className="font-semibold text-indigo-800">
                    {maleCount > femaleCount ? "Pria" : "Wanita"} (
                    {Math.max(
                      (maleCount / totalRecords) * 100,
                      (femaleCount / totalRecords) * 100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-teal-800">
                Karakteristik Perjalanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-teal-600">Jarak Rata-rata</span>
                  <span className="font-semibold text-teal-800">
                    {avgDistance.toFixed(0)} mil
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-teal-600">
                    Tipe Perjalanan Dominan
                  </span>
                  <span className="font-semibold text-teal-800">
                    {businessTravel > personalTravel
                      ? "Business Travel"
                      : "Personal Travel"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-teal-600">Kelas Dominan</span>
                  <span className="font-semibold">
                    {businessClass > ecoClass && businessClass > ecoPlusClass
                      ? "Business"
                      : ecoClass > ecoPlusClass
                      ? "Economy"
                      : "Eco Plus"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Customer Loyalty
                  </span>
                  <span className="font-semibold">
                    {((loyalCustomers / totalRecords) * 100).toFixed(1)}% Loyal
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Quality Analysis */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          ANALISIS KUALITAS DATA
        </h2>
        <div className="bg-gray-50 border rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Kelengkapan Data:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  • <strong>Records Lengkap:</strong> {completeRecords} dari{" "}
                  {totalRecords} ({dataQuality.toFixed(1)}%)
                </li>
                <li>
                  • <strong>Missing Data:</strong>{" "}
                  {totalRecords - completeRecords} records (
                  {(100 - dataQuality).toFixed(1)}%)
                </li>
                <li>
                  • <strong>Kualitas Data:</strong>{" "}
                  {dataQuality > 95
                    ? "Sangat Baik"
                    : dataQuality > 90
                    ? "Baik"
                    : dataQuality > 80
                    ? "Cukup"
                    : "Perlu Improvement"}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Distribusi Balanced:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  • <strong>Gender Balance:</strong>{" "}
                  {Math.abs((maleCount / totalRecords) * 100 - 50).toFixed(1)}%
                  deviation dari ideal 50-50
                </li>
                <li>
                  • <strong>Satisfaction Balance:</strong> Distribusi{" "}
                  {((satisfiedCount / totalRecords) * 100).toFixed(1)}% puas vs{" "}
                  {((dissatisfiedCount / totalRecords) * 100).toFixed(1)}% tidak
                  puas
                </li>
                <li>
                  • <strong>Class Balance:</strong> Variasi kelas{" "}
                  {businessClass > 0 && ecoClass > 0 && ecoPlusClass > 0
                    ? "tersedia lengkap"
                    : "tidak seimbang"}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Rekomendasi Data:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {dataQuality < 95 && (
                  <li>
                    • Lakukan cleaning data untuk meningkatkan kelengkapan
                  </li>
                )}
                {Math.abs((maleCount / totalRecords) * 100 - 50) > 10 && (
                  <li>
                    • Pertimbangkan balancing gender untuk representasi yang
                    lebih baik
                  </li>
                )}
                {Math.abs(
                  (satisfiedCount / totalRecords) * 100 -
                    (dissatisfiedCount / totalRecords) * 100
                ) > 20 && (
                  <li>
                    • Dataset memiliki imbalance pada kelas kepuasan,
                    pertimbangkan teknik balancing
                  </li>
                )}
                <li>
                  • Dataset sudah cukup representatif untuk training model Naive
                  Bayes
                </li>
                <li>
                  • Lakukan monitoring periodic untuk menjaga kualitas data
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">KESIMPULAN</h2>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">
            Dataset dengan {totalRecords.toLocaleString("id-ID")} records
            menunjukkan kualitas data yang
            {dataQuality > 95
              ? "sangat baik"
              : dataQuality > 90
              ? "baik"
              : "perlu improvement"}{" "}
            ({dataQuality.toFixed(1)}%). Distribusi data cukup beragam dengan
            representasi yang baik dari berbagai segmen penumpang.
            {(satisfiedCount / totalRecords) * 100 > 50
              ? `Dataset menunjukkan mayoritas penumpang puas (${(
                  (satisfiedCount / totalRecords) *
                  100
                ).toFixed(1)}%)`
              : `Dataset menunjukkan challenge dalam kepuasan penumpang (${(
                  (dissatisfiedCount / totalRecords) *
                  100
                ).toFixed(1)}% tidak puas)`}
            . Data ini suitable untuk training model Naive Bayes dengan performa
            yang baik.
          </p>
        </div>
      </section>
    </ReportLayout>
  );
}
