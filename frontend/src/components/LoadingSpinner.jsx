import React from 'react'

function LoadingSpinner() {
  return (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin border-t-4 border-gray-500 border-solid w-12 h-12 rounded-full"></div>
        </div>
      
  )
}

export default LoadingSpinner