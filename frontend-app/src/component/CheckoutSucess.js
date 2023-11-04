import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Checkout Successful</h2>
        <p className="text-gray-600">Thank you for your order. Your payment was successful.</p>
        <Link to="/homepage"> 
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-4">
            Go Back to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
