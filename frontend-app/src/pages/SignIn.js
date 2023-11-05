import React, { useState } from 'react';
import { logIn } from '../features/apiCalls';
import { AuthModal } from '../component/AuthModal';
import { ServiceResetPassword } from '../component/ServiceResetPassword';



const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [mistakeCount, setMistakeCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mistakeCount>= 5 ){
      return;
    }

    // Add your form submission logic here
    try {
      let formValues = { Email: formData.email, Password: formData.password }
      const response = await logIn(formValues);
      if (response.message === "service reset password") {
        setIsResetPassword(true);
      }
      else {
        setIsResetPassword(false);
        if (response.message === "Authentication Successful and AuthValue = 1") {

          //window.location.href = './adminhome';
          setIsModalOpen(true);
        }
        else if (response.message === "Authentication Successful and AuthValue = 2") {
          setIsModalOpen(true);
        }
        else if (response.message === "Authentication Successful and AuthValue = 3") {
          setIsModalOpen(true);

        } else if (response.error.response.status === 402) {
          // Handle other authentication cases (e.g., incorrect credentials)
          setMistakeCount(mistakeCount + 1); // increment mistake count
          setIsPasswordWrong(true);
          setIsEmailValid(false);
        } else if (response.error.response.status === 403) {
          setIsEmailValid(true);
          setIsPasswordWrong(false);
        }
      }
      setEmailValue(`${formData.email}`);

    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle token expiration: clear token and redirect to login page
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
          {
            isPasswordWrong && (
              <p className="text-red-500 text-sm text-center">Incorrect Password</p>
            )
          }
          {
            isEmailValid && (
              <p className="text-red-500 text-sm text-center">Invalid Email</p>
            )
          }
          {
            isPasswordWrong &&  mistakeCount >= 5 && (
                <p className="text-red-500 text-sm">Your account has been locked. Exceeded failed attempts. </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
          <p className="text-gray-600 text-sm mt-2">Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a></p>
        </form>
        <ServiceResetPassword isOpen={isResetPassword} closeModal={() => setIsResetPassword(false)} email={emailValue}/>
        <AuthModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} email={emailValue} />
      </div>

    </div>

  );
};

export default SignIn;
