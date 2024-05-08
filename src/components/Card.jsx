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
        {/* {
        initialState.allPosts && initialState.allPosts.map((post) => (
            <div className="bg-gray-50 dark:bg-black flex items-center mt-4 justify-center">
      <div className="bg-white dark:bg-transparent border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-[448px] w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img onClick={() => navigate(`/profile/${post.createdBy._id}`)} className="h-11 w-11 rounded-full" src={post.createdBy.avatar} alt="Profile"/>
            <div className="ml-1.5 text-sm leading-tight">
              <span className="text-black dark:text-white font-bold block ">{post.createdBy.name}</span>
              <span className="text-gray-500 dark:text-gray-400 font-normal block">@{post.createdBy.username}</span>
            </div>
          </div>
          {!initialState.userData || post.createdBy._id !== initialState.userData._id && (
                                <button
                                    onClick={() => followUser(post.createdBy._id)}
                                    className={`rounded-full px-4 text-sm py-1  text-black border border-solid border-white ${initialState.userData && initialState.userData.following.includes(post.createdBy._id) ? 'bg-transparent hover:bg-transparent  text-white ' : 'bg-white hover:bg-transparent border-transparent  hover:text-white'}`}>
                                    {initialState.userData && initialState.userData.following.includes(post.createdBy._id) ? "Unfollow" : "Follow"}
                                </button>
                            )}
        </div>
        <p className="text-black dark:text-white block text-md leading-snug mt-3">{post.content}</p>
        <div onClick={() => navigate(`/post/${post._id}`)} className=' justify-center items-center overflow-hidden object-contain'>
        <img className="mt-2 rounded-2xl border border-gray-100 object-cover dark:border-gray-700" src={post.postPhoto} alt="Tweet"/>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm py-1 my-0.5"> {formatedDate(post.createdAt) || '10:05 AM · Dec 19, 2020' }</p>
        <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
        <div className="text-gray-500 dark:text-gray-400 flex mt-3 gap-4">
          <div className="flex text-md items-center ">
          <div onClick={() => likePost(post._id)}  className='w-fit h-fit p-1 rounded-full group hover:bg-[#f75f5f2a] transition-all'>

          <IoMdHeartEmpty className={`group-hover:text-red-500  text-xl cursor-pointer ${post && post.Likes.includes(initialState.userid) ? 'text-red-500' : 'text-gray-500'}`} />
          </div>

            <span className="ml-3 text-md">{post.Likes ? post.Likes.length : 0}</span>
          </div>
          <div className="flex text-md items-center mr-6">
            <svg className="fill-current h-5 w-auto" viewBox="0 0 24 24">
              <g>
                <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
              </g>
            </svg>
            <span className="ml-3 text-md">{post.comments ? post.comments.length : 0} people are Tweeting about this</span>
          </div>
        </div>
      </div>
         </div>
        ))
    } */}
    {
       initialState.allPosts && initialState.allPosts.map((post) => (
         <Twittercard post={post} key={post._id} />
       ))
    }
    
    </>
  )
}

export default Card