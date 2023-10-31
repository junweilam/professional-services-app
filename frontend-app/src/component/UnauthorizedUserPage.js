import React from 'react';

const UnauthorizedUserPage = ({ isAuthorized }) => {
  if (!isAuthorized) {
    return (
      <div>
        <h1>Unauthorized User</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  // If the user is authorized, you can render something else or redirect to another page.
  // For redirection, you can use the React Router or other navigation techniques.
  // Example: return <Redirect to="/login" />;

  return null;
};

export default UnauthorizedUserPage;
