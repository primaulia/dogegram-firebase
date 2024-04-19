"use client";

import { work } from "@/app/ui/fonts";
import "@/app/ui/globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import SideBar from "@/app/components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${work.className} antialiased`}>
        <AuthContextProvider>
          <main className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
              <SideBar />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:px-1 md:py-12">
              {children}
            </div>
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
