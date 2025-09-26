const ROOT_URL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || "https://app.muscadine.box";

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  frame: {
    version: "1",
    name: "app-muscadine.box",
    subtitle: "DeFi Lending Platform",
    description: "Earn interest on your crypto with Morpho vaults on Base",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["defi", "lending", "morpho", "base"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Lend and earn with confidence",
    ogTitle: "Muscadine Box - DeFi Lending Platform",
    ogDescription: "Earn interest on your crypto with Morpho vaults on Base network",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
  baseBuilder: {
    allowedAddresses: ["0x5332b9458D975Cd155C67EdC54C1AD0262336f3f"]
  },
} as const;
