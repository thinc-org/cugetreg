import { Analytics } from '@/context/analytics/components/Analytics'
import { EXPORT_PNG_BUTTON } from '@/context/analytics/components/const'
import { Button } from '@material-ui/core'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'
import React, { RefObject, useCallback } from 'react'
import { useScreenshot } from 'use-react-screenshot'

interface SaveImgButtonProps {
  imageRef: RefObject<HTMLDivElement>
}

const SaveImgButton: React.FC<SaveImgButtonProps> = ({ imageRef }) => {
  const [, takeScreenshot] = useScreenshot()

  const saveImage = useCallback(async () => {
    window.scrollTo(0, 0)
    const image = await takeScreenshot(imageRef.current)
    const link = document.createElement('a')
    link.href = image
    link.download = 'schedule.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [takeScreenshot, imageRef])

  return (
    <Analytics elementName={EXPORT_PNG_BUTTON}>
      <Button variant="outlined" onClick={saveImage}>
        <GetAppRoundedIcon />
        PNG
      </Button>
    </Analytics>
  )
}

export default SaveImgButton
