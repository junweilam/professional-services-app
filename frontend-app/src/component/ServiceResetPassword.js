import React, { useState } from 'react';

export const ServiceResetPassword = ({ isOpen, closeModal }) => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: VideoPlaybackQuality,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

    }

    return(
        <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 shadow-md rounded-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                Email:
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
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
    </div>
    )
}