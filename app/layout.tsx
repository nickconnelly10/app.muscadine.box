import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "@/minikit.config";
import { RootProvider } from "./rootProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.frame.name,
    description: minikitConfig.frame.description,
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.frame.version,
        imageUrl: minikitConfig.frame.heroImageUrl,
        button: {
          title: `Launch ${minikitConfig.frame.name}`,
          action: {
            name: `Launch ${minikitConfig.frame.name}`,
            type: "launch_frame",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootProvider>
      <html lang="en" style={{ colorScheme: 'light' }}>
        <head>
          <meta name="color-scheme" content="light" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        </head>
        <body className={`${inter.variable} ${sourceCodePro.variable}`}>
          <ErrorBoundary>
            <SafeArea>{children}</SafeArea>
          </ErrorBoundary>
        </body>
      </html>
    </RootProvider>
  );
}
