import { Box, Paper, Card, Typography, Link, useTheme } from '@material-ui/core'
import React from 'react'

import { StyledArticleBody } from '@/pages/about/styled'
import { sessionIdStore } from '@/store/sessionIdStore'

export default function About() {
  const theme = useTheme()

  const sessionId = sessionIdStore.sessionId
  const reportProblemLink = `https://airtable.com/shruwAAfn1763TgMU?prefill_Session_ID=${sessionId}`

  return (
    <Box marginTop={4} marginBottom={4}>
      <Box sx={{ p: 4, maxWidth: '960px' }}>
        <Typography variant="h1">เกี่ยวกับเรา</Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          ชมรม Thinc. จุฬาลงกรณ์มหาวิทยาลัย
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          ชมรม Thinc. เป็นชมรมที่จัดตั้งและดำเนินการโดยนิสิต โดยสังกัดกรรมการนิสิตคณะวิศวกรรมศาสตร์ (กวศ.)
          มีวัตถุประสงค์เพื่อฝึกฝนและฟูมฟักผู้มีความสนใจในการออกแบบและพัฒนาซอฟต์แวร์
          ผ่านการทำโปรเจคพัฒนาซอฟต์แวร์เพื่อสังคมจุฬาฯ
        </StyledArticleBody>
        <StyledArticleBody variant="body1">
          ผลงานที่ผ่านมาของชมรม Thinc. เช่น
          <ul>
            <li>แอปพลิเคชัน CU Pop Bus</li>
            <li>ระบบจองสนามกีฬา CU Sport Complex (เปิดใช้งานเร็ว ๆ นี้)</li>
            <li>ระบบลงทะเบียนขึ้นสแตนด์แปรอักษรฝั่งจุฬาฯ งานฟุตบอลประเพณีจุฬาฯ-ธรรมศาสตร์ ครั้งที่ 74</li>
            <li>Companion App ในงาน JavaScript Bangkok 1.0.0</li>
          </ul>
        </StyledArticleBody>
        <StyledArticleBody variant="body1" paragraph>
          สามารถติดตามชมรม Thinc. ได้ทาง{' '}
          <Link
            href="https://www.facebook.com/ThailandIncubator"
            target="_blank"
            rel="noreferrer"
            color={theme.palette.secondaryRange[900]}
          >
            Facebook Page: Thinc.
          </Link>
        </StyledArticleBody>

        <Typography variant="h4" component="h2" gutterBottom>
          เกี่ยวกับ CU Get Reg
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom>
          ที่มาของโปรเจค
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          CU Get Reg เกิดมาจาก Pain Point ในการลงทะเบียนเรียนของนิสิตจุฬาฯ ที่มักจะต้องลงทะเบียนทั้งวิชาบังคับ วิชาเลือก
          และวิชาศึกษาทั่วไป (GenEd) ในแต่ละเทอม แต่จำเป็นต้องหาข้อมูลจากหลาย ๆ แหล่งที่แตกต่างกัน
          ทั้งยังไม่มีแหล่งใดที่นำเสนอตารางเรียนออกมาเป็นภาพให้เข้าใจง่ายตั้งแต่ก่อนลงทะเบียน
        </StyledArticleBody>
        <StyledArticleBody variant="body1" paragraph>
          ด้วยเหตุนี้ ทางทีมงานจึงได้พัฒนา CU Get Reg ขึ้น เพื่อให้สามารถค้นหาและเลือกรายวิชาได้อย่างสะดวก
          และจัดตารางเรียนตามข้อจำกัดของหลักสูตรของแต่ละคนได้ง่ายขึ้น
        </StyledArticleBody>
        <StyledArticleBody variant="body1" paragraph>
          ทางทีมงานมีความมุ่งมั่นที่จะทำให้ CU Get Reg เป็นเว็บไซต์ศูนย์กลางที่รวบรวมข้อมูลรายวิชาไว้ได้อย่างครบถ้วน
          และมุ่งที่จะสร้างเว็บไวต์นี้ให้เป็นพื้นที่สำหรับการแบ่งปันข้อมูลรายวิชาระหว่างนิสิตในอนาคต
        </StyledArticleBody>

        <Card variant="outlined" sx={{ marginBottom: 3, padding: 2 }}>
          <StyledArticleBody variant="body1">
            ทั้งนี้ CU Get Reg เป็นเพียงเครื่องมือที่ช่วยให้การวางแผนลงทะเบียนเรียนง่ายขึ้น{' '}
            <strong>
              แต่ไม่ใช่การลงทะเบียนเรียนจริง คุณสามารถลงทะเบียนเรียนได้ที่{' '}
              <Link
                href="https://www2.reg.chula.ac.th/"
                target="_blank"
                rel="noreferrer"
                color={theme.palette.secondaryRange[900]}
              >
                https://www2.reg.chula.ac.th/
              </Link>{' '}
              เพียงช่องทางเดียวเท่านั้น
            </strong>
          </StyledArticleBody>
        </Card>

        <Typography variant="h6" component="h3" gutterBottom>
          CU Get Reg นำข้อมูลมาจากไหน?
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          ข้อมูลรายวิชาของ CU Get Reg นำมาจากหน้า{' '}
          <Link
            href="https://cas.reg.chula.ac.th/cu/cs/QueryCourseScheduleNew/index.html"
            target="_blank"
            rel="noreferrer"
            color={theme.palette.secondaryRange[900]}
          >
            สอบถามตารางสอนตารางสอบ
          </Link>{' '}
          ของสำนักงานการทะเบียนทั้งหมด ในปัจจุบัน ข้อมูลจากหน้านี้อาจล่าช้าจากข้อมูลภายในระบบ Reg Chula ไป 1 วัน ทั้งนี้
          ทีมงานกำลังประสานงานกับสำนักงานการทะเบียนเพื่อเข้าถึงข้อมูลรายวิชาโดยตรง เพื่อให้ไม่พบปัญหาดังกล่าว
        </StyledArticleBody>

        <Typography variant="h6" component="h3" gutterBottom>
          การเข้าสู่ระบบ มีประโยชน์อย่างไรบ้าง?
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          เมื่อคุณเข้าสู่ระบบ ระบบจะบันทึกข้อมูลตารางเรียนไว้ในบัญชี Google ของคุณ
          ทำให้สามารถเข้าสู่ระบบเพื่อดูข้อมูลตารางเรียนที่เลือกไว้ข้ามอุปกรณ์ได้ ทั้งนี้ ในอนาคตอาจมีฟีเจอร์อื่น ๆ
          ที่เกี่ยวข้องกับการเข้าสู่ระบบเพิ่มขึ้น
        </StyledArticleBody>
        <StyledArticleBody variant="body1" paragraph>
          ในการเข้าสู่ระบบ สามารถใช้บัญชีอีเมลนิสิต (รหัสนิสิต@student.chula.ac.th) เท่านั้น
          เพื่อให้สามารถยืนยันตัวตนได้ว่าเป็นนิสิตจุฬาฯ
        </StyledArticleBody>
        <StyledArticleBody variant="body1" paragraph>
          หากต้องการทราบว่าเราเก็บข้อมูลใดและนำไปใช้อย่างไรบ้าง สามารถอ่านเพิ่มเติมได้ที่{' '}
          <Link href="/privacy" target="_blank" rel="noreferrer" color={theme.palette.secondaryRange[900]}>
            Privacy Policy
          </Link>{' '}
          ของเรา
        </StyledArticleBody>

        <Typography variant="h6" component="h3" gutterBottom>
          ความร่วมมือกับหน่วยงานอื่น ๆ
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          CU Get Reg มีความร่วมมือกับหน่วยงานอื่นภายในจุฬาฯ ได้แก่
          <ul>
            <li>
              <strong>สำนักงานการทะเบียน (Reg Chula):</strong> CU Get Reg
              ได้รับการสนับสนุนเซิร์ฟเวอร์จากสำนักงานการทะเบียน นอกจากนี้
              ทางสำนักงานการทะเบียนยังพร้อมให้ความสนับสนุนในด้านข้อมูลรายวิชา ซึ่งกำลังอยู่ในระหว่างดำเนินการ{' '}
              <Link
                href="https://www.reg.chula.ac.th/"
                target="_blank"
                rel="noreferrer"
                color={theme.palette.secondaryRange[900]}
              >
                (เว็บไซต์ สำนักงานการทะเบียน)
              </Link>
            </li>
            <li>
              <strong>Gen อย่าได้ Ed:</strong> ปัจจุบันร่วมมือกับ CU Get Reg ในการประชาสัมพันธ์เว็บไซต์ให้กับนิสิตจุฬาฯ{' '}
              <Link
                href="https://www.facebook.com/genedahs"
                target="_blank"
                rel="noreferrer"
                color={theme.palette.secondaryRange[900]}
              >
                (Facebook Page: Gen อย่าได้ Ed)
              </Link>
            </li>
            <li>
              <strong>ศูนย์การศึกษาทั่วไป (GenEd Chula):</strong> CU Get Reg
              ได้รับการสนับสนุนจากศูนย์การศึกษาทั่วไปในด้านข้อมูลรายวิชาศึกษาทั่วไป (GenEd){' '}
              <Link
                href="https://www.gened.chula.ac.th/c/"
                target="_blank"
                rel="noreferrer"
                color={theme.palette.secondaryRange[900]}
              >
                (เว็บไซต์ ศูนย์การศึกษาทั่วไป)
              </Link>
            </li>
          </ul>
        </StyledArticleBody>

        <Typography variant="h4" component="h2" gutterBottom>
          ติดต่อทีมงาน
        </Typography>
        <StyledArticleBody variant="body1" paragraph>
          สามารถแจ้งปัญหาขัดข้องเกี่ยวกับการใช้งานเว็บไซต์ ข้อมูลที่ไม่ถูกต้อง หรือข้อเสนอแนะต่าง ๆ ได้ทาง{' '}
          <Link href={reportProblemLink} target="_blank" rel="noreferrer" color={theme.palette.secondaryRange[900]}>
            ฟอร์มแจ้งปัญหา
          </Link>{' '}
          ที่มุมบนขวาของหน้าเว็บ
        </StyledArticleBody>
        <StyledArticleBody variant="body1" paragraph>
          หากต้องการติดต่อสอบถามเกี่ยวกับเว็บไซต์ CU Get Reg หรือติดต่อชมรม Thinc. สามารถสอบถามทาง{' '}
          <Link
            href="https://www.facebook.com/ThailandIncubator"
            target="_blank"
            rel="noreferrer"
            color={theme.palette.secondaryRange[900]}
          >
            Facebook Page: Thinc.
          </Link>{' '}
          ได้โดยตรง
        </StyledArticleBody>
      </Box>
    </Box>
  )
}
