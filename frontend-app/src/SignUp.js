import React, { useId, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { registerUser } from './features/apiCalls';

const BASE_API_URL = "http://localhost:8081";


const SignUp = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({
    id: 2,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation here (e.g., check for password match)

    // Once validated, you can send the data to your backend or perform any desired actions
    console.log(formData);
    try{
      let formValues = {LAST_NAME: formData.lastName, FIRST_NAME : formData.firstName, EMAIL : formData.email, PASSWORD : formData.password};
      const success = await registerUser(formValues, formData.id);
      if (success){
        console.log("added into database");
      }
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
