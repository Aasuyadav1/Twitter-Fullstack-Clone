import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../lib/store";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { IoMdHeartEmpty } from "react-icons/io";
import Model from "../components/Model";
import { FiMoreVertical } from "react-icons/fi";
import ProfileCard from "../components/ProfileCard";
import Twittercard from "../components/Twittercard";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPost, setUserPost] = useState([]);
  const [dropdowns, setDropdowns] = useState({});
  const [postId, setPostId] = useState(null);
  const B_URL = process.env.BACKEND_URL

  const { getAllPosts, initialState, setInitialState } = useStore(
    (state) => state
  );
  const [showModal, setShowModal] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${B_URL}/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async (id) => {
    try {
      const response = await fetch(
        `${B_URL}/follow/user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${initialState.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchUserPosts();
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

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(
        `${B_URL}/post/user/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUserPost(data.posts);
      } else {
        console.log("error on fetching user posts");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatedDate = (date) => {
    const newDate = new Date(date);
    return newDate.toDateString();
  };

  const likePost = async (postId) => {
    try {
      const response = await fetch(
        `${B_URL}/like/post/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${initialState.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchUserPosts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    setDropdowns({ [id]: true }); // Open the clicked dropdown and close others
    setShowModal(true);
    setPostId(id);
  };

  const handleDelete = (id) => {
    const deleteconfirm = confirm("Are you sure? You want to delete this post");
    console.log(deleteconfirm);
    if (deleteconfirm) {
      console.log(id);
      const response = fetch(`${B_URL}/delete/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${initialState.token}`,
        },
      })
    
      if (response.ok) {
        fetchUserPosts();
        getAllPosts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }else{
      console.log("cancel")
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (showModal === true) {
      setDropdowns({}); // Close the clicked dropdown
    }
  }, [showModal]);

  useEffect(() => {
    fetchUserPosts();
  }, [toggleModal]);

  useEffect(() => {
    fetchUser();
    fetchUserPosts();
  }, [id]);

  return (
    <div className=" flex items-center mt-4 justify-center ">
     
      <div className=" max-w-[600px] w-full">
      <ProfileCard user={user} fetchUser={fetchUser}/>
      {userPost &&
              userPost.map((post) => (
               <Twittercard post={post} key={post._id} />
              ))}
        {/* <div className="p-4 text-white ">
          
          

          <div className="mt-6">
            <h1 className="text-xl font-bold underline"> posts</h1>
            {userPost &&
              userPost.map((post) => (
                <div className="bg-gray-50 dark:bg-black flex items-center mt-4 justify-center">
                  <div className="bg-white dark:bg-transparent border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-[448px] w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          onClick={() =>
                            navigate(`/profile/${post.createdBy._id}`)
                          }
                          className="h-11 w-11 rounded-full"
                          src={post.createdBy.avatar}
                          alt="Profile"
                        />
                        <div className="ml-1.5 text-sm leading-tight">
                          <span className="text-black dark:text-white font-bold block ">
                            {post.createdBy.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 font-normal block">
                            @{post.createdBy.username}
                          </span>
                        </div>
                      </div>
                      {initialState &&
                      initialState.userid === post.createdBy._id ? (
                        <div className="relative">
                          <FiMoreVertical
                            onClick={() =>
                              setDropdowns({ [post._id]: !dropdowns[post._id] })
                            }
                            role="button"
                            className="text-md  cursor-pointer  text-white"
                          />
                          {dropdowns[post._id] && (
                            <ul className="menu bg-base-200 w-56 rounded-box absolute top-6 right-0">
                              <li>
                                <p onClick={() => handleEdit(post._id)}>Edit</p>
                              </li>
                              <li>
                                <p onClick={() => handleDelete(post._id)}>
                                  Delete
                                </p>
                              </li>
                            </ul>
                          )}
                        </div>
                      ) : null}
                     
                    </div>
                    <p className="text-black dark:text-white block text-md leading-snug mt-3">
                      {post.content}
                    </p>
                    <div
                      onClick={() => navigate(`/post/${post._id}`)}
                      className=" justify-center items-center overflow-hidden object-contain"
                    >
                      <img
                        className="mt-2 rounded-2xl border border-gray-100 object-cover dark:border-gray-700"
                        src={post.postPhoto}
                        alt="Tweet"
                      />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm py-1 my-0.5">
                      {" "}
                      {formatedDate(post.createdAt) ||
                        "10:05 AM · Dec 19, 2020"}
                    </p>
                    <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
                    <div className="text-gray-500 dark:text-gray-400 flex mt-3 gap-4">
                      <div className="flex text-md items-center ">
                        <div
                          onClick={() => likePost(post._id)}
                          className="w-fit h-fit p-1 rounded-full group hover:bg-[#f75f5f2a] transition-all"
                        >
                          <IoMdHeartEmpty
                            className={`group-hover:text-red-500  text-xl cursor-pointer ${
                              post && post.Likes.includes(initialState.userid)
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          />
                        </div>

                        <span className="ml-3 text-md">
                          {post.Likes ? post.Likes.length : 0}
                        </span>
                      </div>
                      <div className="flex text-md items-center mr-6">
                        <svg
                          className="fill-current h-5 w-auto"
                          viewBox="0 0 24 24"
                        >
                          <g>
                            <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                          </g>
                        </svg>
                        <span className="ml-3 text-md">
                          {post.comments ? post.comments.length : 0} people are
                          Tweeting about this
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div> */}
      </div>
      <Model
        showModel={showModal}
        toggleModel={toggleModal}
        setShowModal={setShowModal}
        postId={postId}
      />
    </div>
  );
};

export default Profile;
