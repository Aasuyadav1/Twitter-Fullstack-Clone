import React from 'react';
import { toast } from 'sonner';
import useStore from '../lib/store';
import { useNavigate } from 'react-router-dom';

const Follow = ({ list, updateUserFollowList }) => {
  const { initialState, getCurrentUser } = useStore((state) => state);
  const navigate = useNavigate();

  const B_URL = process.env.BACKEND_URL

  const followUser = async (id) => {
    try {
      const response = await fetch(`${B_URL}/follow/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${initialState.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        getCurrentUser()
        updateUserFollowList();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
      {
        list ? (<div className='w-full '>
        <hr className="border-gray-800" />
       <div className="flex flex-shrink-0 py-5">
         <div className="flex-1">
           <div className="flex items-center w-full">
             <div>
               <img
                 className="inline-block cursor-pointer h-10 w-10 rounded-full ml-4 mt-2"
                 src={list.avatar}
                 alt=""
                 onClick={() => navigate(`/profile/${list._id}`)}
               />
             </div>
             <div onClick={() => navigate(`/profile/${list._id}`)} className="ml-3 mt-3">
               <p className="text-base leading-6 font-medium text-white">
                 {list.name}
               </p>
               <p className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                 @{list.username}
               </p>
             </div>
           </div>
         </div>
         <div className="flex-1 px-4 py-2 m-2">
           <div className="float-right">
             {!initialState.userData || list._id !== initialState.userData._id && (
               <button
                 onClick={() => followUser(list._id)}
                 className={`rounded-full px-4 text-sm py-1 text-black border-white border border-solid ${initialState.userData && initialState.userData.following.includes(list._id) ? 'bg-transparent hover:bg-transparent text-white' : 'bg-white hover:bg-transparent border-transparent hover:text-white'}`}>
                 {initialState.userData && initialState.userData.following.includes(list._id) ? "Unfollow" : "Follow"}
               </button>
             )}
           </div>
         </div>
       </div>
       <hr className="border-gray-800" />
     </div>) : (<div>No users</div>)
      }
    </>
  );
};

export default Follow;
