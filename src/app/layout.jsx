import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontPrimary = localFont({
  src: "./fonts/DO.otf", 
  variable: "--font-primary",
  display: "swap",
});

const fontPrimaryLight = localFont({
  src: "./fonts/DOl.otf", 
  variable: "--font-primary-light",
  display: "swap",
});


export const metadata = {
  title: "fsd template", 
  description: "component & template library",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontPrimary.variable} ${fontPrimaryLight.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
