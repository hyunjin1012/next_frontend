import styles from "./../../../styles/Home.module.css";
import axios from "axios";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  const res = await axios.get("https://hyunjin.xyz/responses");
  const responses = res.data.responses;
  const paths = responses.map((response) => {
    if (response.uuid === null) {
      return;
    } else return { params: { uuid: response.uuid.toString() } };
  });
  return {
    paths: paths,
    fallback: 'blocking',
  };
}

export const getStaticProps = async (context) => {
  const uuid = context.params.uuid;
  // console.log(uuid)
  // const responseRes = await axios.get("http://54.151.56.35:8000/oneresponse/" + uuid)
  // const response = responseRes.data.response;
  // console.log(response)
  // const formUuid = response.formUuid;
  // const questionsRes = await axios.get("http://54.151.56.35:8000/questions/" + formUuid);
  // const questions = questionsRes.data.questions;
  // console.log(questions)

  const res = await axios.get("https://hyunjin.xyz/responses");
  const responses = res.data.responses;
  const response = responses.filter((response) => response.uuid === uuid)[0];
  const formUuid = response.formUuid;
  // const answersRes = await axios.get("http://54.151.56.35:8000/answers/" + uuid)
  // const answers = answersRes.data.answers;
  // console.log(answers)
  // const questions = questionsRes.data.questions;
  // console.log(questions)
  return {
    props: { response: response },
  };
};

export default function Response(props) {
  const router = useRouter();
  const uuid = props.response.uuid;

  // const router = useRouter();
  // const {uuid} = router.query
  if (router.isFallback) {
    return <div>Loading...</div>;
  } else
    return (
      <>
      {/* <Head>
      <title>Response</title>
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
      </Head> */}
      <div className={styles.container}>
        <div>Response ID: {uuid}</div>
        {/* <ResponseForm response={response} questions = {questions} /> */}
      </div>
      </>
    );
}

// function ResponseForm({ response, questions }) {
//   return (
//     <div className={styles.container}>
//       <div className={styles.formContainer}>
//       <div className={styles.box}>
//         <h1 className={styles.input} style={{ fontSize: "30px" }}>
//           {response.formTitle}
//         </h1>
//         <div className={styles.input} style={{ fontSize: "15px" }}>
//           {response.formDesc}
//         </div>
//       </div>
//       <div style={{width: "100%"}}>
//         {questions.length !==  0 ? questions.map((question, index) => {
//           return <div key={index}><ResponseBox response={response} question = {question}/></div>
//         }): null}
//       </div>
//       </div>
//     </div>
//   );
// }

// function ResponseBox({ response, question }) {
//   const qType = question.qType;
//   const qUuid = question.uuid;
//   const answers = response.Answers;
//   const qAnswers = answers.filter((answer) => answer.qUuid === qUuid)

//   return (
//     <div className={styles.box}>
//       <div className={styles.question}>{question.title}</div>
//       <div className={styles.questionDesc}>{question.desc}</div>
//       {(qType === "checkbox" || qType === "radio") &&
//       qAnswers.length !== 0
//         ? qAnswers.map((option, index) => {
//             return (
//               <div key={index} className={styles.optionBox}>
//                 <input
//                   className={styles.responseInput}
//                   name={qUuid}
//                   id={option.uuid}
//                   type={
//                     qType === "checkbox"
//                       ? "checkbox"
//                       : qType === "radio"
//                       ? "radio"
//                       : null
//                   }
//                   checked={option.checked}
//                   disabled={true}
//                 ></input>
//                 <label htmlFor={option.uuid} className={styles.option}>
//                   {option.title}
//                 </label>
//                 <label htmlFor={option.uuid} className={styles.optionDesc}>
//                   {option.desc}
//                 </label>
//               </div>
//             );
//           })
//         : qAnswers.map((option, index) => {
//             return (
//               <div key={index}>
//                 <input
//                   className={styles.input}
//                   value={option.title}
//                   disabled={true}
//                 ></input>
//               </div>
//             );
//           })}
//     </div>
//   );
// }
