"use client";
import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadBox } from "@/components/upload-box";
import * as pdfjsLib from 'pdfjs-dist';

// Use the pdf.worker.js file for browser
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const MergePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = async (newFiles: File[]) => {
    if (!newFiles.length) return;
    
    setProcessing(true);
    
    try {
      // Add new files to existing files array
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      
      // Generate previews for all new files
      const newPreviews = await Promise.all(
        newFiles.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const pdfPage = await pdf.getPage(1); // Get first page for preview
          const viewport = pdfPage.getViewport({ scale: 0.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Could not get canvas context");

          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await pdfPage.render({ canvasContext: context, viewport }).promise;
          return canvas.toDataURL();
        })
      );

      setPageImages(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error("Error processing PDFs:", error);
      alert("Error processing PDFs. Please try again with valid PDF files.");
    }
    
    setProcessing(false);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    setProcessing(true);

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Load and copy pages from each PDF
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      // Download the merged PDF
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Error merging PDFs. Please try again with valid PDF files.");
    }

    setProcessing(false);
  };

  const handleClear = () => {
    setFiles([]);
    setPageImages([]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPageImages(pageImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 sm:p-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Merge PDFs</h1>
      <p className="text-center text-gray-600 mb-6">
        Upload multiple PDF files to merge them into a single document.
      </p>
      
      <UploadBox 
        onUpload={(files: File[]) => handleFileUpload(files)} 
        processing={processing}
        multiple={true}
      />
      
      {files.length > 0 && (
        <div className="w-full mt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {files.map((file, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={pageImages[index]}
                    alt={`PDF ${index + 1}`}
                    className="w-32 h-44 object-cover border border-gray-300 rounded-lg mb-2"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 truncate w-32 text-center">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 disabled:bg-gray-400"
              onClick={mergePDFs}
              disabled={files.length < 2 || processing}
            >
              Merge PDFs
            </button>
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
              onClick={handleClear}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergePDF;