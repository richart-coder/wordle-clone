"use client";

import { ToastContainer } from "react-toastify";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer
          position="top-center"
          autoClose={500}
          hideProgressBar={true}
        />
      </body>
    </html>
  );
}
