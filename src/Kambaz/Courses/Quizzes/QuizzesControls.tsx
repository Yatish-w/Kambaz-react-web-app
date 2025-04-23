import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function QuizzesControls({qid, cid} : {qid: any, cid: any}) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div className="wd-grades-controls text-nowrap padding ms-5 me-5">
            {currentUser.role === "FACULTY" ? 
                <span>
                    <Link id="wd-add-quiz-button" to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/editor`} 
                        className="btn btn-lg btn-danger me-1 float-end">
                        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }}/>
                        Quiz
                    </Link>
                </span> : ""}
            <input className="form-control w-25 form-control-lg" placeholder="Search for Quiz" />
            <br /><hr />
        </div>
    );
}