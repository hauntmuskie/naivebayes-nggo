import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import React from "react";

export interface DatasetRecordsFiltersProps {
  filters: {
    datasetType: string;
    fileName: string;
    search: string;
  };
  uniqueDatasetTypes: string[];
  uniqueFileNames: string[];
  onSearchChange: (value: string) => void;
  onDatasetTypeChange: (value: string | undefined) => void;
  onFileNameChange: (value: string | undefined) => void;
  onClearFilters: () => void;
}

export const DatasetRecordsFilters: React.FC<DatasetRecordsFiltersProps> = ({
  filters,
  uniqueDatasetTypes,
  uniqueFileNames,
  onSearchChange,
  onDatasetTypeChange,
  onFileNameChange,
  onClearFilters,
}) => {
  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dataset-type">Jenis Dataset</Label>
            <Select
              value={filters.datasetType || undefined}
              onValueChange={onDatasetTypeChange}
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
              onValueChange={onFileNameChange}
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
            onClick={onClearFilters}
            disabled={!Object.values(filters).some(Boolean)}
          >
            Hapus Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
