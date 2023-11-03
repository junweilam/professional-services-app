import React from 'react';

const OrderHistoryCard = ({ order }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">OrderID: {order.orderid}</h3>
        <p className="text-gray-600">Service: {order.servicename}</p>
        <p className="text-gray-600">OrderTime: {order.ordertime}</p>
        <p className="text-gray-600">DateofService: {order.dos}</p>
        <p className="text-gray-600">Status: {order.status}</p>
      </div>
    </div>
  );
};

export default OrderHistoryCard;
