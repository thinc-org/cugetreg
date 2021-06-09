import { Button } from '@material-ui/core'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'
import React, { MutableRefObject, useCallback } from 'react'
import { useScreenshot } from 'use-react-screenshot'

const SaveImgButton: React.FC<{ imageRef: MutableRefObject<null> }> = ({ imageRef }) => {
  const [image, takeScreenshot] = useScreenshot()

  const saveImage = useCallback(() => {
    takeScreenshot(imageRef.current)
    const link = document.createElement('a')
    link.href = image
    link.download = 'schedule.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [image, takeScreenshot, imageRef])

  return (
    <Button variant="outlined" onClick={saveImage}>
      <GetAppRoundedIcon />
      PNG
    </Button>
  )
}

export default SaveImgButton
