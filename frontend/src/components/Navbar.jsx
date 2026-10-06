import { Link } from "react-router-dom"; 
function Navbar() {  
    return (    
    <nav className="navbar">      
    <Link to="/" className="logo">MERN AUTH</Link>      
    <Link to="/login" className="nav-login">Login</Link>    
    </nav>  
    ); 
} 
export default Navbar;