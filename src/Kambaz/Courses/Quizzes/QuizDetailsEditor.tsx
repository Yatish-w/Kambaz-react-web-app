import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { addQuiz, updateQuiz, setQuiz } from "./quizzesReducer";
import * as client from "./client";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuizDetailsEditor () {
    const { cid, qid } = useParams();
    const [ currentQuiz, setCurrentQuiz ] = useState<any>({});
    const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false);
    const [timeLimit, setTimeLimit] = useState(false);
    const { updatingQuiz, newQuiz } = useSelector((state: any) => state.quizzesReducer);
    const [instructions, setInstructions] = useState('');
    const quillRef = useRef(null);
    const dispatch = useDispatch();
    const createQuiz = async (quiz: any) => {
        const newQuiz = await client.createQuiz(cid as string, quiz);
        dispatch(addQuiz(newQuiz));
    }; 
    const saveQuiz = async (quiz: any) => {
        await client.updateQuiz(quiz);
        dispatch(updateQuiz(quiz));
    };
    const handleInstructionsChange = (content: string) => {
        setInstructions(content);
        dispatch(setQuiz({ ...updatingQuiz, instructions: content }));
    };
    
    useEffect(() => {
        const findQuiz = async (cid: string, qid: string) => {
            const quiz = await client.findQuiz(cid, qid);
            dispatch(setQuiz(quiz[0]));
            setCurrentQuiz(quiz[0]);
            setInstructions(quiz[0].instructions || '');
            setAllowMultipleAttempts(quiz[0].allowMultipleAttempts);
            setTimeLimit(quiz[0].timeLimit);
        };
        
        findQuiz(cid as string, qid as string);
    }, [cid, qid, dispatch]);
    
    return (
        <form className="mt-4">
            <input type="text" className="form-control" id="wd-quiz-name" defaultValue={currentQuiz.title}
                onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, title: e.target.value }))} />
            <br />
            <label htmlFor="wd-quiz-instructions">Quiz Instructions:</label><br />
            <ReactQuill theme="snow" id="wd-quiz-instructions" className="form-control" value={instructions}
                onChange={handleInstructionsChange} ref={quillRef}/>
            <div className="form-group mt-4 row">
                <div className="col-sm-4">
                    <label htmlFor="wd-quiz-type" className="me-4 col-form-label float-end">
                        Quiz Type
                    </label>
                </div>
                <div className="col-sm-7 w-25">
                    <select className="form-select" id="wd-quiz-type"
                        onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, quizType: e.target.value }))}>
                        <option selected value="Graded Quiz">Graded Quiz</option>
                        <option value="Practice Quiz">Practice Quiz</option>
                        <option value="Graded Survey">Graded Survey</option>
                        <option value="Ungraded Survey">Ungraded Survey</option>
                    </select>
                </div>
            </div>
            <div className="form-group mt-4 row">
                <div className="col-sm-4">
                    <label htmlFor="wd-assignment-group" className="me-4 col-form-label float-end">
                        Assignment Group
                    </label>
                </div>
                <div className="col-sm-6 w-25">
                    <select className="form-select" id="wd-assignment-group"
                        onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, assignmentGroup: e.target.value }))}>
                        <option selected value="Quizzes">Quizzes</option>
                        <option value="Exams">Exams</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Project">Project</option>
                    </select>
                </div>
            </div>
            <div className="form-group mt-4 row">
                <div className="col-sm-4">
                    <label htmlFor="wd-quiz-points" className="me-4 col-form-label float-end">
                        Points
                    </label>
                </div>
                <div className="col-sm-7">
                    <input type="number" id="wd-quiz-points" className="form-control w-25" defaultValue={currentQuiz.points} 
                           onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, points: e.target.value }))}/>
                </div>
            </div>
            <div className="form-group mt-4 row">
                <div className="col-sm-4">
                    <label htmlFor="wd-access-code" className="me-4 col-form-label float-end">
                        Access Code
                    </label>
                </div>
                <div className="col-sm-7">
                    <input type="text" id="wd-access-code" className="form-control w-25" defaultValue={currentQuiz.accessCode} 
                           onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, accessCode: e.target.value }))}/>
                </div>
            </div>
            <div className="form-group mt-4 row">
                <div className="col-sm-4"></div>
                <div className="col-sm-6 w-25">
                    <label htmlFor="wd-quiz-details-options" className="fw-bold col-form-label">
                        Options
                    </label>
                </div>
            </div>
            <div className="form-group row">
                <div className="col-sm-4"></div>
                <div className="col-sm-6">
                    <input id="wd-quiz-shuffle" type="checkbox" defaultChecked={currentQuiz.shuffleAnswers}
                        onClick={() => dispatch(setQuiz({ ...updatingQuiz, shuffleAnswers: !currentQuiz.shuffleAnswers }))} /> <label htmlFor="wd-quiz-shuffle">Shuffle Answers</label><br /><br />
                    <input id="wd-quiz-time-limit" type="checkbox" defaultChecked={currentQuiz.timeLimit}
                        onClick={() => {dispatch(setQuiz({ ...updatingQuiz, timeLimit: !currentQuiz.timeLimit }));
                                        setTimeLimit(!timeLimit);}} /> <label htmlFor="wd-quiz-time-limit" className="me-3">Time Limit</label>
                    <input id="wd-quiz-minutes" type="number" className="input-sm" defaultValue={currentQuiz.minutes} disabled={!timeLimit}
                        onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, minutes: e.target.value }))} /> <label htmlFor="wd-quiz-minutes">Minutes</label><br /><br />
                    <input id="wd-show-correct-answers" type="checkbox" defaultChecked={currentQuiz.showCorrectAnswers}
                        onClick={() => dispatch(setQuiz({ ...updatingQuiz, showCorrectAnswers: !currentQuiz.showCorrectAnswers }))} /> <label htmlFor="wd-show-correct-answers">Show Correct Answers</label><br /><br />
                    <input id="wd-one-question-at-a-time" type="checkbox" defaultChecked={currentQuiz.oneQuestionAtATime}
                        onClick={() => dispatch(setQuiz({ ...updatingQuiz, oneQuestionAtATime: !currentQuiz.oneQuestionAtATime }))} /> <label htmlFor="wd-one-question-at-a-time">One Question At A Time</label><br /><br />
                    <input id="wd-webcam-required" type="checkbox" defaultChecked={currentQuiz.webcamRequired}
                        onClick={() => dispatch(setQuiz({ ...updatingQuiz, webcamRequired: !currentQuiz.webcamRequired }))} /> <label htmlFor="wd-webcam-required">Webcam Required</label><br /><br />
                    <input id="wd-lock-questions" type="checkbox" defaultChecked={currentQuiz.lockQuestions}
                        onClick={() => dispatch(setQuiz({ ...updatingQuiz, lockQuestions: !currentQuiz.lockQuestions }))} /> <label htmlFor="wd-lock-questions">Lock Questions</label><br /><br />
                </div>
            </div><br />
            <div className="form-group row">
                <div className="col-sm-4"></div>
                <div className="col-sm-6 pt-2 pb-2 border border-secondary rounded ">
                    <input id="wd-quiz-multiple-attempts" type="checkbox"
                        defaultChecked={currentQuiz.allowMultipleAttempts}
                        onClick={() => {
                            dispatch(setQuiz({ ...updatingQuiz, allowMultipleAttempts: !currentQuiz.allowMultipleAttempts }));
                            setAllowMultipleAttempts(!allowMultipleAttempts); } }/> <label htmlFor="wd-quiz-multiple-attempts" className="me-3">Allow Multiple Attempts</label>
                    <input id="wd-quiz-allowed-attempts" type="number" className="input-sm" defaultValue={currentQuiz.attemptsAllowed}
                        onChange={(e) => dispatch(setQuiz({...updatingQuiz, attemptsAllowed: e.target.value}))} 
                        disabled={!allowMultipleAttempts}/> <label htmlFor="wd-quiz-allowed-attempts">Allowed Attempts</label>
                </div>
            </div>
            <div className="mt-4 row">
                <div className="col-sm-4">
                    <label htmlFor="wd-assign" className="me-4 col-form-label float-end" >
                        Assign
                    </label>
                </div>
                <section className="border border-dark rounded col-sm-6 p-4">
                    <div className="form-group m-4">
                        <label htmlFor="wd-assign-to" className="fw-bold">Assign to</label><br />
                        <input type="text" id="wd-assign-to" className="form-control mt-2"
                            defaultValue={currentQuiz.assignTo} onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, assignTo: e.target.value }))} />
                    </div>
                    <div className="form-group ms-4 me-4">
                        <label htmlFor="wd-due-date" className="fw-bold">Due</label><br />
                        <input type="datetime-local" id="wd-due-date" className="form-control mt-2"
                            defaultValue={currentQuiz.due} onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, due: e.target.value }))} />
                    </div>
                    <div>
                        <div className="float-end mt-4 me-4">
                            <label htmlFor="wd-available-until" className="fw-bold">Until</label><br />
                            <input type="datetime-local" id="wd-available-until" className="form-control mt-2 mb-4"
                                defaultValue={currentQuiz.availableUntil} onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, availableUntil: e.target.value }))} />
                        </div>
                        <div className="float-end mt-4">
                            <label htmlFor="wd-available-from" className="fw-bold">Available From</label><br />
                            <input type="datetime-local" id="wd-available-from" className="form-control mt-2 mb-4"
                                defaultValue={currentQuiz.availableFrom} onChange={(e) => dispatch(setQuiz({ ...updatingQuiz, availableFrom: e.target.value }))} />
                        </div>
                    </div>
                </section>
            </div>
            < hr />
            <div className="float-end">
                <Link to={`/Kambaz/Courses/${cid}/Quizzes`} className="btn btn-light me-2">Cancel</Link> 
                <button className="btn btn-danger" data-bs-toggle="dropdown">Save</button>
                <ul className="dropdown-menu">
                    <li>
                        {currentQuiz._id === "new" ?
                            (<Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} className="dropdown-item"
                                onClick={() => createQuiz({ ...newQuiz, ...updatingQuiz })}>Save</Link>) :
                            (<Link to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} className="dropdown-item"
                                onClick={() => saveQuiz({ ...newQuiz, ...updatingQuiz })} >Save</Link>)}
                    </li>
                    <li>
                        {currentQuiz._id === "new" ?
                            (<Link to={`/Kambaz/Courses/${cid}/Quizzes`} className="dropdown-item"
                                onClick={() => createQuiz({ ...newQuiz, ...updatingQuiz, status: "published" })}>Save and Publish</Link>) :
                            (<Link to={`/Kambaz/Courses/${cid}/Quizzes`} className="dropdown-item"
                                onClick={() => saveQuiz({ ...newQuiz, ...updatingQuiz, status: "published" })} >Save and Publish</Link>)}

                    </li>
                </ul>
            </div>
            <br /><br />
        </form>
    );
}