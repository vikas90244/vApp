import React from 'react'
import { Button } from '@/components/ui/button'
import { Rocket, Vote, Users, Shield,Zap } from 'lucide-react'
import { CardContent, Card } from '@/components/ui/card'
import Link from 'next/link';
function page() {
  return (
    <div>

       {/* Hero Section */}
       <section className='relative z-10 py-20 px-6 '>
        <div className='max-w-6xl mx-auto text-center'>

          {/* Main Title  */}
          <div className='relative mb-8'>
          <h1 className="text-8xl md:text-9xl font-black text-black transform -rotate-2 relative z-10">WEB3</h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black text-yellow-400 transform rotate-1 -z-10">
              WEB3
            </div>
          </div>

          <div className='relative mb-8'>
          <h2 className="text-6xl md:text-7xl font-black text-black transform rotate-1 relative z-10">VOTING</h2>
            <div className="absolute inset-0 text-6xl md:text-7xl font-black text-purple-500 transform -rotate-1 -z-10">
              VOTING
            </div>
          </div>


          {/* Hero Speech Bubble */}
          <div className='relative mx-auto w-fit mb-12 -rotate-y-24'>
            <div className='bg-white border-4 border-black rounded-3xl px-8  py-5 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1'>
              <p className="text-2xl font-bold text-black max-w-2xl">
                  CREATE DECENTRALIZED POLLS ON SOLANA!
                  <br />
                  <span className="text-purple-600">TRANSPARENT • SECURE • UNSTOPPABLE</span>
                </p>
                <div className="absolute -bottom-6 left-12 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[30px] border-t-black"></div>
                <div className="absolute -bottom-5 left-12 w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-t-[28px] border-t-white"></div>
            </div>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-xl px-8 py-4 transform hover:scale-105">
              <Rocket className="w-6 h-6 mr-2" />
              <Link href="/create-poll">
              CREATE POLL NOW!
              </Link>
            </Button>

            <Button className="bg-white hover:bg-gray-50 border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-xl px-8 py-4">
              <Vote className="w-12 h-12 mr-2" />
             VOTE
            </Button>
          </div>
        </div>
       </section>


       {/* Feature Section  */}
       <section className="relative z-10 py-20 px-6 bg-white border-t-4 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-4 transform -rotate-1">BREAKOUT FEATURES</h2>
            <div className="relative inline-block">
              <div className="bg-yellow-400 border-4 border-black rounded-2xl px-6 py-3 transform rotate-1">
                <p className="font-bold text-black text-lg">BUILT FOR THE FUTURE OF VOTING</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform bg-purple-100">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-500 border-4 border-black rounded-full flex items-center justify-center mb-4 transform rotate-12">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black mb-3">SECURE</h3>
                <p className="text-lg font-bold text-gray-800">
                  Powered by Solana blockchain. Your votes are immutable and transparent!
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform bg-yellow-100">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-yellow-500 border-4 border-black rounded-full flex items-center justify-center mb-4 transform -rotate-12">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-black text-black mb-3">FAST</h3>
                <p className="text-lg font-bold text-gray-800">
                  Lightning-fast transactions. Create polls and vote in seconds, not minutes!
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform bg-green-100">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-500 border-4 border-black rounded-full flex items-center justify-center mb-4 transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black mb-3 ">SOCIAL</h3>
                <p className="text-lg font-bold text-gray-800">
                  Engage your community! Create polls that matter and see real-time results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/*  How It Works  */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-4 transform rotate-1">HOW IT WORKS</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-black rounded-full flex items-center justify-center mx-auto transform -rotate-12">
                  <span className="text-3xl font-black text-white">1</span>
                </div>
                <div className="absolute -top-8 -right-4">
                  <div className="bg-white border-4 border-black rounded-xl px-3 py-1 transform rotate-12">
                    <span className="font-black text-sm">START!</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-black mb-3">CREATE POLL</h3>
              <div className="text-lg font-bold text-gray-700 ">
               <Card className='ml-12 border-4 border-black rounded-xl w-60 h-36  shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:scale-105 transition-transform bg-rose-100'>
                <CardContent>
                Set up your poll with title, description, and up to 5 candidates!
                </CardContent>
               </Card>
               
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 border-4 border-black rounded-full flex items-center justify-center mx-auto transform rotate-12">
                  <span className="text-3xl font-black text-white">2</span>
                </div>
                <div className="absolute -top-8 -left-4">
                  <div className="bg-white border-4 border-black rounded-xl px-3 py-1 transform -rotate-12">
                    <span className="font-black text-sm">DEPLOY!</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-black mb-3">DEPLOY</h3>
              <div className="text-lg font-bold text-gray-700">
              <Card className='ml-12 border-4 border-black rounded-xl w-60 h-36 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:scale-105 transition-transform bg-gray-100'>
                <CardContent>
                Deploy your poll to Solana blockchain with one click!
                </CardContent>
               </Card>
                </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-red-500 border-4 border-black rounded-full flex items-center justify-center mx-auto transform -rotate-12">
                  <span className="text-3xl font-black text-white">3</span>
                </div>
                <div className="absolute -top-8 -right-4">
                  <div className="bg-white border-4 border-black rounded-xl px-3 py-1 transform rotate-12">
                    <span className="font-black text-sm">VOTE!</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-black mb-3">SHARE & VOTE</h3>
              <div className="text-lg font-bold text-gray-700">
              <Card className='ml-12 border-4 border-black rounded-xl w-60 h-36 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:scale-105 transition-transform bg-orange-100'>
                <CardContent>
                   Share with your community and watch the votes roll in!
                </CardContent>
               </Card>
                
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t-4 border-black p-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-black rounded-full flex items-center justify-center transform -rotate-12">
              <Vote className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-black text-black">SOLANA POLLS</span>
          </div>
          <p className="font-bold text-gray-600">Built with ❤️ using Anchor Framework on Solana</p>
        </div>
      </footer>
    </div>
  );
}

export default page