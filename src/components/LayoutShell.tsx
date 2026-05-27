"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { SessionProvider } from "next-auth/react";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/auth");

  if (isAdmin || isAuth) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <a href="#main-content" className="skip-link">
        본문으로 바로가기
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
