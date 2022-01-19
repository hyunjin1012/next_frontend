import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";

const Forms = () => {
  const [forms, setForms] = useState([]);
  useEffect(async () => {
    const res = await axios.get("http://54.151.56.35:8000/forms");
    setForms(res.data.forms);
  }, []);

  return (
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
  );
};

export default Forms;
