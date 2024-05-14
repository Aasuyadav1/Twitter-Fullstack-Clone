import React, { useState, useEffect } from "react";
import useStore from "../lib/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const ProfileCard = ({ user, fetchUser }) => {
  const { initialState, setInitialState } = useStore((state) => state);
  const navigate = useNavigate();
  const { id } = useParams();

  const B_URL = process.env.BACKEND_URL;

  const followUser = async () => {
    try {
      const response = await fetch(`${B_URL}/follow/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${initialState.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        fetchUser();
        setInitialState("userData", data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);
  return (
    <div>
      <div
        className=" bg-cover bg-no-repeat bg-center max-w-[600px] w-full"
        style={{ height: "200px", backgroundImage: `url(${user?.coverimage})` }}
      >
        <img
          className=" w-full h-full"
          src={
            user?.coverimage ||
            "https://tokystorage.s3.amazonaws.com/images/default-cover.png"
          }
          alt="cover image upload"
        />
      </div>
      <div className="p-4">
        <div className="relative flex w-full">
          {/* Avatar */}
          <div className="flex flex-1">
            <div style={{ marginTop: "-6rem" }}>
              <div
                style={{ height: "9rem", width: "9rem" }}
                className="md rounded-full relative avatar"
              >
                <img
                  style={{ height: "9rem", width: "9rem" }}
                  className="md rounded-full relative border-4 border-gray-900"
                  src={
                    user?.avatar ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                  }
                  alt=""
                />
                <div className="absolute"></div>
              </div>
            </div>
          </div>
          {/* Follow Button */}
          <div className="flex flex-col text-right">
            {user && user?._id !== initialState?.userid ? (
              <button
                onClick={() => followUser(user?._id)}
                className={`rounded-full px-4 text-sm py-1  text-black border border-solid border-white ${
                  initialState?.userData &&
                  initialState?.userData?.following?.includes(user._id)
                    ? "bg-transparent hover:bg-transparent  text-white "
                    : "bg-white hover:bg-transparent border-transparent  hover:text-white"
                }`}
              >
                {initialState?.userData &&
                initialState?.userData?.following?.includes(user._id)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            ) : (
              <button
                onClick={() =>
                  navigate(`/update/profile/${initialState?.userid}`)
                }
                className="flex justify-center  max-h-max whitespace-nowrap focus:outline-none  focus:ring  rounded max-w-max border bg-transparent border-blue-500 text-blue-500 hover:border-blue-800 hover:border-blue-800 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile info */}
        <div className="space-y-1 justify-center w-full mt-3 ml-3">
          {/* User basic*/}
          <div>
            <h2 className="text-xl leading-6 font-bold text-white">
              {user?.name}
            </h2>
            <p className="text-sm leading-5 font-medium text-gray-600">
              @{user?.username}
            </p>
          </div>
          {/* Description and others */}
          <div className="mt-3">
            <p className="text-white leading-tight mb-2">{user?.bio} </p>
            {/* <div className="text-gray-600 flex">
                            <span className="flex mr-2"><svg viewBox="0 0 24 24" className="h-5 w-5 paint-icon"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg> <a href="https://ricardoribeirodev.com/personal/" target="#" className="leading-5 ml-1 text-blue-400">www.RicardoRibeiroDEV.com</a></span>
                            <span className="flex mr-2"><svg viewBox="0 0 24 24" className="h-5 w-5 paint-icon"><g><path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"></path><circle cx="7.032" cy="8.75" r="1.285"></circle><circle cx="7.032" cy="13.156" r="1.285"></circle><circle cx="16.968" cy="8.75" r="1.285"></circle><circle cx="16.968" cy="13.156" r="1.285"></circle><circle cx="12" cy="8.75" r="1.285"></circle><circle cx="12" cy="13.156" r="1.285"></circle><circle cx="7.032" cy="17.486" r="1.285"></circle><circle cx="12" cy="17.486" r="1.285"></circle></g></svg> <span className="leading-5 ml-1">Joined December, 2019</span></span>
                        </div> */}
          </div>
          <div className="pt-3 flex justify-start items-start w-full divide-x divide-gray-800 divide-solid">
            <div className="text-center pr-3">
              <span className="font-bold text-white">
                {user?.following.length}
              </span>
              <span
                onClick={() => navigate(`/user/follow/${user?._id}`)}
                className="text-gray-600 cursor-pointer"
              >
                {" "}
                Following
              </span>
            </div>
            <div className="text-center px-3">
              <span className="font-bold text-white">
                {user?.followers.length}{" "}
              </span>
              <span
                onClick={() => navigate(`/user/followers/${user?._id}`)}
                className="text-gray-600 cursor-pointer"
              >
                {" "}
                Followers
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-800" />
    </div>
  );
};

export default ProfileCard;
