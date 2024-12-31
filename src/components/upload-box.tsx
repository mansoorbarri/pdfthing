import React, { useState } from "react";

interface UploadBoxProps {
  onUpload: ((file: File | null) => void) | ((files: File[]) => void);
  processing: boolean;
  multiple?: boolean;  // New prop to control multiple file upload
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onUpload, processing, multiple = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );

    if (droppedFiles.length === 0) return;

    if (multiple) {
      (onUpload as (files: File[]) => void)(droppedFiles);
    } else {
      (onUpload as (file: File | null) => void)(droppedFiles[0]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    
    if (selectedFiles.length === 0) return;

    if (multiple) {
      (onUpload as (files: File[]) => void)(selectedFiles);
    } else {
      (onUpload as (file: File | null) => void)(selectedFiles[0]);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${
        isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p className="mb-2 text-gray-600">
        Drag and drop your PDF{multiple ? 's' : ''} here
      </p>
      <label
        htmlFor="file-upload"
        className={`cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
          processing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Choose File{multiple ? 's' : ''}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={processing}
        multiple={multiple}
      />
      {multiple && (
        <p className="mt-2 text-sm text-gray-500">
          Select multiple files by holding Ctrl/Cmd while choosing
        </p>
      )}
      {processing && <p className="mt-2 text-sm text-gray-500">Processing...</p>}
    </div>
  );
};