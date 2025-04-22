import { useEffect, useState } from "react";
import * as client from "./client";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";

export default function Attempt() {
    const [quiz, setQuiz] = useState<any>({});
    const [answers, setAnswers] = useState<any>([]);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { cid, qid, attemptNumber } = useParams();

    function createMarkup(html: any) {
        return { __html: DOMPurify.sanitize(html) };
    };
    const findQuiz = async (cid: string, qid: string) => {
        const quiz = await client.findQuiz(cid, qid);
        setQuiz(quiz[0]);
    };
    const findAttempt = async (attemptNo: string) => {
        const number = Number(attemptNo) - 1;
        const userAttempt = currentUser.quizAttempts.filter((qa: any) => qa.course === cid && qa.quiz === qid)[number];
        let reversedAnswers = userAttempt.answers.slice().reverse();
        setAnswers(reversedAnswers);
    };
    useEffect(() => {
        findQuiz(cid as string, qid as string);
        findAttempt(attemptNumber as string);
      }, []);
      return (
        <div>
            <h1>Attempt {attemptNumber}</h1>
            {quiz.questions && (
                <ul id="wd-questions-quiz-attempt" className="list-group rounded-0">
                    {quiz.questions.map((question: any, qindex: number) => (
                        <li key={qindex} className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <span className="ms-2">{question.title}</span>
                                <span className="float-end text-secondary">{question.points} pts</span>
                            </div>
                            <div>
                                <div className="ms-3 mt-3" dangerouslySetInnerHTML={createMarkup(question.content)} />
                                {question.questionType === "fill in blank" &&
                                    <input className="form-control ms-4 mb-2 w-50" value={answers[qindex].userAnswer} readOnly />}
                                {question.questionType === "fill in blank" &&
                                    (quiz.showCorrectAnswers && quiz.attemptsAllowed === Number(attemptNumber) &&
                                        (
                                            <span className="text-success fw-bold ms-4">
                                                Correct Answer(s):
                                                <ul>
                                                    {question.possibleAnswers.map((element: any, index: number) => (
                                                        <li key={index}>{element}</li>
                                                    ))}
                                                </ul>
                                            </span>
                                        ))
                                }
                                {question.questionType === "multiple choice" &&
                                    <div>
                                        {question.possibleAnswers.map((possAns: any, index: number) => (
                                            <div key={index} className="ms-4 mb-2">
                                                <input type="radio" name={`all-possible-answers-${question._id}`} id={`possible-answer-${index}`} className="me-2"
                                                    checked={possAns === answers[qindex].userAnswer} readOnly />
                                                <label htmlFor={`possible-answer-${index}`}>{possAns}</label>
                                                <br />
                                            </div>
                                        ))}
                                        {quiz.showCorrectAnswers && Number(attemptNumber) === quiz.attemptsAllowed && <span className="text-success fw-bold ms-4">Correct Answer: {question.correctAnswer}</span>}
                                    </div>
                                }
                                {question.questionType === "true false" &&
                                    <div className="mb-2 ms-4">
                                        <span>
                                            <input type="radio" name="true-false" id="true" className="me-2" checked={answers[qindex].userAnswer === "true"} readOnly />
                                            <label htmlFor="true">True</label>
                                        </span><br />
                                        <span>
                                            <input type="radio" name="true-false" id="false" className="me-2" checked={answers[qindex].userAnswer === "false"} readOnly />
                                            <label htmlFor="false">False</label>
                                        </span><br />
                                        {quiz.showCorrectAnswers && Number(attemptNumber) === quiz.attemptsAllowed && <span className="text-success fw-bold">Correct Answer: {question.correctAnswer}</span>}
                                    </div>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div>
                <span><Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} className="btn btn-danger float-end">
                    Exit Quiz
                </Link><br /><br />
                </span>
            </div>
        </div>
    );
      
    }

