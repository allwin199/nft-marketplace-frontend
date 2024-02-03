"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Header() {
    const pathname = usePathname();
    return (
        <header>
            <nav className="fixed w-full z-50 bg-[#13131a] border-b border-[#3b3b3b]">
                <div className="flex justify-end items-center p-4 px-10 text-sm">
                    <Link
                        href="/"
                        className={`px-4 py-2 transition hover:text-primary ${
                            pathname === "/" ? "text-white" : "text-zinc-400"
                        }`}
                    >
                        Marketplace
                    </Link>
                    <Link
                        href="/sellNft"
                        className={`px-4 py-2 transition hover:text-primary ${
                            pathname === "/sellNft"
                                ? "text-white"
                                : "text-zinc-400"
                        }`}
                    >
                        List My NFT
                    </Link>
                    <Link
                        href="/profile"
                        className={`pl-4 py-2 pr-8 transition hover:text-primary ${
                            pathname === "/profile"
                                ? "text-white"
                                : "text-zinc-400"
                        }`}
                    >
                        Profile
                    </Link>
                    <ConnectWallet
                        className="my-custom-button"
                        btnTitle="Connect"
                    />
                </div>
            </nav>
        </header>
    );
}
