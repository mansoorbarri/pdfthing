import React, { useState } from "react";

interface UploadBoxProps {
  onUpload: (file: File | null) => void;
  processing: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onUpload, processing }) => {
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
    const file = event.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onUpload(file);
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
      <p className="mb-2 text-gray-600">Drag and drop your PDF here</p>
      <label
        htmlFor="file-upload"
        className={`cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
          processing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Choose File
      </label>
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={processing}
      />
      {processing && <p className="mt-2 text-sm text-gray-500">Processing...</p>}
    </div>
  );
};
