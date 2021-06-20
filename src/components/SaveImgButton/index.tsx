import { Button } from '@material-ui/core'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'
import React, { MutableRefObject, useEffect } from 'react'
import { useScreenshot, createFileName } from 'use-react-screenshot'

const SaveImgButton: React.FC<{ imageRef: MutableRefObject<null> }> = ({ imageRef }) => {
  const [image, takeScreenshot] = useScreenshot()

  const download = (image: string, { name = 'Schedule', extension = 'png' } = {}) => {
    const a = document.createElement('a')
    a.href = image
    a.download = createFileName(extension, name)
    a.click()
  }

  const saveImage = () => takeScreenshot(imageRef.current)

  useEffect(() => {
    if (image) {
      download(image, { name: 'Schedule', extension: 'png' })
    }
  }, [image])

  return (
    <Button variant="outlined" onClick={saveImage}>
      <GetAppRoundedIcon />
      PNG
    </Button>
  )
}

export default SaveImgButton
