import React, { useState, useEffect } from 'react';
import { adminAddUsers, getServicesID, getAuthorization } from '../features/apiCalls';
import { AddServiceSuccess } from '../component/AddServiceSuccess';
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";
import UnauthorizedUserPage from '../component/UnauthorizedUserPage';

const AdminAddUsers = () => {

    const [emailStatus, setEmailStatus] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showServiceOption, setShowServiceOption] = useState(false);
    const [serviceID, setServiceID] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // setFormData({
        //     ...formData,
        //     [name]: value,
        // });
        setFormData((prevFormData) => {
            const updatedData = { ...prevFormData, [name]: value};
        
        if(updatedData.authorization == 2){
            setShowServiceOption(true);
        }else{
            setShowServiceOption(false);
        }
        return updatedData;
    })
    };

    

    
    
    // State to hold form input values
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: 'pw123123',
        authorization: '',
        serviceID: '',
    });
    const closeExpiredModal = () => {
        setShowModal(false);
        window.location.href = './signin';
      };

    useEffect(() => {
        async function fetchServicesID(){
            try{
                const response = await getServicesID();
                setServiceID(response.data);
            }catch(err){
                console.error('API call error: ', err);
            }
        }
        async function fetchUserAuthorization(){
            try{
                let token = {token: localStorage.getItem("token")}
                if(token != null){
                    const response = await getAuthorization(token);
                    if(response.results == 1){
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
        CheckToken(setShowModal);
        fetchUserAuthorization();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formValues = {LastName: formData.lastName, FirstName: formData.firstName, Email: formData.email, Password: formData.password, Authorization: formData.authorization, ServiceID: formData.serviceID};
        const response = await adminAddUsers(formValues);
        if(response.error){
            if(response.error.response.status === 400){
                setEmailStatus(false);
            }
            else{
                setEmailStatus(true);
            }
        }else{
            setEmailStatus(true);
            setShowSuccessModal(true);
        }
    }

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        window.location.href = './adminhome';
    }

    return (
        isAuthorized ?(
<div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 shadow-md rounded-md">
                <h2 className="text-2xl font-semibold mb-4">Add User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={`mb-4`}>
                        <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className={`${!emailStatus ? 'w-full px-4 py-2 border rounded-lg border-red-500' : `w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500`}`}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        {!emailStatus && (
                            <p className="text-red-500 text-sm">Email has been used</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg outline-none focus.border-blue-500"
                            id="authorization"
                            name="authorization"
                            value={formData.authorization}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a role</option>
                            <option value="1">Admin</option>
                            <option value="2">Service</option>
                           
                        </select>
                    </div>
                    {showServiceOption && (
                        <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="serviceID">
                            Service ID
                        </label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg outline-none focus.border-blue-500"
                            id="serviceID"
                            name="serviceID"
                            value={formData.serviceID}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Service ID</option>
                            {serviceID.map((service) =>(
                                <option key={service.id} value={service.id}>
                                    {service.id}
                                </option>
                            ))}
                           
                        </select>
                    </div>
                    )}
                    
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        type="submit"
                    >
                        Create User
                    </button>
                </form>
            </div>
        <AddServiceSuccess show={showSuccessModal} onClose={closeSuccessModal}/>
        <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
        </div>
        ) : (
            <UnauthorizedUserPage isAuthorized={isAuthorized} />
        )
        
    );
}

export default AdminAddUsers;