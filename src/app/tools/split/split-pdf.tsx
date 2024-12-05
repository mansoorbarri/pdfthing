"use client";
import React, { useState } from "react";
import JSZip from "jszip"; // Import JSZip
import { PDFDocument } from "pdf-lib";
import { UploadBox } from "@/components/upload-box";

const SplitPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [fileNameWithoutExt, setFileNameWithoutExt] = useState<string>("");

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setProcessing(true); // Disable further interactions while processing
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();

    const separatedFiles: File[] = [];
    const separatedImages: string[] = [];

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
    setFileNameWithoutExt(fileNameWithoutExt);

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

      // Generate image preview of the page (this part generates a link to the preview)
      const imageUrl = URL.createObjectURL(blob);
      separatedImages.push(imageUrl);
    }

    setFiles(separatedFiles);
    setPageImages(separatedImages);
    setProcessing(false); // Re-enable interactions
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name; // Ensure the file name is used as the download name
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up the DOM
  };

  const downloadAllFiles = async () => {
    const zip = new JSZip();

    // Add each file directly to the root of the ZIP file
    files.forEach((file) => {
      zip.file(file.name, file); // Add PDF files to the zip directly, not inside a folder
    });

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Trigger download of the zip file using the initial file name
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileNameWithoutExt}.zip`; // Use the initial file name for the zip
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up the DOM
  };
  
  const handleClear = () => {
    setFiles([]);
    setPageImages([]);
    setFileNameWithoutExt(""); // Clear the file name
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <div className="">
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
                  {/* Render page preview as image */}
                  <img
                    key={index}
                    src={pageImages[index]}
                    alt={`Page ${index + 1}`}
                    className="w-32 h-44 object-cover border border-gray-300 rounded-lg mb-2"
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => downloadFile(file)} // Trigger download
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 mx-auto block mb-6"
              onClick={downloadAllFiles} // Download all pages as ZIP
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
    </div>
  );
};

export default SplitPDF;
