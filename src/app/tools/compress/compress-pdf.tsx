"use client";

import React, { useState } from "react";
import { UploadBox } from "@/components/upload-box";

const CompressPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (uploadedFile: File | null) => {
    if (uploadedFile) {
      // Modify the file name by adding "-min" before the extension
      const fileName = uploadedFile.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf("."));
      const baseName = fileName.substring(0, fileName.lastIndexOf("."));
      const newFileName = `${baseName}-min${fileExtension}`;

      // Create a new File object with the modified name
      const fileWithNewName = new File([uploadedFile], newFileName, {
        type: uploadedFile.type,
      });

      setFile(fileWithNewName);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to compress the PDF.");
      }

      // Process the response to download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name; // Use the modified file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error compressing PDF:", error);
    } finally {
      setProcessing(false);
    }
  };

  const clearFiles = () => {
    setFile(null);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Compress PDF</h1>
      <p className="text-gray-600 mb-6">
        Drag and drop your PDF or upload it to compress your PDF.
      </p>
      {!file ? (
        <UploadBox onUpload={handleFileUpload} processing={processing} />
      ) : (
        <div className="w-full flex flex-col items-center">
          <p className="text-gray-700 mb-4">Selected file: {file.name}</p>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              processing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            onClick={handleCompress}
            disabled={processing}
          >
            {processing ? "Compressing..." : "Compress PDF"}
          </button>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={clearFiles}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default CompressPDF;
