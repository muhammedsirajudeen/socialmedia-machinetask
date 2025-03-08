"use client"
import axiosInstance from "@/app/utils/axios.instance"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/user.slice"
import { useEffect } from "react"

export default function UserComponent(){
    const dispatch=useAppDispatch()
    useEffect(()=>{
      async function userFetcher(){
        try {
          alert('fired')
          const response=await axiosInstance.get('/auth/verify')
          dispatch(login(response.data.user))          
        } catch (error) {
          console.log('error',error)
        }
      }
      userFetcher()
    },[])
    return<></>
}