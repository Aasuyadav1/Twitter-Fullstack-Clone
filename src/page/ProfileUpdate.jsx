import React from 'react'
import { useState, useEffect } from 'react'
import useStore from '../lib/store'
import { useNavigate, useParams } from 'react-router-dom'
import { GoPencil } from "react-icons/go";
import { toast } from 'sonner';

const ProfileUpdate = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [user, setUser] = useState(null)
    const {initialState, getAllPosts} = useStore((state) => state)
    const [formData, setformData] = useState({
        name : "",
        username : "",
        bio : "",
        avatar : "",
        coverImage : ""
    })
    const B_URL = process.env.BACKEND_URL


    const fetchUser = async () => {
        try {
          const response = await fetch(`${B_URL}/user/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${initialState.token}`
            },
          });
    
          const data = await response.json();
    
          console.log(data);
    
          if(response.ok) {
            setUser(data.user);
            setformData({
              name : data.user.name,
              username : data.user.username,
              bio : data.user.bio,
              avatar : data.user.avatar,
              coverImage : data.user.coverimage
            })
            console.log(data);
          }else{
            console.log("error");
          }
      
        } catch (error) {
          console.log(error);
        }
    }

    const updateUser = async (e) => {
        e.preventDefault();
        if(!formData.name || !formData.username || !formData.bio ) return toast.error("Please fill all the fields");
        console.log(formData); 
        try {
            const formConData = new FormData();
            formConData.append("name", formData.name);
            formConData.append("username", formData.username);
            formConData.append("bio", formData.bio);
            formConData.append("avatar", formData.avatar);
            formConData.append("coverImage", formData.coverImage);

            console.log(formConData);
            const response = await fetch(`${B_URL}/user/update/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${initialState.token}`
                },
                body: formConData
            })

            const data = await response.json();
            
            if(response.ok){
                toast.success(data.message)
                navigate("/")
                getAllPosts();
            }else{
                console.log("error", data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.name] : e.target.value
        })
        console.log(formData);
    }

    useEffect(() => {
        if(id) {
            fetchUser()
        }
    },[id])

    return (
      <div className="h-screen flex items-center justify-center">
      <div className=" w-full">
        {user && (
          <form onSubmit={updateUser} encType='multipart/form-data'>
            <div className='relative'>
              <img
                className="h-[200px] w-full object-cover"
                src={formData.coverImage instanceof File ? URL.createObjectURL(formData.coverImage) : formData.coverImage || "https://tokystorage.s3.amazonaws.com/images/default-cover.png"}
                alt=""
              />
              {/* Input for cover image */}
              <input type="file" name="coverImage" id="coverimage" className="hidden" onChange={(e) => setformData({ ...formData, coverImage: e.target.files[0] })} />
              <label htmlFor="coverimage">
                <GoPencil className='absolute right-2 top-2 text-4xl text-black rounded-full cursor-pointer bg-white p-1 shadow-2xl' />
              </label>
            </div>
            <div className="relative ">
              <img
                className="h-[150px] w-[150px] object-cover rounded-full absolute -top-24 left-6"
                src={formData.avatar instanceof File ? URL.createObjectURL(formData.avatar) : formData.avatar || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"}
                alt=""
              />
              {/* Input for avatar */}
              <input type="file" name="avatar" id="avatar" className="hidden" onChange={(e) => setformData({ ...formData, avatar: e.target.files[0] })} />
              <label htmlFor="avatar">
                <GoPencil className='absolute -bottom-[50px] left-[130px] text-4xl text-black rounded-full cursor-pointer bg-white p-1 shadow-2xl' id='avatar' />
              </label>
            </div>
            <div className="p-4 text-white">
              <div className="mt-14 flex flex-col gap-4 text-white">
                <div>
                <label htmlFor="name">Name</label>
                <input type="text" name='name' className="outline-none mt-3  text-md  bg-transparent w-full border border-opacity-30 border-solid border-white py-3 px-2 rounded-md text-white hover:border-blue-500 focus:border-blue-500" value={formData.name}  onChange={handleChange} placeholder="Name"/>
                </div>
                <div>
                  <label htmlFor="username">Username</label>
                <input type="text" name='username' className="mt-3 outline-none  text-md  bg-transparent w-full border border-opacity-30 border-solid border-white py-3 px-2 rounded-md text-white hover:border-blue-500 focus:border-blue-500" value={formData.username}  onChange={handleChange} placeholder="User name"/>
                </div>
                <div>
                  <label htmlFor="bio">Bio</label>
                <input type="text" name='bio' className="mt-3 outline-none  text-md  bg-transparent w-full border border-opacity-30 border-solid border-white py-3 px-2 rounded-md text-white hover:border-blue-500 focus:border-blue-500" value={formData.bio}  onChange={handleChange} placeholder="Bio"/>
                </div>
              </div>
              <div className="flex mt-10 justify-end w-full">
                <button type='submit' className="rounded-full px-8 text-lg py-1  text-black bg-white border border-solid  border-white  hover:bg-transparent hover:text-white transition-all">
                  Edit 
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
    );
}

export default ProfileUpdate