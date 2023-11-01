import React, { useState, useEffect } from "react";
import { handleAuth } from "../features/apiCalls";
import { logOut, getAuthorization } from "../features/apiCalls";
import UnauthorizedUserPage from "../component/UnauthorizedUserPage";

const AdminHome = () => {

    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleLogout = async () => {
        let token = { token: localStorage.getItem("token") }
        console.log(token);
        try {
            const response = await logOut(token)
            console.log(response)
            if (response.message == "Logout successful") {
                // Clear the token from localStorage
                localStorage.removeItem('token');
                // Redirect the user to the login page
                window.location.href = '/signin';
            }else{
                console.error("Unexpected Server Responese:", response)
            }

        } catch (err) {
            console.log("err in logout", err)
        }

    }

    const handleClick = async () => {
        let token = { token: localStorage.getItem("token") }
        if (!token) {
            window.location.href = "/homepage";
            return;
        }
        try {
            // to check if the token is valid
            const response = await (handleAuth(token))
        } catch (err) {
            console.log(err)
            console.log("token no longer exist, please relog in")
            window.location.href = "/homepage";
        }
    }

    useEffect(() => {
        async function fetchUserAuthorization() {
            try {
                let token = { token: localStorage.getItem("token") }
                if (token != null){
                    const response = await getAuthorization(token);
                    console.log(response);
                    if (response.results == 1) {
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                    }
                }
                
            } catch (err) {
                console.log('API call error: ', err);
            }
        }
        fetchUserAuthorization();
    }, []);



    return (

        isAuthorized ? (
            <>
                <p>admin home</p>
                <button onClick={handleClick}> check auth</button>
                <button onClick={handleLogout}> LOGOUT</button>
            </>
        ): (
            <UnauthorizedUserPage isAuthorized={isAuthorized}/>
        )   
    );
}
export default AdminHome;