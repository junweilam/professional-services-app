import React, {useState} from 'react';
import {authLogIn} from '../features/apiCalls';

export const AuthModal = ({ isOpen, closeModal, isAuthenticated, setIsAuthenticated }) => {

    const [formData, setFormData] = useState({
        otp: '',
    })

    const handleInputChange = (e) => {
        const {name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            let formValues = {OTP: formData.otp}
            const response = await authLogIn(formValues);
            if(response.message === "2FA Success Admin"){
                window.location.href = './ adminhome';
            }
            else if(response.message === "2FA Success Service"){
                window.location.href = './servicehome';
            }
            else if(response.message === "2FA Success User"){
                window.location.href = './homepage';
            }
            else if(response.message === "2FA Fail"){
                setIsAuthenticated(false);
            }
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
        <form onSubmit={handleSubmit}>
        <label htmlFor="otp">Enter OTP:</label>
        <input
          type="text"
          id="otp"
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          placeholder="Enter OTP"
        />
        <button type="submit">Verify OTP</button>
      </form>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    );
};

// export default AuthModal;
