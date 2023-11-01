import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PayButton from "../component/PayButton";
import { useCart } from '../context/CartContext';
import { placeOrder } from '../features/apiCalls';
import { getUserId } from "../features/apiCalls";

const CartPage = () => {
  const location = useLocation();
  const cart = location.state.cart;
  const status = 'Pending';
  //const userId = 1;
  const { updateQuantity, removeFromCart } = useCart();
  const token = { token: localStorage.getItem("token") }

  let userId;

  // Define state for date and address
  const [selectedDate, setSelectedDate] = useState('');
  const [address, setAddress] = useState('');

  // Calculate the total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handler for date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handler for address input
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const placeOrderHandler = async () => {
    try {
      // Use the getUserId function to obtain the user ID
      try {
        const response = await getUserId(token);
        console.log(response[0].UID);
        userId = response[0].UID;
        console.log(`User ID: ${userId}`);
      } catch (error) {
        console.error('Error getting user ID:', error);
      }

      // Ensure userId is defined before proceeding
      if (userId) {
        const orderData = {
          userId,
          cart,
          selectedDate,
          address,
          status,
        };

        // Make the API call to place the order.
        const response = await placeOrder(orderData);

        // Handle the response as needed. For example, show a success message to the user.
        console.log('Response from server:', response);
        // You can also reset the cart and other state as needed.
      } else {
        console.error('User ID is not defined. Cannot place order.');
      }
    } catch (error) {
      // Handle errors, e.g., show an error message to the user.
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white p-8">
        <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <img src={item.image} alt={item.title} className="h-120 w-120 object-cover mr-2" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <div className="mr-4">
                    <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                    <input
                      type="number"
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      min="1"
                    />
                  </div>
                  <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-600">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Date selection and address input */}
        <div className="mt-4">
          <div className="mb-4">
            <label htmlFor="selectedDate" className="block font-semibold">Select Delivery Date:</label>
            <input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block font-semibold">Delivery Address:</label>
            <textarea
              id="address"
              value={address}
              onChange={handleAddressChange}
              className="border border-gray-300 rounded-md p-2 h-20 w-150"
            />
          </div>
        </div>

        <p>Total Amount: ${totalAmount}</p>
        <button onClick={placeOrderHandler}>Place Order</button>
        {/* <PayButton onClick={placeOrderHandler} /> */}
      </div>
    </div>
  );
};

export default CartPage;
