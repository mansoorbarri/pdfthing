"use client"; // Use pdf.js in the browser
import React, { useState } from "react";
import JSZip from "jszip"; // Import JSZip
import { PDFDocument } from "pdf-lib";
import { UploadBox } from "@/components/upload-box";
import * as pdfjsLib from 'pdfjs-dist';

// Use the pdf.worker.js file for browser
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const SplitPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [fileNameWithoutExt, setFileNameWithoutExt] = useState<string>("");

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setProcessing(true); // Disable interactions while processing
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    const separatedFiles: File[] = [];
    const separatedImages: string[] = [];

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
    setFileNameWithoutExt(fileNameWithoutExt);

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const newFile = new File([blob], `${fileNameWithoutExt}-page-${i + 1}.pdf`, {
        type: "application/pdf",
      });
      separatedFiles.push(newFile);

      // Use pdf.js to render an image of the page
      const pdfPage = await pdf.getPage(i + 1);
      const viewport = pdfPage.getViewport({ scale: 0.5 }); // Adjust scale for resolution

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await pdfPage.render({ canvasContext: context, viewport }).promise;
        const imageUrl = canvas.toDataURL(); // Convert canvas to data URL
        separatedImages.push(imageUrl);
      }
    }

    setFiles(separatedFiles);
    setPageImages(separatedImages);
    setProcessing(false); // Re-enable interactions
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllFiles = async () => {
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.name, file);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileNameWithoutExt}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setFiles([]);
    setPageImages([]);
    setFileNameWithoutExt("");
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 sm:p-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Split PDF</h1>
      <p className="text-center text-gray-600 mb-6">
        Drag and drop your PDF or upload it to split into individual pages.
      </p>
      {!files.length ? (
        <UploadBox onUpload={handleFileUpload} processing={processing} />
      ) : (
        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {files.map((file, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={pageImages[index]}
                  alt={`Page ${index + 1}`}
                  className="w-32 h-44 object-cover border border-gray-300 rounded-lg mb-2"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => downloadFile(file)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 mx-auto block mb-6"
            onClick={downloadAllFiles}
          >
            Download All as ZIP
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 mx-auto block"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitPDF;
