import axios from "axios"

const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL as string
const axiosInstance=axios.create(
    {
        baseURL:backendUrl,
        withCredentials:true
    }
)

export default axiosInstance