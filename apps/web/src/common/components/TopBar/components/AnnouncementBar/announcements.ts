import { AnnouncementItem } from '@web/common/components/TopBar/components/AnnouncementBar/types'

// TODO Admin should be able to change the annoucement

export function getNotRegChulaWarning(): AnnouncementItem {
  return {
    id: 'not_reg_chula',
    label:
      'CU Get Reg เป็นเว็บไซต์ที่จัดทำโดยนิสิต ซึ่งได้รับการสนับสนุนเซิฟเวอร์จาก Reg Chula โดยเป็นเพียงเครื่องมือที่ช่วยให้การวางแผนลงทะเบียนเรียนง่ายขึ้น แต่ไม่ใช่การลงทะเบียนเรียนจริง คุณสามารถลงทะเบียนเรียนได้ที่ https://www2.reg.chula.ac.th/ เพียงช่องทางเดียวเท่านั้น',
    severity: 'warning',
  }
}
