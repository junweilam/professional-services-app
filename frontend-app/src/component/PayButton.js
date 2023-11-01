import axios from "axios";
import { useSelector } from "react-redux";
import { payFunction, url } from "../features/apiCalls";
import { useLocation } from 'react-router-dom';


const PayButton = () => {

    const location = useLocation();
    const cart = location.state.cart;

    const handleCheckout = async (e) => {
        // console.log(cart);
        // axios.post(`http://localhost:8080/stripe/create-checkout-session`, {
        //     cart,
        // }).then((res) => {
        //     if (res.data.url) {
        //         window.location.href = res.data.url;
        //     }
        // }).catch((err) => console.log(err.message));
        const response = await payFunction(cart);
        console.log("response url:",response.url);
        console.log("response:",response);
        if(response){
            window.location.href = response.url
        }
    }
    

    return (
        <>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2" onClick={handleCheckout}>Check Out</button>
        </>
    );
};

export default PayButton;
