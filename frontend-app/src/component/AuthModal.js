import React, { useState } from 'react';
import { authLogIn } from '../features/apiCalls';

export const AuthModal = ({ isOpen, closeModal, isAuthenticated, setIsAuthenticated, email }) => {

  const [formData, setFormData] = useState({
    otp: '',
  })

  console.log(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        window.location.href = './servicehome';
      }
      else if (response.message === "2FA Success User") {
        
        if (response.token) {
          localStorage.setItem('token', response.token)
        }
        window.location.href = './homepage';
      }
      else if (response.message === "2FA Fail") {
        setIsAuthenticated(false);
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
