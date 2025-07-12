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
import { Filter, Search, FileText, Upload } from "lucide-react";
import { format } from "date-fns";

interface FilterState {
  datasetType: string;
  fileName: string;
  search: string;
}

interface DatasetRecordsTableProps {
  records: DatasetRecordsSelect[];
}

export function DatasetRecords({ records }: DatasetRecordsTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    datasetType: "",
    fileName: "",
    search: "",
  });

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

  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toLocaleString();
    return String(value);
  };

  return (
    <>
      <Card className="border border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-2">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Record ID, filename, or data values..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dataset-type">Dataset Type</Label>
              <Select
                value={filters.datasetType || undefined}
                onValueChange={handleDatasetTypeChange}
              >
                <SelectTrigger id="dataset-type" className="w-full mt-2">
                  <SelectValue placeholder="All Types" />
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
              <Label htmlFor="file-name">File Name</Label>
              <Select
                value={filters.fileName || undefined}
                onValueChange={handleFileNameChange}
              >
                <SelectTrigger id="file-name" className="w-full mt-2">
                  <SelectValue placeholder="All Files" />
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
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dataset Records</span>
            <Badge variant="outline">
              {filteredRecords.length} of {records.length} records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary text-secondary-foreground border-b border-border/40">
                    <TableHead>Record ID</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Dataset Type</TableHead>
                    <TableHead>Data Preview</TableHead>
                    <TableHead>Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow className="border border-border/40">
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {records.length === 0 ? (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <div>No dataset records found.</div>
                            <div className="text-sm">
                              Upload a CSV file or run a classification to see
                              data here.
                            </div>
                          </div>
                        ) : (
                          "No dataset records found matching the current filters."
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
                                +{Object.keys(record.rawData).length - 3} more
                                fields...
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(record.createdAt, "MMM d, yyyy")}
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
    </>
  );
}
