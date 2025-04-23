import QuizzesControls from "./QuizzesControls";
import QuizControlButtons from "./QuizControlButtons";
import { BsGripVertical } from "react-icons/bs";
import { IoRocketOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setQuizzes, updateQuiz, updateNewQuiz } from "./quizzesReducer";
import * as client from "./client";

export default function Quizzes() {
    const { cid } = useParams();
    const { quizzes, newQuiz } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();
    const initializedRef = useRef(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const quizzes = await client.findQuizzesForCourse(cid as string);
            dispatch(setQuizzes(quizzes));
        };
        fetchQuizzes();
    }, [cid, dispatch]);
    
    useEffect(() => {
        if (initializedRef.current) return;
        
        const saveQuiz = async (quiz: any) => {
            await client.updateQuiz(quiz);
            dispatch(updateQuiz(quiz));
        };
        
        if (newQuiz && cid) {
            saveQuiz({...newQuiz, course: cid, title: `Quiz ${quizzes.length}`});
            dispatch(updateNewQuiz({...newQuiz, course: cid, title: `Quiz ${quizzes.length}`}));
            initializedRef.current = true;
        }
    }, [cid, dispatch, newQuiz, quizzes.length]);
    
    return (
        <div id="wd-quizzes" className="ms-1 me-1">
            <QuizzesControls qid={newQuiz._id} cid={cid} />
            <ul id="wd-assignments" className="list-group rounded-0 ms-5 me-5">
                <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                    <BsGripVertical className="me-2 fs-3" />
                    Assignment Quizzes
                    </div>
                    {(currentUser.role === "STUDENT") && (quizzes.filter((q: any) => q._id !== "new").length !== 0) &&
                        (quizzes.filter((q: any) => q._id !== "new" && q.status === "published").length === 0)
                            && <h3 className="ps-3 text-danger">No quizzes have been published for this course.</h3>}
                    {quizzes.filter((q: any) => q._id !== "new").length === 0 ? 
                        <p className="ps-3 text-danger">
                            No quizzes have been created for this course. 
                            {(currentUser.role === "FACULTY") && " Click the '+ Quiz' button to add a quiz."} 
                        </p>
                        :
                        (currentUser.role === "STUDENT" ?
                            <ul className="wd-lessons list-group rounded-0">
                                {quizzes
                                .filter((quiz: any) => (quiz.course === cid && quiz._id !== "new" && quiz.status === "published"))
                                .map((quiz: any) => (
                                    <li className="wd-lesson list-group-item p-3 ps-1 border-left-success">
                                        <div className="wd-flex-row-container">
                                            <IoRocketOutline className="ms-3 mt-3 me-3 fs-2 text-success" />
                                            <div className="wd-flex-grow-1">
                                                <Link to={`/Kambaz/Courses/${quiz.course}/Quizzes/${quiz._id}`} className="text-black link-underline link-underline-opacity-0">
                                                    {quiz.title}
                                                </Link>
                                                <br/>
                                                <strong>{(new Date(quiz.availableUntil) < new Date())  && "Closed"}</strong>
                                                <strong>{(new Date(quiz.availableFrom) <= new Date()) && (new Date() <= new Date(quiz.availableUntil))  && "Available"}</strong> 
                                                <strong>{(new Date(quiz.availableFrom) > new Date()) && "Not Available Until"}</strong> {(new Date(quiz.availableFrom) > new Date()) && 
                                                    new Date(quiz.availableFrom).toDateString()} | <strong> Due</strong> {new Date(quiz.due).toDateString()} | {quiz.points ? 
                                                    quiz.points : 0} pts | {quiz.questions ? quiz.questions.length : 0} Questions {currentUser.role === "STUDENT" && " |" && <strong>| Last Score</strong>} {(currentUser.quizAttempts.filter((qa: any) =>
                                                    qa.course === quiz.course && qa.quiz === quiz._id).length !== 0 && currentUser.role === "STUDENT") ? 
                                                    (currentUser.quizAttempts.filter((qa: any) =>
                                                        qa.course === quiz.course && qa.quiz === quiz._id).at(-1).grade + "/" + quiz.points) :
                                                    currentUser.role === "STUDENT" && "NA"}
                                            </div>
                                            {currentUser.role === "FACULTY" ? 
                                                <QuizControlButtons quiz={quiz}/> : ""}
                                    </div>
                                    </li>
                                ))}
                            </ul>
                            :
                            <ul className="wd-lessons list-group rounded-0">
                            {quizzes
                            .filter((quiz: any) => (quiz.course === cid && quiz._id !== "new"))
                            .map((quiz: any) => (
                                <li className="wd-lesson list-group-item p-3 ps-1 border-left-success">
                                    <div className="wd-flex-row-container">
                                        <IoRocketOutline className="ms-3 mt-3 me-3 fs-2 text-success" />
                                        <div className="wd-flex-grow-1">
                                            <Link to={`/Kambaz/Courses/${quiz.course}/Quizzes/${quiz._id}`} className="text-black link-underline link-underline-opacity-0">
                                                {quiz.title}
                                            </Link>
                                            <br/>
                                            <strong>{(new Date(quiz.availableUntil) < new Date())  && "Closed"}</strong>
                                            <strong>{(new Date(quiz.availableFrom) <= new Date()) && (new Date() <= new Date(quiz.availableUntil))  && "Available"}</strong> 
                                            <strong>{(new Date(quiz.availableFrom) > new Date()) && "Not Available Until"}</strong> {(new Date(quiz.availableFrom) > new Date()) && 
                                                new Date(quiz.availableFrom).toDateString()} | <strong> Due</strong> {new Date(quiz.due).toDateString()} | {quiz.points ? 
                                                quiz.points : 0} pts | {quiz.questions ? quiz.questions.length : 0} Questions {currentUser.role === "STUDENT" && " |" && <strong>Last Score</strong>} {(currentUser.quizAttempts.filter((qa: any) =>
                                                qa.course === quiz.course && qa.quiz === quiz._id).length !== 0 && currentUser.role === "STUDENT") ? 
                                                (currentUser.quizAttempts.filter((qa: any) =>
                                                    qa.course === quiz.course && qa.quiz === quiz._id).at(-1).grade + "/" + quiz.points) :
                                                currentUser.role === "STUDENT" && "NA"}
                                        </div>
                                        {currentUser.role === "FACULTY" ? 
                                            <QuizControlButtons quiz={quiz}/> : ""}
                                </div>
                                </li>
                            ))}
                            </ul>
                        )
                    }
                </li>
            </ul>
        </div>
    );
}
