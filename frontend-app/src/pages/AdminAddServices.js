import React, { useState } from 'react';



const AdminAddServices = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        // Add more fields as needed
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        // You can perform actions to create something with the formData here.
        // For this example, we'll just log the data.
        console.log('Form data submitted:', formData);
      };
    
      return (
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
                className="mt-1 p-2 w-full rounded border-black border-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
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
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      );
    
}

export default AdminAddServices;