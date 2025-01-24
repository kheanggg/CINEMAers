"use client";

import "@/app/globals.css";
import Footer from "../components/homepage/slider/footer/Footer";
import Head from "next/head";
import Header from "../components/layout/Header";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
