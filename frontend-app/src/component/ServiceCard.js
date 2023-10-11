import React from 'react';

const ServiceCard = ({ service, addToCart }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">{service.title}</h3>
      <p className="text-gray-600">{service.description}</p>
      <button
        onClick={() => addToCart(service)}
        className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ServiceCard;
