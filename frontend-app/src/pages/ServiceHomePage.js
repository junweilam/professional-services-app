import React, { useState, useEffect } from "react";
import ServiceOrderCard from "../component/ServiceOrderCard"; 
import { getServiceUserId, getServiceOrder, completeServiceOrder } from "../features/apiCalls";

const ServiceHomePage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders for the service using an API call
    const fetchOrders = async () => {
      try {
        const token = { token: localStorage.getItem("token") };
        const response1 = await getServiceUserId(token);
        let serviceId = await response1[0].ServiceID;

        const response2 = await getServiceOrder({serviceId}); 
        setOrders(response2);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    
  }, []);

  const handleCompleteOrder = async (orderid) => {
    try {
      const response = await completeServiceOrder({orderid});
      if (response) {
        const updatedOrders = orders.map((order) => {
          if (order.orderid === orderid) {
            return { ...order, status: "Completed" };
          }
          return order;
        });
        setOrders(updatedOrders);
      } else {
        console.error("Error completing the order:", response.error);
      }
    } catch (error) {
      console.error("Error completing the order:", error);
    }
  };

  // Sort orders based on status: "Pending" orders first, "Completed" orders last
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === "Completed" && b.status !== "Completed") return 1;
    if (a.status !== "Completed" && b.status === "Completed") return -1;
    return 0;
  });

  return (
    <div>
      <h2>Service Orders</h2>
      {sortedOrders.length === 0 ? (
        <p>Order List is empty.</p>
      ) : (
        sortedOrders.map((order) => (
          <ServiceOrderCard key={order.orderid} order={order} onCompleteOrder={handleCompleteOrder} />
        ))
      )}
    </div>
  );
};

export default ServiceHomePage;
