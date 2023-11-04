import React from 'react';

const ServiceOrderCard = ({ order, onCompleteOrder  }) => {
  const handleCompleteOrder = () => {
    onCompleteOrder(order.orderid);
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">Order ID: {order.orderid}</h3>
        <p className="text-gray-600">ServiceID: {}</p>
        <p className="text-gray-600">Date of Service: {order.DateofService}</p>
        <p className="text-gray-600">Delivery Address: {order.add}</p>
        <p className="text-gray-600">Status: {order.status}</p>
        <button
          onClick={handleCompleteOrder}
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mt-5 transition duration-300"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default ServiceOrderCard;