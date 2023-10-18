import axios from "axios";

export const registerUser = async (user) => {
    try{
        console.log(user);
        const res = await axios.post("http://localhost:8080/registration/",user);
        return res.data;
    }catch(err){
        console.log(err);
        return{
            error: err
        };
    }
}

export const logIn = async (user) => {
    try{
        console.log(user);
        const res = await axios.post("http://localhost:8080/signin/", user);
        return res.data;
    }catch(err){
        console.log(err);
        return{
            error: err
        };
    }
}

export const handleAuth = async (user) => {
    try{
        const stress = await axios.get('http://localhost:8080/checkAuth/',{
            headers:{
                'access-token' : localStorage.getItem("token")
            }
        })
        console.log(stress)
        return stress
    }catch(err){
        console.log(err)
    }
}