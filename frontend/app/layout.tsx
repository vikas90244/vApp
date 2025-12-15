import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Keep this for Inter font
import QueryProvider from '@/contexts/QueryProvider'
import "./globals.css";
import { SolanaWalletProvider } from "@/contexts/Wallet-Provider";
import Header from "@/components/header/Header";
import RetryProvider from "@/contexts/retryProvider";


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})



export const metadata: Metadata = {
  title: "Decentralized Decisions ",
  description: "decentralized Desicions ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply the Geist font variables
    <html lang="en" className={`${inter.variable}`}>
    <body className='min-h-screen bg-gray-50  z-10'>
      {/* Background with pulsive triangle and bounce squares - hidden on small screens to reduce clutter */}
    <div className='hidden sm:block fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-20 left-10 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent  border-b-[35px] border-b-yellow-400 rotate-12 animate-pulse'></div>
        <div className="absolute top-40 right-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-purple-500 -rotate-45"></div>
        <div className='absolute bottom-32 left-32 w-8 h-8 bg-blue-500 rotate-45 animate-bounce'></div>
        <div className="absolute bottom-60 right-16 w-6 h-6 bg-green-500 rotate-12"></div>
        <div className="absolute top-1/2 left-20 w-4 h-4 bg-red-500 rotate-45"></div>
        <div className="absolute bottom-[250px] right-[730px] w-16 h-16 bg-red-500 rounded-full animate-bounce  transform"></div>
        <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-orange-500 -rotate-12"></div>

      {/* skewed  lines  */}
      <div className='absolute top-0 left-0 w-full h-full opacity-10'>
      <div className="absolute top-1/4 left-0 w-full h-1 bg-black transform -skew-y-12"></div>
      <div className="absolute top-1/2 left-0 w-full h-1 bg-black transform -skew-y-12"></div>
      <div className="absolute top-3/4 left-0 w-full h-1 bg-black transform -skew-y-12"></div>
  </div>
      </div>
      <SolanaWalletProvider>
          <Header />
          <main className="relative z-20">
            <QueryProvider>
              <RetryProvider>
              {children}
              </RetryProvider>
            </QueryProvider>
            </main>
          </SolanaWalletProvider>
      </body>
    </html>
  );
}