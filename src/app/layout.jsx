import { Geist, Geist_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import { DataCollectionProvider } from "context/DataCollectionContext";
import Layout from "components/layouts/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontPrimary = LocalFont({
  src: "../fonts/DO.otf",
  variable: "--font-primary",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fontPrimary.variable}`}>
        <DataCollectionProvider>
            <Layout>
                <Toaster position="top-right" richColors closeButton expand={false} />
                {children}
            </Layout>
        </DataCollectionProvider>
      </body>
    </html>
  );
}
