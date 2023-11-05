import React, { useState, useEffect } from 'react';
import { authLogIn } from '../features/apiCalls';
import { resendOTP } from '../features/apiCalls';

export const AuthModal = ({ isOpen, closeModal, isAuthenticated, setIsAuthenticated, email }) => {


  const [formData, setFormData] = useState({
    otp: '',
  })

  const [is2FA, setIs2FA] = useState(true);
  const [isResent, setIsResent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isCountdown, setIsCountdown] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if(countdown > 0){
      setIsExpired(false);
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown -1);
      },1000);
 
      return () => {
        clearInterval(countdownInterval);
      };
    }else{
      setIsExpired(true);
      setIs2FA(true);
      setIsResent(false);
    }
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(300); // Reset the countdown to 60 seconds
  };

  useEffect(() => {
    if(isOpen){
      startCountdown();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleResendOTP = async (e) => {
    e.preventDefault();

    try {
      let OTPValues = { Email: email }
      const response = await resendOTP(OTPValues);
      if (response.message === "Resent") {
        setIs2FA(true);
        setIsResent(true);
        setIsExpired(false);
        setIsCountdown(true);
        setCountdown(10);
      }

    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIs2FA(true);
    setIsResent(false);
    setIsExpired(false);

    try {
      let formValues = { OTP: formData.otp, Email: email }
      const response = await authLogIn(formValues);
      if (response.message === "2FA Success Admin") {

        if (response.token) {
          localStorage.setItem('token', response.token)
        }

        window.location.href = './adminhome';
      }
      else if (response.message === "2FA Success Service") {

        if (response.token) {
          localStorage.setItem('token', response.token)
        }
        window.location.href = './servicehomepage';
      }
      else if (response.message === "2FA Success User") {

        if (response.token) {
          localStorage.setItem('token', response.token)
        }
        window.location.href = './homepage';
      }
      else if (response.error.response.status === 401) {
        setIs2FA(false);
        setIsResent(false);
        setIsExpired(false);
        setIsCountdown(false);
      }
      else if (response.error.response.status === 400){
        setIsExpired(true);
        setIsCountdown(false);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 shadow-md rounded-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-600 text-sm font-medium mb-2">
                Enter OTP:
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border-b ml-3 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            {isCountdown && (
              <p>OTP expires in {countdown} seconds</p>
            )
            }
            
            {!is2FA && (
              <p className="text-red-500 text-sm">OTP is incorrect. Click <a onClick={handleResendOTP} className="text-blue-500 underline hover:cursor-pointer">Here</a> for new OTP</p>
            )}
            {
              isResent && (
                <p>New OTP is resent</p>
              )
            }
            {
              isExpired && (
                <p className="text-red-500 text-sm">OTP has expired. Click <a onClick={handleResendOTP} className="text-blue-500 underline hover:cursor-pointer">Here</a> for new OTP</p>
              )
            }
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 center-horizontal mt-5"
            >
              Verify OTP
            </button>
          </form>
          <button
            onClick={closeModal}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 center-horizontal mt-5"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

// export default AuthModal;
