import React from 'react';

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Checkout Successful</h2>
        <p className="text-gray-600">Thank you for your order. Your payment was successful.</p>
      </div>
    </div>
  );
}

export default CheckoutSuccess;