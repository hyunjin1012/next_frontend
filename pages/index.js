import axios from 'axios'
import Link from 'next/link'
import styles from '../styles/Home.module.css'




export default function Home({data}) {
  return (
    <div className={styles.container} style={{padding: "100px"}}>
      <button className={styles.btn}><Link href="/form/create">Create your own form</Link></button>
      <button className={styles.btn}><Link href="/form/">Check out previous forms</Link></button>
      <button className={styles.btn}><Link href="/form/response">Check out previous responses</Link></button>
    </div>
  )
}