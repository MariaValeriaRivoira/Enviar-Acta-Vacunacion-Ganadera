import { useState } from "react";
import FileUpload from "../FileUpload";

export default function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FileUpload
      onFileSelect={setFile}
      selectedFile={file}
    />
  );
}
