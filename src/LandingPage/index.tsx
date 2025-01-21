import { Link } from "react-router-dom";
export default function LandingPage() {
    return (
        <div>
            <h1>Yatish Wutla</h1>
            <h2>NUID: 002320338</h2>
            <h2>CS5610 Spring 2025</h2>
            <h2>Links</h2>
            <ul>
                <li><Link to={"/Labs"}>Labs</Link></li>
                <li><Link to={"/Kambaz"}>Kambaz</Link></li>
                <li><Link to={"https://github.com/Yatish-w/Kambaz-react-web-app.git"}>Github repo</Link></li>
            </ul>
        </div>
    );
}