import { AnnoucementItem } from '@/components/AnnouncementBar/types'

// TODO Admin should b able to change the annoucement
export function getCurrentAnnoucement(): AnnoucementItem {
  return {
    id: 'annoucement_1',
    label: 'CU Get Reg เป็นเพียงเว็บไซต์ที่จัดทำโดยนิสิต ทีมงานไม่ได้มีส่วนเกี่ยวข้องกับเว็บไซต์ Reg Chula แต่อย่างใด',
  }
}
