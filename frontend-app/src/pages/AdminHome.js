import axios from "axios";
import React from "react";
import { handleAuth } from "../features/apiCalls";

const AdminHome = () => {
    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Redirect the user to the login page
        window.location.href = '/login';
    }

    const handleClick = async () => {
        let token = {token: localStorage.getItem("token")}
        if(!token){
            window.location.href = "/homepage";
            return;
        }
        try{
            // to check if the token is valid
            const response = await(handleAuth(token))
        }catch(err){
            console.log(err)
            console.log("token no longer exist, please relog in")
            window.location.href = "/homepage";
        }
        
       
    }

    

    return(
        <>
        <p>admin home</p>
        <button onClick={handleClick}> check auth</button>
        <button onClick={handleLogout}> LOGOUT</button>
        </>
    );
}
export default AdminHome;