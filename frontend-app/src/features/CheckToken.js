import { handleAuth } from "./apiCalls";
import { logOut } from "./apiCalls";

export const CheckToken = async (modal) => {

    let token = { token: localStorage.getItem("token") }
    if (!token) {
        window.location.href = "/homepage";
        return;
    }
    try {
        // to check if the token is valid
        const response = await (handleAuth(token))
    } catch (err) {
        try{
            const res = await(logOut(token))
        }catch(err){
            console.log(err)
        }
        localStorage.removeItem('token');
        modal(true)
    }

}