import axios from "axios"

export const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL as string
const axiosInstance=axios.create(
    {
        baseURL:backendUrl,
        withCredentials:true,
        headers:{
            Authorization:`Bearer ${window.localStorage.getItem('accessToken')}`
        }
    }
)

export default axiosInstance