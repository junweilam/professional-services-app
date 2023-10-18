import React from 'react';

const Cart = ({ cart, removeFromCart }) => {
  return (
    <div className="cart-dropdown">
      {cart.map((service) => (
        <div key={service.id} className="cart-item">
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <p className="text-gray-600">{service.description}</p>
          <p className="text-gray-600">Price: ${service.price}</p> 
          <button onClick={() => removeFromCart(service)} className="bg-red-500 text-white py-2 rounded-lg hover-bg-red-600 transition duration-300">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
