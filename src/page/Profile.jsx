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
  const B_URL = process.env.BACKEND_URL;

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

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${B_URL}/post/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
  }, [showModal]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    fetchUserPosts();
  }, [id]);

  return (
    <div className=" flex items-center mt-4 justify-center ">
      <div className=" max-w-[600px] w-full">
        {user ? (
          <ProfileCard user={user} fetchUser={fetchUser} />
        ) : (
          <div class="animate-pulse flex space-x-4 p-4 w-full  h-[400px] ">
            <div className="w-full bg-slate-800"></div>
          </div>
        )}
        {userPost.length > 0 ? (
          userPost.map((post) => (
            <Twittercard
              post={post}
              key={post._id}
              fetchPostsOnLike={fetchUserPosts}
            />
          ))
        ) : (
          <div className="animate-pulse flex space-x-4 p-4 w-full h-[550px]">
            <div className="w-full bg-slate-800"></div>
          </div>
        )}
        {userPost.length === 0 && <div className="text-center text-white text-lg">No posts</div>}
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
