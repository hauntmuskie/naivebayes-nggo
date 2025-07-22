"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatasetRecordsSelect } from "@/database/schema";
import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { Filter, Search, FileText, Upload, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { deleteDatasetRecord, deleteAllDatasetRecords } from "@/_actions";
import { useConfirmationDialog } from "@/components/confirmation-dialog";

interface FilterState {
  datasetType: string;
  fileName: string;
  search: string;
}

interface DatasetRecordsTableProps {
  records: DatasetRecordsSelect[];
}

export function DatasetRecords({ records }: DatasetRecordsTableProps) {
  const router = useRouter();
  const { openDialog, ConfirmationDialog } = useConfirmationDialog();
  const [filters, setFilters] = useState<FilterState>({
    datasetType: "",
    fileName: "",
    search: "",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const [debouncedSearchTerm] = useDebounce(filters.search, 300);

  const uniqueDatasetTypes = useMemo(() => {
    return [...new Set(records.map((r) => r.datasetType).filter(Boolean))];
  }, [records]);

  const uniqueFileNames = useMemo(() => {
    return [...new Set(records.map((r) => r.fileName).filter(Boolean))];
  }, [records]);

  const filterRecords = useCallback(
    (
      recordsToFilter: DatasetRecordsSelect[],
      filterState: FilterState,
      searchTerm: string
    ) => {
      return recordsToFilter.filter((record) => {
        const matchesSearch =
          !searchTerm ||
          record.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.values(record.rawData).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesDatasetType =
          !filterState.datasetType ||
          record.datasetType === filterState.datasetType;
        const matchesFileName =
          !filterState.fileName || record.fileName === filterState.fileName;

        return matchesSearch && matchesDatasetType && matchesFileName;
      });
    },
    []
  );

  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters, debouncedSearchTerm);
  }, [records, filters, debouncedSearchTerm, filterRecords]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      datasetType: "",
      fileName: "",
      search: "",
    });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleDatasetTypeChange = useCallback((value: string | undefined) => {
    setFilters((prev) => ({ ...prev, datasetType: value || "" }));
  }, []);

  const handleFileNameChange = useCallback((value: string | undefined) => {
    setFilters((prev) => ({ ...prev, fileName: value || "" }));
  }, []);

  const handleDeleteRecord = useCallback(
    (id: string, recordData: any) => {
      openDialog({
        title: "Hapus Record Dataset",
        description: `Apakah Anda yakin ingin menghapus record dengan ID "${id}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Hapus Record",
        cancelText: "Batal",
        variant: "destructive",
        onConfirm: async () => {
          setDeletingId(id);
          try {
            await deleteDatasetRecord(id);
            router.refresh();
          } catch (error) {
            console.error("Error deleting record:", error);
            throw new Error("Gagal menghapus record. Silakan coba lagi.");
          } finally {
            setDeletingId(null);
          }
        },
      });
    },
    [openDialog, router]
  );

  const handleDeleteAll = useCallback(() => {
    openDialog({
      title: "Hapus Semua Record",
      description: `Apakah Anda yakin ingin menghapus SEMUA ${records.length} record dataset? Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data yang telah diupload.`,
      confirmText: "Hapus Semua",
      cancelText: "Batal",
      variant: "destructive",
      onConfirm: async () => {
        setDeletingAll(true);
        try {
          await deleteAllDatasetRecords();
          router.refresh();
        } catch (error) {
          console.error("Error deleting all records:", error);
          throw new Error("Gagal menghapus semua record. Silakan coba lagi.");
        } finally {
          setDeletingAll(false);
        }
      },
    });
  }, [openDialog, router, records.length]);

  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Ya" : "Tidak";
    if (typeof value === "number") return value.toLocaleString();
    return String(value);
  };

  return (
    <>
      <Card className="border border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Pencarian</Label>
              <div className="relative mt-2">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="ID Record, nama file, atau nilai data..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dataset-type">Jenis Dataset</Label>
              <Select
                value={filters.datasetType || undefined}
                onValueChange={handleDatasetTypeChange}
              >
                <SelectTrigger id="dataset-type" className="w-full mt-2">
                  <SelectValue placeholder="Semua Jenis" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueDatasetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file-name">Nama File</Label>
              <Select
                value={filters.fileName || undefined}
                onValueChange={handleFileNameChange}
              >
                <SelectTrigger id="file-name" className="w-full mt-2">
                  <SelectValue placeholder="Semua File" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueFileNames.map((fileName) => (
                    <SelectItem key={fileName} value={fileName}>
                      {fileName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!Object.values(filters).some(Boolean)}
            >
              Hapus Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Catatan Dataset</span>
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                {filteredRecords.length} dari {records.length} catatan
              </Badge>
              {records.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAll}
                  disabled={deletingAll}
                  className="h-7"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {deletingAll ? "Menghapus..." : "Hapus Semua"}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary text-secondary-foreground border-b border-border/40">
                    <TableHead>ID Catatan</TableHead>
                    <TableHead>Nama File</TableHead>
                    <TableHead>Jenis Dataset</TableHead>
                    <TableHead>Pratinjau Data</TableHead>
                    <TableHead>Ditambahkan</TableHead>
                    <TableHead className="w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow className="border border-border/40">
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {records.length === 0 ? (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <div>Tidak ada catatan dataset ditemukan.</div>
                            <div className="text-sm">
                              Unggah file CSV atau jalankan klasifikasi untuk
                              melihat data di sini.
                            </div>
                          </div>
                        ) : (
                          "Tidak ada catatan dataset yang sesuai dengan filter saat ini."
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow
                        key={record.id}
                        className="border border-border/40"
                      >
                        <TableCell className="font-mono text-sm">
                          {record.recordId}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {record.fileName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {record.datasetType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 max-w-xs">
                            {Object.entries(record.rawData)
                              .slice(0, 3)
                              .map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-medium text-muted-foreground">
                                    {key}:
                                  </span>{" "}
                                  <span className="truncate">
                                    {renderCellValue(value)}
                                  </span>
                                </div>
                              ))}
                            {Object.keys(record.rawData).length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{Object.keys(record.rawData).length - 3} bidang
                                lainnya...
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(record.createdAt, "d MMM yyyy", {
                            locale: id,
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteRecord(record.id, record.rawData)
                            }
                            disabled={deletingId === record.id}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmationDialog />
    </>
  );
}
