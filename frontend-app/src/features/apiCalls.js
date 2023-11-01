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

export const logOut = async () => {
    try{
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:8080/logout/",null , {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          });
          console.log(response)
          return response
    }catch(err){
        console.log("err from apicalls", err)
        throw err
    }
}

export const resendOTP = async (user) => {
    try{
        const res = await axios.post('http://localhost:8080/resend2fa/', user);
        return res.data;
    }catch(err){
        console.log(err);
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

export const payFunction = async (cart) => {
    try{
        console.log(cart);
        const res = await axios.post(`http://localhost:8080/create-checkout-session`, {
            cart,
        })
        return res.data;
    }catch(err){
        console.log(err);
        return{
            error: err
        };
    }
}

export const getServices = async (user) =>{
    try{
        const res = await axios.get('http://localhost:8080/get-services/');
        return res;

    }catch(err){
        console.log(err);
        return{
            error:err
        };
    }
}

export const placeOrder = async (orderData) => {
    try {
      // Make a POST request to your backend API endpoint to insert the data.
      const response = await axios.post('http://localhost:8080/create-order/', orderData);
  
      // Handle the response from the server.
      if (response.status === 200) {
        // Data inserted successfully. You can return the response data.
        return response.data;
      }
    } catch (error) {
      // Handle any errors, e.g., show an error message to the user.
      console.error('Error placing order:', error);
      throw error; // You can throw the error for further handling.
    }
}

export const getAuthorization = async (token) => {
    try{
        const res = await axios.post('http://localhost:8080/get-authorization/', token);
        return res.data;
    }catch(err){
        console.log(err);
        return{
            error:err
        }
    }
}