import type { Metadata } from "next";
import "../globals.css";
import ToasterContext from "@/components/ToasterContext";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Chat App",
  description: "Created By TricolordeviL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-purple-1`}>
        <Providers>
          <ToasterContext />
          {children}
        </Providers>
      </body>
    </html>
  );
}
