import { Link, useLocation, useParams } from "react-router-dom";
import "../styles.css";

type LinkType = string;

export default function CoursesNavigation() {
  const { pathname } = useLocation();
  const { cid } = useParams();
  const links: LinkType[] = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  
  const isActiveLink = (link: LinkType): boolean => {
    const currentPath = pathname.split("/")[4];
    return currentPath === link;
  };

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link: LinkType) => (
        <Link 
          key={link}
          to={`/Kambaz/Courses/${cid}/${link}`}
          className={`list-group-item border border-0 ${
            isActiveLink(link) ? "active" : "text-danger"
          }`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}