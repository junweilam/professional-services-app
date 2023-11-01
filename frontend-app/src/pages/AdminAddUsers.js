import React, { useState } from 'react';
import { adminAddUsers } from '../features/apiCalls';
import { AddServiceSuccess } from '../component/AddServiceSuccess';

const AdminAddUsers = () => {

    const [emailStatus, setEmailStatus] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    // State to hold form input values
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: 'pw123123',
        authorization: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formValues = {LastName: formData.lastName, FirstName: formData.firstName, Email: formData.email, Password: formData.password, Authorization: formData.authorization};
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
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        type="submit"
                    >
                        Create User
                    </button>
                </form>
            </div>
        <AddServiceSuccess show={showSuccessModal} onClose={closeSuccessModal}/>
        </div>
    );
}

export default AdminAddUsers;