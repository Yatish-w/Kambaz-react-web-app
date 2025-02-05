import { Link } from "react-router-dom";
export default function LandingPage() {
    return (
        <div className="d-flex justify-content-center">
            <div>
            <h1>Yatish Wutla</h1>
            <h3>NUID: 002330338</h3>
            <h3>CS5610 Spring 2025</h3>
            <h3>Links</h3>
            <ul className="list-group">
                <li className="list-group-item"><Link to={"/Labs"}>Labs</Link></li>
                <li className="list-group-item"><Link to={"/Kambaz"}>Kanbas</Link></li>
                <li className="list-group-item"><Link to={"https://github.com/Yatish-w/Kambaz-react-web-app.git"}>Github repo</Link></li>
            </ul>
            </div>
        </div>
    );
}