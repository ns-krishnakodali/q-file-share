import "./globals.css";

import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QFileShare",
  description: "Developed using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
