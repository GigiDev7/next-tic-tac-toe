"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider, useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { usePathname, redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authCtx = useAuthContext();

  const path = usePathname();

  useEffect(() => {
    if (!authCtx.email && path !== "/login") {
      return redirect("/login");
    }
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
