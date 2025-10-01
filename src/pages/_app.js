import Layout from "components/layouts/Layout";
import { appWithTranslation } from "next-i18next";
import { Geist, Geist_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import "./globals.css";

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

function MyApp({ Component, pageProps }) {
  return (
    <Layout fonts={`${geistSans.variable} ${geistMono.variable} ${fontPrimary.variable}`}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default appWithTranslation(MyApp);