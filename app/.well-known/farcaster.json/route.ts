import { NextResponse } from "next/server";
import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  // Return the Farcaster manifest configuration
  return NextResponse.json({
    accountAssociation: minikitConfig.accountAssociation,
    miniapp: minikitConfig.frame,
    baseBuilder: minikitConfig.baseBuilder,
  }, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}