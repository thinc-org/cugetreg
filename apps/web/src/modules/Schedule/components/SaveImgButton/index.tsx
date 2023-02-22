import React, { RefObject, useCallback } from 'react'

import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded'
import { Button } from '@mui/material'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { EXPORT_PNG_BUTTON } from '@web/common/context/Analytics/constants'

import { takeScreenshot } from './takeScreenshot'

interface SaveImgButtonProps {
  imageRef: RefObject<HTMLDivElement>
}

export const SaveImgButton: React.FC<SaveImgButtonProps> = ({ imageRef }) => {
  const saveImage = useCallback(async () => {
    window.scrollTo(0, 0)
    const image = await takeScreenshot(imageRef.current)
    const link = document.createElement('a')
    link.href = image
    link.download = 'schedule.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [imageRef])

  return (
    <Analytics elementName={EXPORT_PNG_BUTTON}>
      <Button variant="outlined" onClick={saveImage}>
        <GetAppRoundedIcon />
        PNG
      </Button>
    </Analytics>
  )
}
