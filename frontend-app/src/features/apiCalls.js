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

export const authLogIn = async (user) => {
    try{
        console.log(user);
        const res = await axios.post("http://localhost:8080/2fa/", user);
        return res.data;
    }catch(err){
        console.log(err);
        return{
            error: err
        };
    }
}

export const addServices = async (service) => {
    try{
        console.log(service);
        const res = await axios.post("http://localhost:8080/adminaddservices/", service);
        return res.data;
    }catch(err){
        console.log(err);
        return{
            error: err
        };
    }
}