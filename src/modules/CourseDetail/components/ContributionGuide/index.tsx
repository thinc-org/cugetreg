import styled from '@emotion/styled'
import { Alert, Collapse, IconButton, Typography, useTheme } from '@mui/material'
import Link from 'next/link'

import { useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const StyledOL = styled.ol`
  li {
    padding: ${({ theme }) => theme.spacing(1, 1)};
  }
`

export const ContributionGuide = () => {
  const theme = useTheme()
  const [openCollapse, setOpenCollapse] = useState(false)
  return (
    <Alert
      severity="info"
      icon={false}
      sx={{ mb: 2, px: 2 }}
      action={
        <IconButton size="small" onClick={() => setOpenCollapse((prev) => !prev)}>
          {!openCollapse ? (
            <MdKeyboardArrowDown color={theme.palette.primaryRange[500]} />
          ) : (
            <MdKeyboardArrowUp color={theme.palette.primaryRange[500]} />
          )}
        </IconButton>
      }
    >
      <Typography variant="h6" ml={1}>
        แนวทางในการเขียนรีวิว
      </Typography>
      <Collapse in={openCollapse}>
        <StyledOL>
          <Typography variant="body2" component="li">
            สามารถเล่าประสบการณ์การเรียนในรายวิชาได้ในทุกด้าน เช่น การลงทะเบียน การเรียน การสอบ สิ่งที่อยากจะแนะนำคนอื่น
            เป็นต้น
          </Typography>
          <Typography variant="body2" component="li">
            เมื่อรีวิวผ่านการอนุมัติโดยทีมงาน จะปรากฎให้ผู้อื่นเห็นโดยทันที
          </Typography>
          <Typography variant="body2" component="li">
            ผู้เขียนรีวืวจำเป็นต้องเข้าสู่ระบบด้วยอีเมลนิสิตเพื่อยืนยันความเป็นนิสิตก่อนการรีวิว
            สามารถดูนโยบายรักษาความเป็นส่วนตัวได้ที่ <Link href="/privacy">Privacy Policy</Link> ทั้งนี้
            การรีวิวจะเป็นแบบไม่เปิดเผยตัวตนสู่สาธารณะ
          </Typography>
          <Typography variant="body2" component="li">
            รีวิวที่มีการพูดโจมตีบุคคลอื่น ๆ ด้วยคำพูดหยาบคาย หรือรีวิวที่ทีมงานตัดสินว่ามีลักษณะเป็นสแปม
            จะไม่ได้รับการอนุมัติ ขอให้แก้ไขเนื้อหาอีกครั้ง
          </Typography>
        </StyledOL>
      </Collapse>
    </Alert>
  )
}
