import { IoEllipsisVertical } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteQuiz, updateQuiz } from "./quizzesReducer";
import { useState } from "react";
import * as client from "./client";

export default function QuizControlButtons({quiz} : {quiz: any}) {
  const [stat, setStat] = useState(null);
  const dispatch = useDispatch();

  const removeQuiz = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };
  const saveQuiz = async (quiz: any) => {
    const status = await client.updateQuiz(quiz);
    setStat(status);
    dispatch(updateQuiz(quiz));
  };
  return (
    <div className="float-end">
      <div className="dropdown d-inline me-1 float-end">
          <IoEllipsisVertical id="wd-quiz-context-btn" className="fs-4 ms-2" data-bs-toggle="dropdown" />
          <ul className="dropdown-menu">
            <li>
              <Link id="wd-quiz-edit-btn" className="dropdown-item" to={`/Kambaz/Courses/${quiz.course}/Quizzes/${quiz._id}/editor`}>
                <FaPencil className="text-primary"/> Edit
              </Link>
            </li>
            <li>
              <Link id="wd-quiz-delete-btn" className="dropdown-item" onClick={() => removeQuiz(quiz._id)}
                    to={`/Kambaz/Courses/${quiz.course}/Quizzes`}>
                <FaTrash className="text-danger"/> Delete
              </Link>
            </li>
            <li>
              <Link id="wd-quiz-publish-btn" className="dropdown-item"
                    onClick={() => saveQuiz({...quiz, status: quiz.status === "unpublished" ? "published" : "unpublished"})}
                    to={`/Kambaz/Courses/${quiz.course}/Quizzes`} >
                {quiz.status === "unpublished" ?
                  <GreenCheckmark /> : <FcCancel /> } {quiz.status === "unpublished" ? "Publish" : "Unpublish"}
              </Link>
            </li>
          </ul>
      </div>
      <div className="float-end">
        <Link id="wd-quiz-other-publish-btn"
              onClick={() => saveQuiz({...quiz, status: quiz.status === "unpublished" ? "published" : "unpublished"})}
              to={`/Kambaz/Courses/${quiz.course}/Quizzes`} >
              {quiz.status === "published" ? <GreenCheckmark /> : <FcCancel /> }
        </Link>
      </div>
    </div>
);
}