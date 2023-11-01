import React, { useState, useEffect } from "react";
import { handleAuth } from "../features/apiCalls";
import { logOut, getAuthorization } from "../features/apiCalls";
import UnauthorizedUserPage from "../component/UnauthorizedUserPage";
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";

const AdminHome = () => {

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const closeSuccessModal = () => {
        setShowModal(false);
        window.location.href = './signin';
      };

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
        CheckToken(setShowModal)
        fetchUserAuthorization();
    }, []);



    return (
        <div>

       

        {isAuthorized ? (
            <>
                <p>admin home</p>
                <button onClick={handleLogout}> LOGOUT</button>
            </>
        ): (
            <UnauthorizedUserPage isAuthorized={isAuthorized}/>
        )   }

        <TokenExpireModal show={ showModal } onClose={closeSuccessModal}/>

        </div>

    );
}
export default AdminHome;