import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PayButton from "../component/PayButton";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../features/apiCalls";
import { getUserId } from "../features/apiCalls";
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";

const CartPage = () => {
  const location = useLocation();
  const cart = location.state.cart;
  const status = "Pending";
  const { updateQuantity, removeFromCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const token = { token: localStorage.getItem("token") };

  let userId;

  const closeExpiredModal = () => {
    setShowModal(false);
    window.location.href = './signin';
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [address, setAddress] = useState("");

  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const placeOrderHandler = async () => {
    try {
      try {
        const response = await getUserId(token);
        userId = response[0].UID;
      } catch (error) {
        console.error("Error getting user ID:", error);
      }

      if (userId) {
        const orderData = {
          userId,
          cart,
          selectedDate,
          address,
          status,
        };

        await placeOrder(orderData);

        setIsOrderConfirmed(true);

      } else {
        console.error("User ID is not defined. Cannot place the order.");
      }
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  useEffect(() => {
    CheckToken(setShowModal)
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-white p-8">
        <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-120 w-120 object-cover mr-2"
                  />
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
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                      min="1"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}


        <div className="mt-4">
          <div className="mb-4">
            <label htmlFor="selectedDate" className="block font-semibold">
              Select Delivery Date:
            </label>
            <input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block font-semibold">
              Delivery Address:
            </label>
            <textarea
              id="address"
              value={address}
              onChange={handleAddressChange}
              className="border border-gray-300 rounded-md p-2 h-20 w-150"
            />
          </div>
        </div>

        <p>Total Amount: ${totalAmount}</p>
        <div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={placeOrderHandler}
          >
            Confirm Order
          </button>
        </div>
        <div>
          {isOrderConfirmed && <PayButton />}
        </div>
      </div>
      <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
    </div>
  );
};

export default CartPage;
