import React, { useState, useEffect } from 'react';
import { getServicesID, getServicesById, updateServiceById, deleteServiceById, getAuthorization } from '../features/apiCalls';
import { UpdateServiceSuccess } from '../component/UpdateServiceSuccess';
import UnauthorizedUserPage from '../component/UnauthorizedUserPage';
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";

const AdminUpdateService = () => {

    const [serviceID, setServiceID] = useState([]);
    const [isServiceSelected, setIsServiceSelected] = useState(false);
    const [serviceSelected, setServiceSelected] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const closeExpiredModal = () => {
        setShowModal(false);
        window.location.href = './signin';
      };


    const [formData, setFormData] = useState({
        serviceID: '',
        name: '',
        description: '',
        address: '',
        price: '',
        // Add more fields as needed
    });

    const handleServiceChange = async (e) => {
        const { name, value } = e.target;
        setFormData(async (prevFormData) => {
            const updatedData = { ...prevFormData, [name]: value };
            if (updatedData.serviceID !== '') {
                setIsServiceSelected(true);
                let fields = { ServiceID: updatedData.serviceID }
                const response = await getServicesById(fields);
                setServiceSelected(response.results[0].serviceID);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    name: response.results[0].ServiceName,
                    description: response.results[0].ServiceDesc,
                    address: response.results[0].ServiceAdd,
                    price: response.results[0].Price
                }));

            } else {
                setIsServiceSelected(false);
            }
            return updatedData;

        })
    };

    // Close Success Modal and redirect to admin home
    const closeSuccessModal = () => {
        setIsUpdated(false);
        setIsDeleted(false);
        window.location.href = './adminhome';
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

    };

    // Delete Button 
    const deleteServiceButton = async (e) =>{
        e.preventDefault();
        try{
            let value = {ServiceID: serviceSelected}
            const response = await deleteServiceById(value);
            if(response.message === "Deleted service"){
                setIsDeleted(true);
            }
            
        }catch(err){
            console.log(err);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        // You can perform actions to create something with the formData here.
        // For this example, we'll just log the data.
        try {
            let formValues = { ServiceID: serviceSelected, ServiceName: formData.name, ServiceDesc: formData.description, ServiceAdd: formData.address, ServicePrice: formData.price };
            const response = await updateServiceById(formValues);
            if (response.message === "Updated service"){
                setIsUpdated(true);
            }
            
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        async function fetchServicesID() {
            try {
                const response = await getServicesID();
                setServiceID(response.data);
            } catch (err) {
                console.error('API call error: ', err);
            }
        }
        async function fetchUserAuthorization(){
            try{
                let token = {token: localStorage.getItem("token")}
                if(token != null){
                    const response = await getAuthorization(token);
                    if(response.results === 1){
                        setIsAuthorized(true);
                    }else{
                        setIsAuthorized(false);
                    }
                }
            }catch(err){
                console.error('API call error: ', err);
            }
        }
        fetchServicesID();
        CheckToken(setShowModal)
        fetchUserAuthorization();
    }, [])
    return (
        isAuthorized ? (
<div className="max-w-md mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Update Services</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="serviceID">
                        Service ID
                    </label>
                    <select
                        className="w-full px-4 py-2 border rounded-lg outline-none focus.border-blue-500"
                        id="serviceID"
                        name="serviceID"
                        value={formData.serviceID}
                        onChange={handleServiceChange}
                        required
                    >
                        <option value="">Select Service ID</option>
                        {serviceID.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.id}
                            </option>
                        ))}

                    </select>
                </div>

                {isServiceSelected && (
                    <div>
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
                                className="px-4 py-2 ml-12 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            >
                                Update
                            </button>
                            <button className="px-4 py-2 ml-32 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50" onClick={deleteServiceButton}>Delete</button>
                        </div>
                    </div>
                )}

            </form>
            <UpdateServiceSuccess show={isUpdated} onClose={closeSuccessModal} action="Updated" />
            <UpdateServiceSuccess show={isDeleted} onClose={closeSuccessModal} action="Deleted" />
            {/* <TokenExpireModal show={showModal} onClose={closeExpiredModal} /> */}

            <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
        </div>
        ) : (
            <UnauthorizedUserPage isAuthorized={isAuthorized} />
        )
        
    );
}

export default AdminUpdateService