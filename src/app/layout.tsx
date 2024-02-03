"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThirdwebProvider
                    activeChain="mumbai"
                    clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
                >
                    <Header />
                    {children}
                </ThirdwebProvider>
            </body>
        </html>
    );
}
