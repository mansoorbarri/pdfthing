import { GenerateImage } from "@/app/utils/og-generator";

export const runtime = "edge";
export const alt = "SVG ➡️ PNG - QuickPic";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  try {
    const image = await GenerateImage({
      title: "SVG ➡️ PNG",
      description: "The only simple SVG converter.",
    });

    // If GenerateImage returns an ImageResponse, convert it to a Blob
    const imageBlob = await image.blob(); // Convert to Blob for Response body

    return new Response(imageBlob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour, adjust as needed
      },
    });
  } catch (error) {
    return new Response("Error generating image", { status: 500 });
  }
}
