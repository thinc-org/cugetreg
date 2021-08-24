import { AnnoucementItem } from '@/components/TopBar/components/AnnouncementBar/types'

// TODO Admin should b able to change the annoucement
export function getCurrentAnnoucement(): AnnoucementItem {
  return {
    id: 'annoucement_1',
    label: 'CU Get Reg เป็นเว็บไซต์ที่จัดทำโดยนิสิต ซึ่งได้รับการสนับสนุนเซิฟเวอร์จาก Reg Chula',
  }
}
