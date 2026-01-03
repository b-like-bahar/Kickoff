import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutClientSide } from "@/app/layout-client-side";
import { appConstants, layoutMetadata } from "@/utils/seo-utils";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...layoutMetadata,
  publisher: appConstants.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(appConstants.appUrl),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LayoutClientSide />
          {children}
        </Providers>
      </body>
    </html>
  );
}
