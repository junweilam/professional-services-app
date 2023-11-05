import React, { useState, useEffect } from 'react';
import { addServices, getAuthorization } from '../features/apiCalls';
import { AddServiceSuccess } from '../component/AddServiceSuccess';
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken } from "../features/CheckToken";
import UnauthorizedUserPage from '../component/UnauthorizedUserPage';



const AdminAddServices = () => {

  const [isServiceIdUsed, setIsServiceIdUsers] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    address: '',
    price: '',
    // Add more fields as needed
  });

  const closeExpiredModal = () => {
    setShowModal(false);
    window.location.href = './signin';
  };

  // Close Success Modal and redirect to Sign In page
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.href = './adminhome';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    async function fetchUserAuthorization() {
      try {
        let token = { token: localStorage.getItem("token") }
        if (token != null) {
          const response = await getAuthorization(token);
          if (response.results === 1) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        }
      } catch (err) {
        console.error('API call error: ', err);
      }
    }
    CheckToken(setShowModal);
    fetchUserAuthorization();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // You can perform actions to create something with the formData here.
    // For this example, we'll just log the data.
    try {
      let formValues = { ServiceID: formData.id, ServiceName: formData.name, ServiceDesc: formData.description, ServiceAdd: formData.address, Price: formData.price };
      const response = await addServices(formValues);
      if (response.error) {
        if (response.error.response.status === 400) {
          setIsServiceIdUsers(true);
        }
        else {
          setIsServiceIdUsers(false);
        }
      }
      else if (response.message === "success") {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (

    isAuthorized ? (
      <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Services</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              Service ID:
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className={`${isServiceIdUsed ? 'w-full px-4 py-2 border rounded-lg border-red-500' : `mt-1 p-2 w-full rounded border-black border-2 focus:ring-indigo-500 focus:border-indigo-500`}`}
              required
            />
            {isServiceIdUsed && (
              <p className="text-red-500 text-sm">Service ID already exist</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Service Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full rounded border-black border-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full rounded border-black border-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address:
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full rounded border-black border-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price ($):
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full rounded border-black border-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Create
            </button>
          </div>
        </form>
        <AddServiceSuccess show={showSuccessModal} onClose={closeSuccessModal} />
        <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
      </div>
    ) : (
      <UnauthorizedUserPage isAuthorized={isAuthorized} />
    )

  );

}

export default AdminAddServices;