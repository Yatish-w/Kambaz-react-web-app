import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuiz } from "./quizzesReducer";
import * as quizzesClient from "./client";
import * as usersClient from "../../Account/client";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import { setCurrentUser } from "../../Account/reducer";
import { GiCheckMark } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

export default function TakeQuiz () {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const {cid, qid} = useParams();
    const dispatch = useDispatch();
    const { updatingQuiz } = useSelector((state: any) => state.quizzesReducer);
    const [grade, setGrade] = useState(0);
    const [graded, setGraded] = useState(false);
    const [userAnswers, setUserAnswers] = useState<any>([]);
    const [userAnswersClean, setUserAnswersClean] = useState<any>([]);
    function createMarkup(html: any) {
        return { __html: DOMPurify.sanitize(html) };
    }
    const filterUserAnswers = (userAnswers: any) => {
        const qids = new Set();
        const latestAnswers = [] as any;
        for (let i = userAnswers.length - 1; i >= 0; i--) {
            const qid = userAnswers[i].qid;
            if (!qids.has(qid)) {
            latestAnswers.push(userAnswers[i]);
            qids.add(qid);
            }
        }
        return latestAnswers;
    };
    const updateUser = (quizGrade: any) => {
        const answers = filterUserAnswers(userAnswers) as any;
        usersClient.updateUser({...currentUser, quizAttempts: [...currentUser.quizAttempts, {course: cid, user: currentUser._id, grade: quizGrade,
                                                              quiz: qid, answers: answers, time: new Date().toLocaleString()}]})
        dispatch(setCurrentUser({...currentUser, quizAttempts: [...currentUser.quizAttempts, {course: cid, user: currentUser._id, grade: quizGrade,
                                                      quiz: qid, answers: answers, time: new Date().toLocaleString()}]}));
    };
    const gradeQuiz = () => {
        const answers = filterUserAnswers(userAnswers) as any;
        let reversedAnswers = answers.slice().reverse();
        setUserAnswersClean(reversedAnswers);
        let userPoints = 0;
        answers.forEach((answer: any) => {
            if (answer.type === "fill in blank") {
                if (answer.possibleAnswers.includes(answer.userAnswer)) {
                    userPoints += answer.points;
                }
            } else {
                if (answer.userAnswer === answer.correctAnswer) {
                    userPoints += answer.points;
                }
            }
        });
        setGrade(userPoints);
        setGraded(true);
        updateUser(userPoints);
    };
    
    useEffect(() => {
        const findQuiz = async (cid: string, qid: string) => {
            const quiz = await quizzesClient.findQuiz(cid, qid);
            dispatch(setQuiz(quiz[0]));
        };
        
        findQuiz(cid as string, qid as string);
    }, [cid, qid, dispatch]);
    
    return (
        <div className="mb-2">
            <div>
                <h1>{updatingQuiz.title} {(currentUser.role === "FACULTY" || currentUser.role === "TA") ?
                    <Link className="btn btn-lg btn-danger float-end" 
                                                to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/editor`}>Edit Quiz</Link> : ""}</h1>
                <div><strong>Started:</strong> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</div><br />
                <h4>Quiz Instructions:</h4>
                <div dangerouslySetInnerHTML={createMarkup(updatingQuiz.instructions)} />
            </div><hr />
            {graded &&
            <div className="alert alert-success"  role="alert">
                Quiz Grade: {`${grade} / ${updatingQuiz.points} (${(grade / updatingQuiz.points)*100}%)`}
            </div>}
            <ul id="wd-questions-take-quiz" className="list-group rounded-0">
              {updatingQuiz.questions ? updatingQuiz.questions
                .map((question: any, qindex: number) => (
                    <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                        <div className="wd-title p-3 ps-2 bg-secondary">
                            {question.questionType !== "fill in blank" ?
                            <span className= {`float-end ${graded && userAnswersClean[qindex].userAnswer === userAnswersClean[qindex].correctAnswer ? "text-success" : "text-danger"}`}>
                                {graded && (userAnswersClean[qindex].userAnswer === userAnswersClean[qindex].correctAnswer ? <GiCheckMark className="ms-2"/> : <RxCross2 className="ms-2"/>)}
                            </span> :
                            <span className= {`float-end ${graded && userAnswersClean[qindex].possibleAnswers.includes(userAnswersClean[qindex].userAnswer) ? "text-success" : "text-danger"}`}>
                                {graded && (userAnswersClean[qindex].possibleAnswers.includes(userAnswersClean[qindex].userAnswer) ? <GiCheckMark className="ms-2"/> : <RxCross2 className="ms-2"/>)}
                            </span>         
                            }
                            <span>{question.title}</span><span className="float-end text-secondary">{question.points} pts</span>
                        </div>
                        <div>
                            <div className="ms-3 mt-3" dangerouslySetInnerHTML={createMarkup(question.content)} />
                            {question.questionType === "fill in blank" &&
                                <div>
                                    <input className="form-control ms-4 mb-2 w-50" onChange={(e) => setUserAnswers([...userAnswers, {qid: question._id, userAnswer: e.target.value, 
                                                                                                            points: question.points, type: question.questionType, 
                                                                                                            possibleAnswers: question.possibleAnswers}])}/>
                                    {graded && (currentUser.role === "FACULTY" || currentUser.role === "TA") &&
                                    (
                                        <span className="text-success fw-bold ms-4">
                                            Correct Answer(s):
                                            <ul>
                                                {question.possibleAnswers.map((element: any, index: number) => (
                                                    <li key={index}>{element}</li>
                                                ))}
                                            </ul>
                                        </span>
                                    )}
                                </div>
                            }
                            {question.questionType === "multiple choice" &&
                                <div>
                                    {question.possibleAnswers.map((possAns: any, index: number) => (
                                        <div className="ms-4 mb-2">
                                            <input type="radio" name={`all-possible-answers-${question._id}`} id={`possible-answer-${index}`} className="me-2" 
                                                onClick={() => setUserAnswers([...userAnswers, {qid: question._id, userAnswer: possAns, correctAnswer: question.correctAnswer, 
                                                                                                points: question.points, type: question.questionType}])}/>
                                            <label htmlFor={`possible-answer-${index}`}>{possAns}</label>
                                            <br />
                                        </div>
                                    ))}
                                    {graded && (currentUser.role === "FACULTY" || currentUser.role === "TA") && <span className="text-success fw-bold ms-4">Correct Answer: {question.correctAnswer}</span>}
                                </div>
                            }
                            {question.questionType === "true false" &&
                                <div className="mb-2 ms-4">
                                    <span>
                                        <input type="radio" name="true-false" id="true" className="me-2" onClick={() => setUserAnswers([...userAnswers, {qid: question._id, userAnswer: "true", 
                                                                                                        correctAnswer: question.correctAnswer, points: question.points, type: question.questionType}])} />
                                        <label htmlFor="true">True</label>
                                    </span><br />
                                    <span>
                                        <input type="radio" name="true-false" id="false" className="me-2" onClick={() => setUserAnswers([...userAnswers, {qid: question._id, userAnswer: "false",
                                                                                                        correctAnswer: question.correctAnswer, points: question.points, type: question.questionType}])} />
                                        <label htmlFor="false">False</label>
                                    </span><br />
                                    {graded && (currentUser.role === "FACULTY" || currentUser.role === "TA") && <span className="text-success fw-bold">Correct Answer: {question.correctAnswer}</span>}
                                </div>}
                        </div>
                    </li>
                ))
              :
                <div className="alert alert-danger" role="alert">
                    No Questions Have Been Created For this Quiz.
                </div>}
            </ul>
            <div>
                {updatingQuiz.questions ?
                <span className="mb-2">
                    {!graded && <span><button className="btn btn-danger float-end" onClick={gradeQuiz}>Submit Quiz</button><br /><br /></span>}
                    {graded && <span><Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} className="btn btn-danger float-end"
                                >Exit Quiz</Link><br /><br /></span>}
                </span>
                :
                <span><Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} className="btn btn-danger float-end"
                                >Exit Quiz</Link><br /><br /></span>
                }
            </div> 
        </div>
    );
}