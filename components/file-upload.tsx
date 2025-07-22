"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { Download, CheckCircle, FileText, Trash2 } from "lucide-react";
import { useConfirmationDialog } from "@/components/confirmation-dialog";

interface FileUploadProps {
  accept: string;
  label: string;
  description?: string;
  onFileChange: (file: File | null) => void;
  required?: boolean;
  className?: string;
}

export function FileUpload({
  accept,
  label,
  description,
  onFileChange,
  required = false,
  className = "",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { openDialog, ConfirmationDialog } = useConfirmationDialog();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileChange(file);
    } else {
      setSelectedFile(null);
      onFileChange(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (
        accept &&
        !file.name.toLowerCase().endsWith(accept.replace(".", ""))
      ) {
        alert(`Hanya file ${accept} yang diterima`);
        return;
      }
      setSelectedFile(file);
      onFileChange(file);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col gap-2">
        {label && (
          <Label htmlFor="file-upload" className="text-sm font-medium">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </Label>
        )}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer
            ${
              selectedFile
                ? "border-green-400 bg-green-950/10"
                : isDragging
                ? "border-blue-400 bg-blue-950/10"
                : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40"
            }`}
        >
          <Input
            type="file"
            id="file-upload"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required={required}
          />

          {!selectedFile ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-muted rounded-full">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>{" "}
              <div className="space-y-2">
                <p className="text-foreground font-medium">
                  Letakkan file Anda di sini, atau klik untuk memilih
                </p>
                <p className="text-sm text-muted-foreground">
                  {description || `Mendukung file ${accept}`}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-950/20 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>{" "}
              <div className="space-y-2">
                <p className="font-medium text-green-400">
                  File berhasil diunggah
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-mono">{selectedFile.name}</span>
                  <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                onClick={(e) => {
                  e.stopPropagation();
                  openDialog({
                    title: "Hapus File",
                    description: `Apakah Anda yakin ingin menghapus file "${selectedFile?.name}"? File yang telah dihapus perlu diunggah ulang.`,
                    confirmText: "Hapus File",
                    cancelText: "Batal",
                    variant: "destructive",
                    onConfirm: () => {
                      setSelectedFile(null);
                      onFileChange(null);
                    },
                  });
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus file
              </Button>
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog />
    </div>
  );
}
