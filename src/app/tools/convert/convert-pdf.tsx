"use client";

import React, { useState } from "react";
import JSZip from "jszip"; // For creating ZIP archives
import { UploadBox } from "@/components/upload-box"; // Custom file upload component
import * as pdfjsLib from "pdfjs-dist";

// Use the pdf.worker.js file for rendering PDFs in the browser
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const PDFToPNG = () => {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [fileNameWithoutExt, setFileNameWithoutExt] = useState<string>("");

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setProcessing(true); // Disable interactions while processing
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;

    const images: string[] = [];
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
    setFileNameWithoutExt(fileNameWithoutExt);

    for (let i = 0; i < pageCount; i++) {
      const pdfPage = await pdf.getPage(i + 1);
      const viewport = pdfPage.getViewport({ scale: 2 }); // Higher scale for better resolution

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await pdfPage.render({ canvasContext: context, viewport }).promise;

        const imageUrl = canvas.toDataURL("image/png"); // Convert canvas to PNG data URL
        images.push(imageUrl);
      }
    }

    setPageImages(images);
    setProcessing(false); // Re-enable interactions
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${fileNameWithoutExt}-page-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = async () => {
    const zip = new JSZip();

    pageImages.forEach((image, index) => {
      const base64Data = image.split(",")[1]; // Extract base64 part
      zip.file(`${fileNameWithoutExt}-page-${index + 1}.png`, base64Data, {
        base64: true,
      });
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileNameWithoutExt}-images.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setPageImages([]);
    setFileNameWithoutExt("");
  };

  return (
    <div className="flex flex-col items-center justify-between p-8 sm:p-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Convert PDF to PNG</h1>
      <p className="text-center text-gray-600 mb-6">
        Drag and drop your PDF or upload it to convert pages into PNG images.
      </p>
      {!pageImages.length ? (
        <UploadBox onUpload={handleFileUpload} processing={processing} />
      ) : (
        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {pageImages.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={image}
                  alt={`Page ${index + 1}`}
                  className="w-32 h-44 object-cover border border-gray-300 rounded-lg mb-2"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => downloadImage(image, index)}
                >
                  Download PNG
                </button>
              </div>
            ))}
          </div>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 mx-auto block mb-6"
            onClick={downloadAllImages}
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

export default PDFToPNG;
