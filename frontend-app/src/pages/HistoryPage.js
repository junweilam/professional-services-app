import React, { useState, useEffect } from "react";
import { getUserId } from "../features/apiCalls";
import {
  getOrderHistory,
  getAuthorization,
  getService,
} from "../features/apiCalls";
import OrderHistoryCard from "../component/OrderHistoryCard";
import UnauthorizedUserPage from "../component/UnauthorizedUserPage";
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken } from "../features/CheckToken";

const HistoryPage = () => {
  const [orderhistory, setOrderhistory] = useState([]);
  const token = { token: localStorage.getItem("token") };
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const id = 5;

  const closeExpiredModal = () => {
    setShowModal(false);
    window.location.href = './signin';
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUserId(token);
        let userId = await response[0].UID;

        const response2 = await getOrderHistory({ userId });
        setOrderhistory(response2);

        const updatedOrderHistory = await Promise.all(
          response2.map(async (order) => {
            let sid = await order.serviceid;
            const servicenameResponse = await getService({ sid });
            const servicename = servicenameResponse[0].ServiceName;
            return { ...order, servicename }; // Replace serviceid with servicename
          })
        );

        setOrderhistory(updatedOrderHistory);
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    }

    async function fetchUserAuthorization() {
      try {
        let token = { token: localStorage.getItem("token") }
        if (token != null) {
          const response = await getAuthorization(token);
          if (response.results == 3) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        }


      } catch (err) {
        console.error('API call error: ', err);
      }
    }

    // Call fetchData to retrieve the order history
    fetchData();
    CheckToken(setShowModal);
    fetchUserAuthorization();



    // You can uncomment and modify the following section for user authorization if needed
    // async function fetchUserAuthorization() {
    //   try {
    //     let token = { token: localStorage.getItem("token") };
    //     const response = await getAuthorization(token);
    //     if (response.results === 3) {
    //       setIsAuthorized(true);
    //     } else {
    //       setIsAuthorized(false);
    //     }
    //   } catch (err) {
    //     console.error("API call error: ", err);
    //   }
    // }

    // Call fetchUserAuthorization if needed
  }, []);

  return (
    isAuthorized ? (
      <div>
        <h2>Order History</h2>
        {orderhistory.length === 0 ? (
          <p>History is empty.</p>
        ) : (
          orderhistory.map((order) => (
            <OrderHistoryCard key={order.orderid} order={order} />
          ))
        )}
        <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
      </div>
    ) : (
      <UnauthorizedUserPage isAuthorized={isAuthorized} />
    )

  );
};

export default HistoryPage;
