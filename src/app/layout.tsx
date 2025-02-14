import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "소리얼 예약 페이지",
  description: "소리얼 예약방 대신에 만들었습니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
