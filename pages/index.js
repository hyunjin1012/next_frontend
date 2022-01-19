import axios from 'axios'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export async function getServerSideProps() {
  const uuid = "a43fb5c9-2402-42d4-9839-8c4ab0c02191"
  const res = await axios.get("http://54.151.56.35:8000/form/" + uuid)
  const data = res.data;
  console.log(data)
  return {
    props: {data:data}
}
  
  }



export default function Home({data}) {
  return (
    <div className={styles.container} style={{padding: "100px"}}>
      {/* <div>{data.message}</div> */}
      <button className={styles.btn}><Link href="/form/create">Create your own form</Link></button>
      <button className={styles.btn}><Link href="/form/">Check out previous forms</Link></button>
      <button className={styles.btn}><Link href="/form/response">Check out previous responses</Link></button>
    </div>
  )
}