import { FileUpload } from "@/components/file-upload";

interface TrainingDataUploadProps {
  onFileChange: (file: File | null, rowCount?: number) => void;
  required?: boolean;
  className?: string;
}

export function TrainingDataUpload({
  onFileChange,
  required = true,
  className = "h-full flex-grow min-h-[200px] sm:min-h-[250px]",
}: TrainingDataUploadProps) {
  const handleFileChange = async (file: File | null) => {
    if (file) {
      try {
        const text = await file.text();
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const rowCount = Math.max(0, lines.length - 1);
        onFileChange(file, rowCount);
      } catch (error) {
        console.error("Error reading file for row count:", error);
        onFileChange(file, 0);
      }
    } else {
      onFileChange(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <FileUpload
        accept=".csv"
        label="Data Pelatihan"
        description="Upload CSV dengan data pelatihan"
        onFileChange={handleFileChange}
        required={required}
        className={className}
      />
    </div>
  );
}
