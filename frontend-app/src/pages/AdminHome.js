import React, { useState, useEffect } from "react";
import { getAuthorization } from "../features/apiCalls";
import UnauthorizedUserPage from "../component/UnauthorizedUserPage";
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";

const AdminHome = () => {

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const closeExpiredModal = () => {
        setShowModal(false);
        window.location.href = './signin';
      };

    const handleAddService = () => {
        window.location.href="./adminaddservices"
    }

    const handleAddUsers = () => {
        window.location.href="./adminaddusers"
    }

    const handleUpdateServices = () => {
      window.location.href = "./adminupdateservice"
    }

    useEffect(() => {
        async function fetchUserAuthorization() {
            try {
                let token = { token: localStorage.getItem("token") }
                if (token != null){
                    const response = await getAuthorization(token);
                    if (response.results == 1) {
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                    }
                }
                
            } catch (err) {
                console.log('API call error: ', err);
            }
        }
        CheckToken(setShowModal)
        fetchUserAuthorization();
    }, []);



    return (
        <div className="pt-32 p-8 text-center">
        {isAuthorized ? (
          <>
            <p className="text-3xl font-bold mb-6 pb-16">Admin Home</p>
            <div className="space-x-32">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddService}
              >
                Add Services
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddUsers}
              >
                Add Users
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdateServices}
              >
                Update Services
              </button>
            </div>
          </>
        ) : (
          <UnauthorizedUserPage isAuthorized={isAuthorized} />
        )}
  
        <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
      </div>

    );
}
export default AdminHome;