import Link from 'next/link'
import styles from './style.module.css'

export default function Topbar() {
  return (
    <ul className={styles.navbar}>
      <li className={styles.navbarItem}>
        <Link href="/">Pending Reviews</Link>
      </li>
      <li>
        <Link href="/approvedReviews">Approved Reviews</Link>
      </li>
      <li>
        <Link href="/genEd">GenEd</Link>
      </li>
    </ul>
  )
}
