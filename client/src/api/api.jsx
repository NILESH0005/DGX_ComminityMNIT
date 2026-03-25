const BASE_URL = import.meta.env.VITE_API_BASEURL;

const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  headers = { "Content-Type": "application/json" }
) => {
  const url = `${BASE_URL}${endpoint}`;

  let options = {
    method,
    headers,
  };

  if (method !== "GET" && body) {

    if (body instanceof FormData) {
      options.body = body;
      delete options.headers["Content-Type"]; 
    } else {
      options.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      
      const errorDetails = await response.text();
      console.error("API ERROR:", errorDetails);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};

export default apiRequest;