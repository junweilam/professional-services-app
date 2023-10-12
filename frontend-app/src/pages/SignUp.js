import React, { useId, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { registerUser } from '../features/apiCalls';

// const BASE_API_URL = "http://localhost:8081";


const SignUp = () => {

  const [emailStatus, setEmailStatus] = useState(true);
  const [contactStatus, setContactStatus] = useState(true);
  const [passwordStatus, setPasswordStatus] = useState(true);


  // State to hold form input values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    address: '',
    password: '',
    confirmPassword: '',
    authorization: '3',
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
    // if(formData.password !== formData.confirmPassword){
    //   alert("Password and Confirm Password do not match")
    //   return
    // }

    // passing confirm password to server



    // Once validated, you can send the data to your backend or perform any desired actions
    console.log(formData);
    try{
      let formValues = {LastName: formData.lastName, FirstName : formData.firstName, Email : formData.email, ContactNo : formData.contactNo, Address : formData.address,Password : formData.password, Authorization : formData.authorization, ConfirmPassword : formData.confirmPassword};
      const response = await registerUser(formValues, formData.id);

      console.log(response);

     
      if (response.error.response.status === 401) {
        setEmailStatus(false);
        setContactStatus(false);
        setPasswordStatus(true);
      } else if (response.error.response.status === 402) {
        setEmailStatus(true);
        setContactStatus(false);
        setPasswordStatus(true);
      } else if (response.error.response.status === 403) {
        setEmailStatus(false);
        setContactStatus(true);
        setPasswordStatus(true);
      } else if(response.error.response.status === 400){
        setPasswordStatus(false);
        setEmailStatus(true);
        setContactStatus(true);
      }
       else {
        setEmailStatus(true);
        setContactStatus(true);
        setPasswordStatus(true);
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
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="contactno">
              Contact Number
            </label>
            <input
              className={`${!contactStatus ? 'w-full px-4 py-2 border rounded-lg border-red-500' : `w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500`}`}
              type="tel"
              id="contactNo"
              name="contactNo"
              placeholder="Enter your contacts"
              value={formData.contactNo}
              onChange={handleInputChange}
              required
            />
            {!contactStatus && (
              <p className="text-red-500 text-sm">Contact Number has been used</p>
            )}
          </div>
          <div className={`mb-4`}>
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`${!emailStatus ? 'w-full px-4 py-2 border rounded-lg border-red-500' : `w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500`}`}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {!emailStatus && (
              <p className="text-red-500 text-sm">Email has been used</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="address">
              Address
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              type="textarea"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
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
              className={`${!passwordStatus ? 'w-full px-4 py-2 border rounded-lg border-red-500' : `w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500`}`}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            {!passwordStatus && (
              <p className="text-red-500 text-sm">Password do not match</p>
            )}
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
