import React, {useState, useEffect} from 'react'
import Follow from '../components/Follow'
import { useParams } from 'react-router-dom'

export const FollowLists = () => {
    
    const {id} = useParams()
    const [user, setUser] = useState(null)

    const B_URL = process.env.BACKEND_URL
 

    const fetchUser = async () => {
        console.log("main call")
        try {
            const response = await fetch(`${B_URL}/user/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const data = await response.json()

            if (response.ok) {
                setUser(data.user);
               
            } else {
                console.log("error");
            }
        } catch (error) {
            console.log(error);
        }
    }

   

    useEffect(() => {
        fetchUser()
        
    },[id])
  return (
    <div className=' h-screen  w-full'>
      <h1 className='text-xl font-bold text-left mt-10 px-4'>Following</h1>
      <div className='mt-6'>
      {
           user && user.following.map((user) => (
               <Follow key={user._id} list={user} updateUserFollowList={fetchUser}/>
           ))
       }
      </div>
    </div>
  )
}
