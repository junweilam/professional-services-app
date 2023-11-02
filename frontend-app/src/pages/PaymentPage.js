import React, { useState, useEffect } from 'react';
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";

const PaymentPage = () => {
  const [showModal, setShowModal] = useState(false);

  const closeExpiredModal = () => {
    setShowModal(false);
    window.location.href = './signin';
  };

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Implement your payment processing logic here, e.g., with Stripe or another payment service.
    // You would typically send the paymentInfo to your server and handle the payment there.
  };

  useEffect(() => {
    CheckToken(setShowModal)
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-white p-8">
        <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
        <form onSubmit={handlePaymentSubmit}>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-gray-600 text-sm font-medium mb-2">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handlePaymentInfoChange}
              placeholder="Enter card number"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="expiryDate" className="block text-gray-600 text-sm font-medium mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handlePaymentInfoChange}
              placeholder="MM/YY"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cvv" className="block text-gray-600 text-sm font-medium mb-2">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handlePaymentInfoChange}
              placeholder="CVV"
              className="w-full px-4 py-2 border rounded-lg outline-none focus-border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Pay Now
          </button>
        </form>
      </div>
      <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
    </div>
  );
};

export default PaymentPage;
