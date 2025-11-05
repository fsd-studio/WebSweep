import Layout from "components/layouts/Layout";
import { appWithTranslation } from "next-i18next";
import { Geist, Geist_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout fonts={`${geistSans.variable} ${geistMono.variable} ${fontPrimary.variable}`}>
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
        />
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);