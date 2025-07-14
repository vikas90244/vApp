import React from 'react'

function IsSubmit() {
  return (
    <div className="relative mt-4">
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
            <div className="w-2 h-8 bg-yellow-400 transform rotate-12 animate-pulse"></div>
            <div className="w-2 h-6 bg-orange-500 transform -rotate-12 animate-pulse"></div>
            <div className="w-2 h-10 bg-yellow-400 transform rotate-45 animate-pulse"></div>
        </div>
    </div>
</div>
  )
}

export default IsSubmit