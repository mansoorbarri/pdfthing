import PdfCompressor from "./compress-pdf";

export const metadata = {
  title: "Split PDF - pdfthing",
  description: "Split PDF pages quickly.",
};

export default function SVGToolPage() {
  return <PdfCompressor />;
}