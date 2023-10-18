import React, { useState } from 'react';
import { logIn } from '../features/apiCalls';




const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add your form submission logic here
    console.log(formData);
    try{

  

      let formValues = {Email: formData.email, Password: formData.password}
      const response = await logIn(formValues);
      console.log(response);
      if (response.message === "Authentication Successful and AuthValue = 1"){
        if(response.token){
          localStorage.setItem('token', response.token)
          window.location.href = './adminhome';
        }
       
      }
      else if (response.message === "Authentication Successful and AuthValue = 2"){
        window.location.href = './servicehome';
      }
      else if (response.message === "Authentication Successful and AuthValue = 3"){
        window.location.href = './userhome';
      }else {
        // Handle other authentication cases (e.g., incorrect credentials)
        console.log('Authentication failed');
      }
    }catch(err){
      if (err.response && err.response.status === 401) {
        // Handle token expiration: clear token and redirect to login page
        console.log('Authentication token expired. Logging out...');
        localStorage.removeItem('token'); // Clear token from localStorage
        window.location.href = '/signin'; // Redirect to the login page
      } else {
        console.error(err);
      }
    }
  };


  

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
          <p className="text-gray-600 text-sm mt-2">Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a></p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
