import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import styles from "../../styles/Home.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function Create() {
  const uuid = uuidv4();
  const router = useRouter();
  const [formTitle, setFormTitle] = useState("Untitled form");
  const [formDesc, setFormDesc] = useState("");
  const [questions, setQuestions] = useState([]);
  const cp = [...questions];

  const submit = async () => {

    await axios.post("https://hyunjin.xyz/createform", {
      uuid,
      formTitle,
      formDesc,
    });

    await axios.post("https://hyunjin.xyz/createquestions", {
      formUuid: uuid,
      questions,
    });
    

    const optionArrayArray = questions.map(
      (question, index) => question.selectOptions
    );

    optionArrayArray.map( async (options, index) => {
      if (options.length === 0) {return;}
      const qUuid = options[0].qUuid;
      const formUuid = uuid
      await axios.post(("https://hyunjin.xyz/createoptions"), {qUuid: qUuid, formUuid: formUuid, options})
    });

    alert(
      `Thank you for submitting your form: ${uuid}`
    );
    setFormTitle("Untitled form");
    setFormDesc("");
    setQuestions([]);
    router.push({pathname: `/form/`, query:{uuid: uuid}})
  };

  const addDefaultQuestion = () => {
    cp.push({
      formUuid: uuid,
      uuid: uuidv4(),
      title: "Untitled question",
      qType: "checkbox",
      desc: "",
      selectOptions: [
        // {
        //   uuid: uuidv4(),
        //   title: "Untitled option",
        //   checked:false,
        //   desc: ""
        // },
      ],
    });
    const addedQuestion = cp[cp.length - 1]
    addedQuestion.selectOptions.push({
      qUuid: addedQuestion.uuid,
      qQType: addedQuestion.qType,
      qTitle: addedQuestion.title,
      qDesc: addedQuestion.desc,
      uuid: uuidv4(),
      title: "Untitled option",
      checked:false,
      desc: ""
    })

    
    setQuestions(cp);
  };

  const updateTitle = (text, uuid) => {
    const foundIndex = questions.findIndex(
      (question) => question.uuid === uuid
    );
    if (foundIndex === -1) {
      return false;
    }

    cp[foundIndex].title = text;
    setQuestions(cp);
  };

  const updateDesc = (text, uuid) => {
    const foundIndex = questions.findIndex(
      (question) => question.uuid === uuid
    );
    if (foundIndex === -1) {
      return false;
    }

    cp[foundIndex].desc = text;
    setQuestions(cp);
  };

  const updateQType = (qType, uuid) => {
    const foundIndex = questions.findIndex(
      (question) => question.uuid === uuid
    );
    if (foundIndex === -1) {
      return false;
    }

    cp[foundIndex].qType = qType;
    setQuestions(cp);
  };

  const deleteQuestion = (uuid) => {
    const foundIndex = questions.findIndex(
      (question) => question.uuid === uuid
    );
    if (foundIndex === -1) {
      return false;
    }

    cp.splice(foundIndex, 1);
    setQuestions(cp);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const foundIndex = result.source.index;
    const [removedQuestion] = cp.splice(foundIndex, 1);
    cp.splice(result.destination.index, 0, removedQuestion);
    setQuestions(cp);
  };

  useEffect(addDefaultQuestion, []);

  return (

    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.box}>
          <input
            className={styles.input}
            style={{ fontSize: "30px" }}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <input
            className={styles.input}
            style={{ fontSize: "15px" }}
            placeholder="Form description"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
        </div>
        <div style={{ width: "100%" }}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="question">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions.map((question, index) => {
                    return (
                      <div key={index}>
                        <Draggable
                          key={index}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              className={styles.box}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={styles.moveBtn}
                                title="Move this question"
                              >
                                <FontAwesomeIcon icon={faBars} />
                              </div>
                              <Question
                                key={index}
                                question={question}
                                updateTitle={updateTitle}
                                updateDesc={updateDesc}
                                updateQType={updateQType}
                                deleteQuestion={deleteQuestion}
                              />
                            </div>
                          )}
                        </Draggable>
                      </div>
                    );
                  })}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      title="Add question"
                      className={styles.addQuestionBtn}
                      onClick={(e) => addDefaultQuestion()}
                    >
                      <FontAwesomeIcon icon={faPlusCircle} />
                      <div style={{ marginTop: "5px" }}>Add question</div>
                    </button>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <button className={styles.btn} onClick={(e) => submit()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function Question({
  question,
  updateTitle,
  updateDesc,
  updateQType,
  deleteQuestion,
}) {
  const [q, setQ] = useState({});

  const addSelectOption = () => {
    const q = { ...question };
    const qUuid = q.uuid;
    const qQType = q.qType;
    q.selectOptions.push({
      qQType: qQType,
      qUuid: qUuid,
      uuid: uuidv4(),
      title: "Untitled option",
      desc: "",
    });
    setQ(q);
  };

  const updateSelectOption = (text, optionUuid, key) => {
    const q = { ...question };
    const selectOptions = q.selectOptions;
    const foundSelectOptionIndex = selectOptions.findIndex(
      (selectOption) => selectOption.uuid === optionUuid
    );
    if (foundSelectOptionIndex === -1) {
      return false;
    }
    selectOptions[foundSelectOptionIndex][key] = text;
    setQ(q);
  };

  const deleteSelectOption = (optionUuid) => {
    const q = { ...question };
    const selectOptions = q.selectOptions;
    const foundSelectOptionIndex = selectOptions.findIndex(
      (selectOptions) => selectOptions.uuid === optionUuid
    );
    if (foundSelectOptionIndex === -1) {
      return false;
    }
    selectOptions.splice(foundSelectOptionIndex, 1);
    setQ(q);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const q = { ...question };
    const options = q.selectOptions;
    const optionIndex = result.source.index;
    const [removedOption] = options.splice(optionIndex, 1);
    options.splice(result.destination.index, 0, removedOption);
    setQ(q);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <input
          className={styles.input}
          style={{ fontSize: "20px" }}
          onChange={(e) => updateTitle(e.target.value, question.uuid)}
          value={question.title}
        />
        <button
          title="Delete this question"
          className={styles.trashBtn}
          onClick={(e) => deleteQuestion(question.uuid)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div
        style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}
      >
        <input
          className={styles.input}
          onChange={(e) => updateDesc(e.target.value, question.uuid)}
          value={question.desc}
          placeholder="Question description"
        />
        <select
          className={styles.select}
          value={question.qType}
          onChange={(e) => updateQType(e.target.value, question.uuid)}
        >
          <option value="checkbox">Checkbox</option>
          <option value="radio">Multiple Choice</option>
          <option value="text">Text</option>
          <option value="long text">Long Text</option>
        </select>
      </div>

      {(question.qType === "checkbox" || question.qType === "radio") && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {question.selectOptions.map((option, index) => {
                  return (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className={styles.li}
                        >
                          <div
                            {...provided.dragHandleProps}
                            title="Move this option"
                            className={styles.moveBtn}
                          >
                            <FontAwesomeIcon icon={faBars} />
                          </div>
                          <input
                            type={
                              question.qType === "checkbox"
                                ? "checkbox"
                                : "radio"
                            }
                            disabled={true}
                          />
                          <input
                            className={styles.input}
                            value={option.title}
                            onChange={(e) =>
                              updateSelectOption(
                                e.target.value,

                                option.uuid,
                                "title"
                              )
                            }
                          />

                          <input
                            className={styles.input}
                            onChange={(e) =>
                              updateSelectOption(
                                e.target.value,

                                option.uuid,
                                "desc"
                              )
                            }
                            value={option.desc}
                            placeholder="Option description"
                          />

                          <button
                            title="Delete this option"
                            className={styles.deleteBtn}
                            onClick={(e) => deleteSelectOption(option.uuid)}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    title="Add option"
                    className={styles.addBtn}
                    onClick={(e) => addSelectOption()}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {(question.qType === "text" || question.qType === "long text") &&
        question.selectOptions.map((option, index) => (
          <input key={index} className={styles.input} disabled={true}></input>
        ))}
    </div>
  );
}
