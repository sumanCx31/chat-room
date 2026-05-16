import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:9001/api/v1",
  timeout: 30000,
  timeoutErrorMessage: "Server timed out...",
  responseType: "json",
  headers:{
    "Content-Type":"application/json"
  } 
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || null;
  if(token){
    config.headers.Authorization = "Bearer "+token
  }
  return config
})
// axios interceptors

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    if(error.response) {
      // 
      const {status, data} = error.response;
        throw {
          status,
          data,
          message: error.message,
        };
    } 
    else if(error.request) {
      console.error("No Response: ", error.request)
    } else {
      console.error("Request Error", error.message)
    }
  }
)
export default axiosInstance