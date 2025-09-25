import { NextResponse } from "next/server";
import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  // Return the Farcaster manifest configuration following Base demos pattern
  return NextResponse.json({
    accountAssociation: minikitConfig.accountAssociation,
    frame: {
      version: minikitConfig.frame.version,
      name: minikitConfig.frame.name,
      subtitle: minikitConfig.frame.subtitle,
      description: minikitConfig.frame.description,
      iconUrl: minikitConfig.frame.iconUrl,
      homeUrl: minikitConfig.frame.homeUrl,
      imageUrl: minikitConfig.frame.heroImageUrl,
      buttonTitle: `Launch ${minikitConfig.frame.name}`,
      splashImageUrl: minikitConfig.frame.splashImageUrl,
      splashBackgroundColor: minikitConfig.frame.splashBackgroundColor,
      webhookUrl: minikitConfig.frame.webhookUrl,
      primaryCategory: minikitConfig.frame.primaryCategory,
      tags: minikitConfig.frame.tags,
      tagline: minikitConfig.frame.tagline,
      ogTitle: minikitConfig.frame.ogTitle,
      ogDescription: minikitConfig.frame.ogDescription,
      ogImageUrl: minikitConfig.frame.ogImageUrl,
    },
    baseBuilder: minikitConfig.baseBuilder,
  }, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
