import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";

const Forms = () => {
  const [forms, setForms] = useState([]);
  useEffect(async () => {
    const res = await axios.get("https://hyunjin.xyz/forms");
    setForms(res.data.forms);
  }, []);

  return (
    <>
    {/* <Head>
    <title>Forms</title>
    <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
    </Head> */}
    <div className={styles.container}>
      <div
        className={styles.formContainer}
        style={{
          width: "80%",
        }}
      >
        <h1>Form List</h1>
        {forms.map((form, index) => (
          <div key={index} className={styles.box}>
            <Link href={"/form/" + form.uuid}>
              <a>
                <h3>{form.formTitle}</h3>
                <span>{form.formDesc}</span>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Forms;
