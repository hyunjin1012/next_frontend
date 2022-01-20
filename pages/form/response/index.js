import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./../../../styles/Home.module.css";

// export const getServerSideProps = async () => {
//   const responses = [];
//   const querySnapshot = await getDocs(collection(db, "responses"));
//   querySnapshot.forEach((doc) => {
//     responses.push({
//       id: doc.id,
//       ...doc.data(),
//     });
//   });

//   return {
//     props: { responses: responses },
//   };
// };

const Responses = () => {

  const [responses, setResponses] = useState([]);
  useEffect(async () => {
    const res = await axios.get('https://hyunjin.xyz/responses');
    setResponses(res.data.responses)
  }, [])

  return (
    <>
     {/* <Head>
      <title>Responses</title>
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
      </Head> */}
    <div className={styles.container}>
      <div
        className={styles.formContainer}
        style={{
          width: "80%",
        }}
      >
        <h1>Response List</h1>
        {responses.map((response, index) => (
          <div key={index} className={styles.box} >
            <Link href={"/form/response/" + response.uuid}>
              <a>
                <h3>{response.formTitle}</h3>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Responses;
