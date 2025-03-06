"use client"
import axiosInstance from "@/app/utils/axios.instance"
import { useAppDispatch } from "@/store/hooks"
import { login } from "@/store/user.slice"
import { useEffect } from "react"

export default function UserComponent(){
    const dispatch=useAppDispatch()
    useEffect(()=>{
      async function userFetcher(){
        const response=await axiosInstance.get('/auth/verify')
        console.log(response.data)
        dispatch(login(response.data.user))
      }
      userFetcher()
    })
    return<></>
}