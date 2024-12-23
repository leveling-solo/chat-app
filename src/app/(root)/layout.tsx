import type { Metadata } from "next";
import "../globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/navbar";
import BottomBar from "@/components/BottomBar";
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
      <body className={`bg-blue-2`}>
        <Providers>
          <Navbar />
          {children}
          <BottomBar />
        </Providers>
      </body>
    </html>
  );
}
