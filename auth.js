const axios = require('axios');

const authorizeCompany = async () => {
  const authUrl = 'http://20.244.56.144/test/auth';
  const authData = {
    companyName: "goMart",
    clientID: "9ca97284-0b06-42c3-b95b-ca28b727e4b4",
    clientSecret: "riVeJtBuOyGwTnuS",
    ownerName: "Jadhav Avinash",
    ownerEmail: "245121733015@mvsrec.edu.in",
    rollNo: "2451-21-733-015"
  };

  try {
    // Request the authorization token
    const authResponse = await axios.post(authUrl, authData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Authorization Token Response:', authResponse.data);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

authorizeCompany();
