import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { setQuiz } from "./quizzesReducer";
import * as client from "./client";
import { FaTrash } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

export default function QuizQuestionsEditor () {
    const { cid, qid } = useParams();
    const [status, setStatus] = useState(false);
    const [questionId, setQuestionId] = useState("");
    const { updatingQuiz, newQuestion } = useSelector((state: any) => state.quizzesReducer);
    const [currentQuestions, setCurrentQuestions] = useState<any>([]);
    const [questionType, setQuestionType] = useState("");
    const [title, setTitle] = useState("");
    const [points, setPoints] = useState<any>();
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [correctAnswerStatus, setCorrectAnswerStatus] = useState(false);
    const [possibleAnswers, setPossibleAnswers] = useState<any>(["Possible Answer"]);
    const [content, setContent] = useState("");
    const dispatch = useDispatch();
    const quillRef = useRef(null);

    function createMarkup(html: any) {
        return { __html: DOMPurify.sanitize(html) };
    };
    const handleContentChange = async (content: string) => {
        setContent(content);
    };
    const handleClickEdit = async (question: any) => {
        setQuestionId(question._id)
        setQuestionType(question.questionType);
        setTitle(question.title);
        setPoints(question.points);
        setCorrectAnswer(question.correctAnswer);
        setPossibleAnswers(question.possibleAnswers);
        setContent(question.content);
        setCurrentQuestions((prevQuestions: any) => prevQuestions.map((cq: any) => cq._id === question._id ? {...cq, editing: true} : cq));
    };
    const deletePossibleAnswer = async(index: number) => {
        setPossibleAnswers(possibleAnswers.filter((pa: any, i: number) => i !== index))
    };
    const saveQuestion = async () => {
        const updatedQuestion = {...currentQuestions.find((q: any) => q._id === questionId),
            course: cid,
            quiz: qid,
            title: title,
            points: points,
            questionType: questionType,
            content: content,
            correctAnswer: correctAnswer,
            userAnswer: "",
            pointsRecieved: 0,
            possibleAnswers: possibleAnswers,
            editing: false
        };
        setCurrentQuestions((prevQuestions: any) => prevQuestions.map((cq: any) => cq._id === questionId ? updatedQuestion : cq));
    };
    const saveAllQuestions = async () => {
        let totalPoints;
        if (currentQuestions.length !== 0) {
            totalPoints = currentQuestions.reduce((sum: number, q: any) => sum + q.points, 0);
        } else {
            totalPoints = 0;
        }
        dispatch(setQuiz({...updatingQuiz, questions: currentQuestions, points: totalPoints}));
        setStatus(true);
    }
    
    useEffect(() => {
        const findQuiz = async (cid: string, qid: string) => {
            const quiz = await client.findQuiz(cid, qid);
            console.log(quiz[0].questions);
            dispatch(setQuiz(quiz[0]));
            setCurrentQuestions(quiz[0].questions || []);
        };
        
        findQuiz(cid as string, qid as string);
    }, [cid, qid, dispatch]);
    
    return (
        <div id="wd-quiz-questions-page" className="text-center">
            {status && 
            <div className="alert alert-success" role="alert">
                Successfully Saved Questions! Return to 'Details' Page to Save Quiz.
            </div>}
            <Link className="btn btn-lg btn-light mt-5 border border-dark" 
                  to = {`/Kambaz/Courses/${cid}/Quizzes/${qid}/editor`}
                    onClick={() => {
                        const questId = new Date().getTime().toString();
                        handleClickEdit({...newQuestion, editing: true, questionType: newQuestion.questionType, _id: questId});
                        setCurrentQuestions((prevQuestions: any) => [...prevQuestions, {...newQuestion, editing: true, questionType: newQuestion.questionType, _id: questId}]);
                    }}>
                + New Question
            </Link>
            <br /><br />
            <div id="wd-quiz-questions">
              <ul id="wd-questions" className="list-group rounded-0">
                {currentQuestions.map((q: any) => (
                    q.editing ?
                        <div id="wd-edit-question mb-4" key={q._id}>
                            <div className="form-group row">
                                <div className="col-sm-3">
                                    <input id="question-title" className="form-control w-100" defaultValue={q.title} onChange={(e) => setTitle(e.target.value)}
                                        placeholder="question title" />
                                </div>
                                <div className="col-sm-3">
                                    <select className="form-control w-100" onChange={(e) => setQuestionType(e.target.value)} defaultValue={questionType}>
                                        <option value="multiple choice">Multiple Choice {questionType === "multiple choice" ? "(Current)" : ""}</option>
                                        <option value="fill in blank">Fill in the Blank(s) {questionType === "fill in blank" ? "(Current)" : ""}</option>
                                        <option value="true false">True or False {questionType === "true false" ? "(Current)" : ""}</option>
                                    </select>
                                </div>
                                <div className="col-sm-2"/>
                                <div className="col-sm-4">
                                    <span className="fs-5 float-end">Points: <input id="question-points" className="form-control float-end w-25" 
                                        type="number" defaultValue={q.points}
                                        onChange={(e) => setPoints(Number(e.target.value))} /></span>
                                </div>
                            </div><br />
                            <div><br />
                                {questionType === "multiple choice" && "Enter your question, then enter multiple answers and specify the one correct answer."}
                                {questionType === "fill in blank" && "Enter your question, then define all possible correct answers for the blank. " +
                                    "Students will see the question followed by a small text box to type their answer."}
                                {questionType === "true false" && "Enter your question, then set True or False as the correct answer."}
                                <br /><br /><h1>Question:</h1>
                                <ReactQuill style={{height: 200}} theme="snow" value={content} 
                                    onChange={handleContentChange} ref={quillRef}/>< br/>< br/>< br/>
                                <h1>Answers:</h1>
                                {questionType === "true false" ? 
                                <div>
                                    {correctAnswerStatus && 
                                        <div className="alert alert-success" role="alert">
                                            Successfully Saved Correct Answer!
                                        </div>}
                                    <span>
                                        <input type="radio" name="true-false" id="true" className="me-2" onClick={() => setCorrectAnswer("true")}/>
                                        <label htmlFor="true">True</label>
                                    </span><br />
                                    <span>
                                        <input type="radio" name="true-false" id="false" className="me-2" onClick={() => setCorrectAnswer("false")}/>
                                        <label htmlFor="false">False</label>
                                    </span><br />
                                    <button className="btn btn-success" onClick={() => {
                                                                    setCorrectAnswer(correctAnswer);
                                                                    setCorrectAnswerStatus(true);}}>Set Correct Answer</button>
                                </div>
                                :
                                possibleAnswers.map((possAns: any, index: number) => (
                                    <div className="d-flex flex-row justify-content-center align-items-center mb-2" key={index}>
                                        <input type="text" id="possible-answer" 
                                        className={`form-control w-25 mb-2 ${correctAnswer === possAns ? "text-success fw-bold" : ""}`} 
                                        value={possAns} 
                                        onChange={(e) => setPossibleAnswers(possibleAnswers.map((pa: any, i:number) => i === index ? e.target.value : pa))}/>                                 
                                        <FaTrash className="text-danger ms-2" onClick={() => deletePossibleAnswer(index)} />
                                    </div>
                                ))}<br />
                                {questionType === "multiple choice" &&
                                    <div className="row d-flex justify-content-center">
                                        <div>
                                            <div className="row d-flex justify-content-center">
                                                <label className="fw-bold" htmlFor="correct-ans">Correct Answer:</label><br />
                                                <input id="correct-ans" className="form-control w-25 me-2" defaultValue={q.correctAnswer ? q.correctAnswer : ""} onChange={(e) => setCorrectAnswer(e.target.value)}/>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <br />
                                {(questionType === "multiple choice" || questionType === "fill in blank") &&
                                    <button className="btn btn-danger" onClick={() => setPossibleAnswers([...possibleAnswers, "Possible Answer"])}>+ Another Answer</button>}
                            </div>
                            <div className="mt-4">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => {
                                                                                setCurrentQuestions((prevQuestions: any) => prevQuestions.map((cq: any) => cq._id === questionId ? {...cq, editing: false} : cq));                                                                  
                                                                            }}>
                                    Cancel </button>
                                <button className="btn btn-danger" onClick={saveQuestion}>
                                    Save Question </button>
                            </div>
                            <br />
                        </div>
                        :
                        <div key={`div-${q._id}`}>
                            <li className="wd-question list-group-item p-0 mb-5 fs-5 border-gray" key={q._id}>
                                <div className="wd-title p-3 ps-2 bg-secondary">
                                    <button className="float-start btn btn-primary me-2" onClick={() => handleClickEdit(q)}>Edit</button>
                                    <button className="float-start btn btn-danger" onClick={() => setCurrentQuestions(currentQuestions.filter((cq: any) => cq._id !== q._id))}>
                                        Delete
                                    </button>
                                    <span>{q.title}</span>
                                    <span className="float-end text-secondary">{q.editing ?
                                        <input type="number" className="form-control" /> : q.points} pts</span>
                                </div>
                                <div>
                                    <div className="mt-2" dangerouslySetInnerHTML={createMarkup(q.content)} />
                                    {q.questionType === "fill in blank" &&
                                        <div className="row d-flex justify-content-center">
                                            <input className="form-control w-25 ms-4 mb-2" placeholder="Your Answer"/>
                                        </div>}
                                    {q.questionType === "multiple choice" &&
                                        q.possibleAnswers.map((possAns: any, index: number) => (
                                            <div className="ms-4 mb-2">
                                                <input type="radio" name={`all-possible-answers-${q._id}`} id={`possible-answer-${index}`} className="me-2" />
                                                <label htmlFor={`possible-answer-${index}`}>{possAns}</label>
                                                <br />
                                            </div>
                                        ))}
                                    {q.questionType === "true false" &&
                                        <div className="mb-2 ms-4">
                                            <span>
                                                <input type="radio" name="true-false" id="true" className="me-2" onClick={() => setCorrectAnswer("true")} />
                                                <label htmlFor="true">True</label>
                                            </span><br />
                                            <span>
                                                <input type="radio" name="true-false" id="false" className="me-2" onClick={() => setCorrectAnswer("false")} />
                                                <label htmlFor="false">False</label>
                                            </span>
                                        </div>}
                                </div>
                            </li><br />
                        </div>
                ))}
              </ul>
            </div><br /><hr />
            <button className="btn btn-danger mt-5" onClick={saveAllQuestions}>Save Questions</button>
        </div>
    );
}