import { FileUpload } from "@/components/file-upload";

interface TrainingDataUploadProps {
  onFileChange: (file: File | null) => void;
  required?: boolean;
  className?: string;
}

export function TrainingDataUpload({
  onFileChange,
  required = true,
  className = "h-full flex-grow min-h-[200px] sm:min-h-[250px]",
}: TrainingDataUploadProps) {
  return (
    <div className="h-full flex flex-col">
      {" "}
      <FileUpload
        accept=".csv"
        label="Data Pelatihan"
        description="Upload CSV dengan data pelatihan"
        onFileChange={onFileChange}
        required={required}
        className={className}
      />
    </div>
  );
}
