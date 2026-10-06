import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home"; 
import Login from "./pages/Login"; 
import Profile from "./pages/Profile";
import Register from "./pages/Register"; 
function App() {  
    return (    
    <>      
    <Navbar />      
    <Routes>        
        <Route path="/" element={<Home />} />        
        <Route path="/login" element={<Login />} />  
        <Route path="/profile" element={<Profile />} />      
        <Route path="/register" element={<Register />} />      
        </Routes>    
        </>  
        ); 
    } 
    export default App;