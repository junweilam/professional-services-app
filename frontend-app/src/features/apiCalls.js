import axios from "axios";

export const registerUser = async (user) => {
    try{
        console.log(user);
        const res = await axios.post("http://localhost:8080/registration/2/",user);
        return res.data;
    }catch(err){
        console.log(err);
        return{
            error: err
        };
    }
}