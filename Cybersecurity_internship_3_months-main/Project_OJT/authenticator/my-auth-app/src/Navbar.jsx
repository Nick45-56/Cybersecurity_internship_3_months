import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="glass navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
          <li><Link to="/howtouse">Procedure</Link></li>

        <li><Link to="/auth">Login</Link></li>
   
      </ul>
    </nav>
  );
}
