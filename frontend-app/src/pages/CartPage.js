import React from 'react';
import { useLocation } from 'react-router-dom';
import PayButton from "../component/PayButton";
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const location = useLocation();
  const cart = location.state.cart;

  const { updateQuantity, removeFromCart } = useCart();

  // Calculate the total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
        <div className="mt-4">
          <p>Total Amount: ${totalAmount}</p>
          <PayButton />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
