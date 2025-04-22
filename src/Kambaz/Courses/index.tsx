import { Route, Navigate, Routes, useParams, useLocation } from "react-router";
import { useState, useEffect } from "react";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa6";
import PeopleTable from "./People/Table";
import * as client from "./client";
import Quizzes from "./Quizzes";
import QuizDetails from "./Quizzes/QuizDetails";
import QuizEditor from "./Quizzes/QuizEditor";
import TakeQuiz from "./Quizzes/TakeQuiz";
import Attempt from "./Quizzes/Attempt";
export default function Courses({ courses }: { courses: any[]; }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const fetchUsers = async (cid: any) => {
    const users = await client.findUsersForCourse(cid);
    setUsers(users);
  };
  const { uid } = useParams();
  useEffect(() => {
    fetchUsers(cid);
  }, [uid]);
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}</h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="People" element={<PeopleTable users={users} />} />
            <Route path="Quizzes" element={<Quizzes />} />
            <Route path="Quizzes/:qid" element={<QuizDetails />} />
            <Route path="Quizzes/:qid/editor" element={<QuizEditor />} />
            <Route path="Quizzes/:qid/start" element={<TakeQuiz />} />
            <Route path="Quizzes/:qid/attempt/:attemptNumber" element={<Attempt />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}