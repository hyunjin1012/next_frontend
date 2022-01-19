import axios from "axios";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  const res = await axios.get("http://54.151.56.35:8000/forms");
  const forms = res.data.forms;
  const paths = forms.map((form) => {
    if (form.uuid === null) {
      return;
    } else return { params: { uuid: form.uuid.toString() } };
  });
  console.log(paths)
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const uuid = context.params.uuid;
  const formRes = await axios.get("http://54.151.56.35:8000/form/" + uuid);
  const form = formRes.data.form;
  const optionsRes = await axios.get(
    "http://54.151.56.35:8000/form/options/" + uuid
  );
  const options = optionsRes.data.options;
  return {
    props: { form: form, options: options },
  };
}

export default function Form(props) {

  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const responseUuid = uuidv4();
  const formTitle = props.form.formTitle;
  const formDesc = props.form.formDesc;
  const formUuid = props.form.uuid;
  const questions = props.form.Questions;

  const [options, setOptions] = useState(props.options);


  const submit = async () => {
    await axios.post("http://54.151.56.35:8000/createresponse", {
      uuid: responseUuid,
      formTitle,
      formDesc,
      formUuid,
    });
    if (questions.length === 0) {
      return;
    } else
      options.map(async (option, index) => {
        
        await axios.post("http://54.151.56.35:8000/createanswer", {
          uuid: uuidv4(),
          qUuid: option.qUuid,
          qTitle: option.qTitle,
          qDesc: option.qDesc,
          title: option.title,
          desc: option.desc,
          checked: option.checked,
          responseUuid: responseUuid,
          formUuid: formUuid,
        });
      });
    alert(`Thank you for submitting your response:${responseUuid}`)
    router.push({pathname: `/form/response`})
  };

  return (
    <div className={styles.container}>
      <div>Form ID: {props.form.uuid}</div>
      <div className={styles.formContainer}>
      <div className={styles.box}>
        <h1 className={styles.input} style={{ fontSize: "30px" }}>
          {formTitle}
        </h1>
        <div className={styles.input} style={{ fontSize: "15px" }}>
          {formDesc}
        </div>
        <div style={{ width: "100%" }}>
          {questions.length !== 0 ? (
            questions.map((question, index) => {
              return (
                <div key={index}>
                  <div className={styles.question}>{question.title}</div>
                  <div className={styles.question}>{question.desc}</div>
                  <div>
                    <OptionBox
                      key={index}
                      question={question}
                      options={options}
                      setOptions={setOptions}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
      <button className={styles.btn} onClick={(e) => submit()}>
        Submit
      </button>
    </div>
    </div>
  );
}


function OptionBox({ question, options, setOptions }) {
  
  const qUuid = question.uuid;
  const qQType = question.qType;
  const allOptions = [...options];
  const qOptions = options.filter((option) => option.qUuid === question.uuid);
  // setOptions(qOptions);

  const updateCheckboxRadio = (checked, uuid) => {
    const foundIndex = allOptions.findIndex((option) => option.uuid === uuid);
    if (foundIndex === -1) {
      return false;
    }
    allOptions[foundIndex].checked = checked;
    setOptions(allOptions);
  };

  const updateTextResponse = (text, uuid) => {
    const foundIndex = allOptions.findIndex((option) => option.uuid === uuid);
    if (foundIndex === -1) {
      return false;
    }
    allOptions[foundIndex].title = text;
    setOptions(allOptions);
  };

  return (
    <div>
      {(qQType === "checkbox" || qQType === "radio") && qOptions.length !== 0
        ? qOptions.map((option, index) => {
            return (
              <div key={index} className={styles.optionBox}>
                <input
                  className={styles.responseInput}
                  name={qUuid}
                  id={option.uuid}
                  type={
                    qQType === "checkbox"
                      ? "checkbox"
                      : qQType === "radio"
                      ? "radio"
                      : null
                  }
                  onClick={(e) =>
                    updateCheckboxRadio(e.target.checked, option.uuid)
                  }
                ></input>
                <label htmlFor={option.uuid} className={styles.option}>
                  {option.title}
                </label>
                <label htmlFor={option.uuid} className={styles.optionDesc}>
                  {option.desc}
                </label>
              </div>
            );
          })
        : qOptions.map((option, index) => {
            return (
              <div key={index}>
                <input
                  onChange={(e) =>
                    updateTextResponse(e.target.value, option.uuid)
                  }
                  className={styles.input}
                ></input>
              </div>
            );
          })}
    </div>
  );
}
