"Server Component";

import "./globals.css";
import { Open_Sans } from "next/font/google";
import { cn } from "@/utils/cn";
import NextTopLoader from "nextjs-toploader";

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-mono'
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`antialiased`}
    >
      <body className={cn(
        "min-h-screen bg-background antialeased",
        openSans.className
      )
      } >
        <NextTopLoader
          color="#1976D2"
          height={3}
          speed={200}
          crawlSpeed={200}
          showSpinner={false}
          easing="ease-out"
          shadow="0 0 8px rgba(25, 118, 210, 0.45)"
          zIndex={110}
        />
        {children}
      </body>
    </html>
  );
}
