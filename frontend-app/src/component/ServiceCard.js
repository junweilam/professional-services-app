import React from 'react';

const ServiceCard = ({ service, addToCart }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-gray-600">{service.description}</p>
        <p className="text-gray-600">Price: ${service.price}</p> 
        <button
          onClick={() => addToCart(service)}
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add to Cart
        </button>
      </div>
      <div className="w-16">
        <img
          src={service.image} 
          alt={service.title}
          className="h-16 w-16 object-cover rounded-md"
        />
      </div>
    </div>
  );
};

export default ServiceCard;
