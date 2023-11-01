import React from 'react';

const UnauthorizedUserPage = ({ isAuthorized }) => {
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized User</h1>
        <p className="text-lg text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  return null;
};

export default UnauthorizedUserPage;
