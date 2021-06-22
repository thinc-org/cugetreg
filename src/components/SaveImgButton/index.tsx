import { Button } from '@material-ui/core'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'
import React, { RefObject, useCallback, useEffect } from 'react'
import { useScreenshot } from 'use-react-screenshot'

const SaveImgButton: React.FC<{ imageRef: RefObject<HTMLDivElement> }> = ({ imageRef }) => {
  const [image, takeScreenshot] = useScreenshot()

  const saveImage = useCallback(async () => {
    if (!image) await takeScreenshot(imageRef.current)
    const link = document.createElement('a')
    link.href = image
    link.download = 'schedule.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [image, takeScreenshot, imageRef])

  useEffect(() => {
    takeScreenshot(imageRef.current)
  }, [imageRef.current])

  return (
    <Button variant="outlined" onClick={saveImage}>
      <GetAppRoundedIcon />
      PNG
    </Button>
  )
}

export default SaveImgButton
