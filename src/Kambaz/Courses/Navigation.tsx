import { Link, useLocation, useParams } from "react-router-dom";
import "../styles.css";

export default function CoursesNavigation() {
  const { pathname } = useLocation();
  const { cid } = useParams(); // Get the course ID from URL params
  
  // Define which links are internal vs external
  const internalLinks = ["Home", "Modules", "Assignments", "Quizzes", "Grades", "People"];
  
  // Define external links with their URLs
  const externalLinks = {
    "Piazza": "https://piazza.com/",
    "Zoom": "https://zoom.us/"
  };
  
  // Combine all links for rendering
  const allLinks = [...internalLinks, ...Object.keys(externalLinks)];
  
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {allLinks.map((link) => {
        // Check if this is an external link
        const isExternal = Object.keys(externalLinks).includes(link);
        
        if (isExternal) {
          // Return external link (opens in new tab)
          return (
            <a 
              key={link}
              href={externalLinks[link as keyof typeof externalLinks]}
              target="_blank"
              rel="noopener noreferrer"
              className={`list-group-item border border-0 text-danger`}
            >
              {link}
            </a>
          );
        } else {
          // Return internal link (React Router Link)
          return (
            <Link 
              key={link}
              to={`/Kambaz/Courses/${cid}/${link}`}
              className={`list-group-item border border-0 ${pathname.includes(`/${link}`) ? "active" : "text-danger"}`}
            >
              {link}
            </Link>
          );
        }
      })}
    </div>
  );
}