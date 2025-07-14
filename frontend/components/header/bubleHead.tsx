import React from 'react'

function BubbleHead() {
  return (
      <div className="relative mt-6 mx-auto w-fit">
                       <div className="bg-white border-4 border-black rounded-3xl px-6 py-4 relative shadow-lg transform rotate-1">
                           <p className="text-lg font-bold text-black">CREATE YOUR POLL!</p>
                           <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-black"></div>
                           <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[18px] border-t-white"></div>
                       </div>
                   </div>
  )
}

export default BubbleHead