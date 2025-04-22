import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuiz } from "./quizzesReducer";
import "./quizzes.css";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizQuestionsEditor from "./QuizQuestionsEditor";
import GreenCheckmark from "./GreenCheckmark";
import { FcCancel } from "react-icons/fc";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const [quiz, setQuizState] = useState<any>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const toEdit = quizzes.find((q: any) => (q.course === cid && q._id === qid));
        if (toEdit) {
            dispatch(setQuiz(toEdit));
            setQuizState(toEdit);
        };
      }, [cid, qid]);

    if (!quiz) return null;
    return (
        <div id="wd-quiz-editor" className="m-5">
            {quizzes
                .filter((quiz: any) => (quiz.course === cid && quiz._id === qid))
                .map((quiz: any) => (
                <div>
                    <div className="float-end">
                        <strong className="fs-5 me-3">Points {quiz.points ? quiz.points : 0}</strong>
                        {quiz.status === "unpublished" ? <FcCancel className="fs-5 mb-2 me-1"/> : <GreenCheckmark />}
                        <span className="text-muted fs-5">{quiz.status === "unpublished" ? "Not Published" : "Published"}</span>
                    </div><br /><br /><hr />
                </div>
            ))}
            <div>
                <ul className="nav nav-tabs mt-5" id="wd-quiz-editor-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="details-tab" data-bs-toggle="tab"
                            data-bs-target="#details" type="button" role="tab" aria-controls="details" aria-selected="true">
                            Details
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="questions-tab" data-bs-toggle="tab"
                            data-bs-target="#questions" type="button" role="tab" aria-controls="questions" aria-selected="false">
                            Questions
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="wd-quiz-editor-tabs-content">
                    <div className="tab-pane fade show active" id="details" role="tabpanel" aria-labelledby="details-tab">
                        <QuizDetailsEditor />
                    </div>
                    <div className="tab-pane fade" id="questions" role="tabpanel" aria-labelledby="questions-tab">
                        <QuizQuestionsEditor />
                    </div>
                </div>
            </div>
        </div>
    );
}