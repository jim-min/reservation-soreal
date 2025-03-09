import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "소리얼 예약 페이지",
  description: "소리얼 예약방 대신에 만들었습니다",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  colorScheme: "only light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
