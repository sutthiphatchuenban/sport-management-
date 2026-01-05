import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoTh = Noto_Sans_Thai({
  variable: "--font-noto-th",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "IT Sport 2024 | ระบบจัดการกีฬาสีและโหวตนักกีฬา",
  description: "ระบบบริหารจัดการแข่งขันกีฬาสีคณะวิทยาการสารสนเทศ พร้อมระบบโหวตนักกีฬายอดเยี่ยมแบบ Real-time",
};

import { ConditionalLayout } from "@/components/layout/conditional-layout"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoTh.variable} font-noto antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
