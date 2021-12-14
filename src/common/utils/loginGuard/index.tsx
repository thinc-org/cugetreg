import { dialog } from '@/lib/dialog'
import { userStore } from '@/store/userStore'

const loginGuard = (onConfirm?: () => void) => {
  if (!userStore.isLoggedIn()) {
    console.log('loginGuard')
    dialog({
      heading: 'คุณยังไม่ได้เข้าสู่ระบบ',
      content: 'คุณจะสามารถเขียนรีวิว กดไลก์ และรายงานรีวิวของผู้อื่นได้เมื่อเข้าสู่ระบบแล้วเท่านั้น',
      primaryButtonText: 'เข้าสู่ระบบ',
      secondaryButtonText: 'ยกเลิก',
      onPrimaryButtonClick: onConfirm,
    })
    return false
  }
  return true
}

export { loginGuard }
