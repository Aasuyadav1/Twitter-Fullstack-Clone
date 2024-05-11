import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { IoMdHeartEmpty } from "react-icons/io";
import useStore from '../lib/store'
import { useNavigate } from 'react-router-dom';
import Twittercard from './Twittercard';

const Card = () => {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate();
    const {getAllPosts, initialState, setInitialState} = useStore((state)=>state)

    const B_URL = process.env.BACKEND_URL


    const formatedDate = (date) => {
        const newDate = new Date(date)
        return newDate.toDateString()
    }

    const likePost = async (id) => {
      try {
        const response = await fetch(`${B_URL}/like/post/${id}`,{
          method : "PUT",
          headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
          }
        })

        const data = await response.json();
        
        if(response.ok){
          
          getAllPosts()
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const followUser = async (id) => {
      try {
        const response = await fetch(`${B_URL}/follow/user/${id}`,{
          method : "PUT",
          headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${initialState.token}`
          }
          
        })
        const data = await response.json();
        if(response.ok){
          getAllPosts()
          console.log("afterfolloe",data)
          setInitialState("userData", data.user)
          
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    } 

    useEffect(() => {
      getAllPosts()
      initialState.allPosts ? console.log(initialState.allPosts) : console.log("no posts")
    },[])
  return (

    <>
    {
       initialState?.allPosts ? ( initialState?.allPosts?.map((post) => (
         <Twittercard post={post} key={post._id} />
       ))) : (
        <div class="animate-pulse flex space-x-4 p-4 max-w-[600px] w-full  h-[550px] ">
          <div className="w-full bg-slate-800"></div>
        </div>
       )
    }
    
    </>
  )
}

export default Card