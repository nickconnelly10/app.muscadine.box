import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the farcaster.json file from public directory
    const filePath = path.join(process.cwd(), "public", ".well-known", "farcaster.json");
    const farcasterManifest = fs.readFileSync(filePath, "utf8");
    const manifest = JSON.parse(farcasterManifest);
    
    return NextResponse.json(manifest, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error serving farcaster.json:", error);
    return new NextResponse("Farcaster manifest not found", { status: 404 });
  }
}
