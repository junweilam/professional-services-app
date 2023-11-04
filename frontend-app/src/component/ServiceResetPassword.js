import React, { useState } from 'react';
import { updatePassword } from '../features/apiCalls';
import { UpdatePasswordSuccessModal } from './UpdatePasswordSuccessModal';

export const ServiceResetPassword = ({ isOpen, closeModal, email }) => {

  const [formData, setFormData] = useState({
    email2: '',
    password2: '',
    confirmPassword2: '',
  })

  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [showUpdateSuccessModal, setUpdateShowSuccessModal] = useState(false);
  const [isBreached, setIsBreached] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const closeUpdateSuccessModal = () => {
    setUpdateShowSuccessModal(false);
    window.location.href = './signin';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formValues = { Email: email, Password: formData.password2, ConfirmPassword: formData.confirmPassword2 }
    const response = await updatePassword(formValues);
    if (response.error) {
      if (response.error.response.status === 400) {
        setIsPasswordMatch(false);
        setIsBreached(false);
      } else if (response.error.response.status === 409) {
        setIsPasswordMatch(true);
        setIsBreached(true);
      }
    } else {
      setUpdateShowSuccessModal(true);
      setIsBreached(false);
    }
  }

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 shadow-md rounded-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center">
                <label htmlFor="email2" className="block text-gray-600 text-sm font-medium mb-2">
                  Email:
                </label>
                <input
                  type="text"
                  id="email2"
                  name="email2"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-b ml-3 outline-none focus:border-blue-500"
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <label htmlFor="password2" className="block text-gray-600 text-sm font-medium mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  placeholder='Enter New Password'
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-b ml-3 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <label htmlFor="confirmPassword2" className="block text-gray-600 text-sm font-medium mb-2">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword2"
                  name="confirmPassword2"
                  value={formData.confirmPassword2}
                  placeholder='Confirm Password'
                  onChange={handleInputChange}
                  className={`${!isPasswordMatch ? `w-full px-4 py-2 border-b border-red-500 ml-3 outline-none focus:border-red-500` : `w-full px-4 py-2 border-b ml-3 outline-none focus:border-blue-500`}`}
                  required
                />
              </div>
              {!isPasswordMatch && (
                <p className="text-red-500 text-sm">Password do not match</p>
              )}
              {isBreached && (
                <p className="text-red-500 text-sm">This password has been exposed in data breaches. Please choose a different password</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 center-horizontal mt-5"
            >
              Update Password
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
      <UpdatePasswordSuccessModal show={showUpdateSuccessModal} onClose={closeUpdateSuccessModal} />
    </div>
  )
}