import { AnnouncementItem } from '@web/common/components/TopBar/components/AnnouncementBar/types'

// TODO Admin should be able to change the annoucement

export function getAnnouncement1(): AnnouncementItem {
  return {
    id: 'annoucement_1',
    label: 'CU Get Reg เป็นเว็บไซต์ที่จัดทำโดยนิสิต ซึ่งได้รับการสนับสนุนเซิฟเวอร์จาก Reg Chula',
    severity: 'info',
  }
}

export function getNotRegChulaWarning(): AnnouncementItem {
  return {
    id: 'not_reg_chula',
    label:
      'CU Get Reg เป็นเพียงเครื่องมือที่ช่วยให้การวางแผนลงทะเบียนเรียนง่ายขึ้น แต่ไม่ใช่การลงทะเบียนเรียนจริง คุณสามารถลงทะเบียนเรียนได้ที่ https://www2.reg.chula.ac.th/ เพียงช่องทางเดียวเท่านั้น',
    severity: 'warning',
  }
}

export function term67Issue(): AnnouncementItem {
  return {
    id: 'term_67_issue',
    label:
      'ข้อมูลของปีการศึกษา 2567 จะยังมีไม่ครบ เนื่องจากปัญหาของการเชื่อมต่อระหว่าง CU Get Reg กับเว็บไซต์ของทะเบียนจุฬาฯ ขออภัยในความไม่สะดวก',
    severity: 'error',
  }
}
