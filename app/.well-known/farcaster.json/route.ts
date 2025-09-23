import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  const config = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    frame: {
      version: "1",
      name: minikitConfig.frame.name,
      iconUrl: minikitConfig.frame.iconUrl,
      homeUrl: minikitConfig.frame.homeUrl,
      imageUrl: minikitConfig.frame.heroImageUrl,
      splashImageUrl: minikitConfig.frame.splashImageUrl,
      splashBackgroundColor: minikitConfig.frame.splashBackgroundColor,
      description: minikitConfig.frame.description,
      ogTitle: minikitConfig.frame.ogTitle,
      ogDescription: minikitConfig.frame.ogDescription,
      ogImageUrl: minikitConfig.frame.ogImageUrl,
      requiredCapabilities: [
        "actions.ready",
        "actions.signIn", 
        "actions.openMiniApp",
        "actions.openUrl",
        "actions.sendToken",
        "actions.viewToken", 
        "actions.composeCast",
        "actions.viewProfile",
        "actions.setPrimaryButton",
        "actions.swapToken",
        "actions.close",
        "actions.viewCast",
        "wallet.getEthereumProvider"
      ],
      requiredChains: [
        "eip155:8453",
        "eip155:10"
      ],
      canonicalDomain: "app.muscadine.box",
      noindex: false,
      tags: minikitConfig.frame.tags
    },
    baseBuilder: {
      allowedAddresses: minikitConfig.baseBuilder.allowedAddresses,
    }
  };

  return Response.json(config);
}
