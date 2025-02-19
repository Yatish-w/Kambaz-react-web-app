import { Link, useLocation } from "react-router-dom";
export default function AccountNavigation() {
    const { pathname } = useLocation();
    const links = ["Signin", "Signup", "Profile"];
    return (
        <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
            {links.map((link) => (
                <Link to={`./${link}`}
                    className={`list-group-item border border-0 ${pathname.includes(link) ? "active" : "text-danger"}`}>
                    {link}
                </Link>
            ))}
        </div>
    );
}  
