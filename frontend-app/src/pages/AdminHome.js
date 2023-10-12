import React from "react";

const AdminHome = () => {
    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Redirect the user to the login page
        window.location.href = '/login';
    }

    return(
        <>
        <p>admin home</p>

        <button onClick={handleLogout}> LOGOUT</button>
        </>
    );
}
export default AdminHome;