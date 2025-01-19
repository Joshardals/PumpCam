import type { Metadata } from "next";
import { inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pumpcam",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
