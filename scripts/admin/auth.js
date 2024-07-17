// authUtils.js

// Function to get a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null; // Return null if the cookie is not found
}

// Function to validate the admin token and role
async function validateAdminToken(token) {
  try {
    const response = await fetch(
      'http://localhost/flightsteam-back-end/api/admins/validateToken.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      }
    );

    const data = await response.json(); // Parse the JSON response
    if (
      response.ok &&
      data.status === 200 &&
      (data.data.role === 'admin' || data.data.role === 'superadmin')
    ) {
      return true;
    } else {
      console.error(
        'Token is invalid or insufficient permissions:',
        data.message
      );
      return false;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}
