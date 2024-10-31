import React from 'react'
import Description from './Descriptions'
import PdfViewers from './PdfViewer'
import Progresss from './Progress'
import Grading from './Grading'
function MyManuscriptComponent() {
  
  return (
    <div className="h-[1400px]">

      <div>
      </div>

    <div className=" absolute">
      <Grading  />
    </div>

   
    <Description  />


    </div>
  
  )
}

export default MyManuscriptComponent