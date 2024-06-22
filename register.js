const axios = require('axios');

const registerCompany = async () => {
  const url = 'http://20.244.56.144/test/register';
  const data = {
    companyName: "goMart",
    ownerName: "Jadhav Avinash",
    rollNo: "2451-21-733-015",
    ownerEmail: "245121733015@mvsrec.edu.in",
    accessCode: "ordxkq"
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

registerCompany();
