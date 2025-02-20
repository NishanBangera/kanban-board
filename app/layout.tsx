
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import KanbanProvider from "@/context/KanbanProvider";
import { getAllSections } from "@/lib/actions/section.action";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    default: process.env.NEXT_PUBLIC_APP_NAME!,
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL!),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getAllSections();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-screen antialiased`}>
        <Navbar />
        <KanbanProvider data={data}>{children}</KanbanProvider>
        <Toaster />
      </body>
    </html>
  );
}
