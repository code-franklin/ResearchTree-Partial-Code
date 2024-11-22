import React from 'react'
import Description from './Descriptions'
import PdfViewers from './PdfViewer'
import Grading from './Grading'
function MyManuscriptComponent() {
  
  return (
    <div className="h-[1400px]">

      <div>
      </div>

    <div className=" absolute">
      <Grading  />
    
    </div>

    <div className=" absolute mt-[-1440px] ml-[1420px]">
    </div>
      <Description  />
    </div>
  
  )
}

export default MyManuscriptComponent