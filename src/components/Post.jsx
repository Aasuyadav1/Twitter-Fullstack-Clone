import React, { useState, useEffect } from "react";
import useStore from "../lib/store";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import Twittercard from "./Twittercard";

const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [posts, setPosts] = useState(null);
  const [commentForm, setCommentForm] = useState("");
  const [comments, setComments] = useState([]);
  const { getAllPosts, initialState, setInitialState } = useStore(
    (state) => state
  );
  
  const B_URL = process.env.BACKEND_URL

  const getPost = async (id) => {
    try {
      const response = await fetch(`${B_URL}/post/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${initialState.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPosts([data.post]);
        getPost(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const response = await fetch(
        `${B_URL}/create/comment/post/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${initialState.token}`,
          },
          body: JSON.stringify({ content: commentForm }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCommentForm("");
        fetchComments();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${B_URL}/get/comments/post/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${initialState.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setComments(data.comments);

        if (comments) {
          console.log(comments[0].createdBy.username);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getdatas = async () => {
      await getPost(id);
      await fetchComments();
    };
    getdatas();
  }, []);

  return (
    <>
      {Array.isArray(posts) ? (
        posts.map((post, i) => (
          <div
            key={post._id}
            
          >
             <Twittercard post={post} key={post._id} />

            <div className="bg-white dark:bg-transparent dark:border-gray-800  w-full">       

              <div className="mt-4 p-4 ">
                <div className="flex gap-1 items-center">
                  <img
                    className="object-cover rounded-full w-[35px] h-[35px] aspect-square"
                    src={initialState?.userData?.avatar}
                    alt=""
                  />
                  <input
                    type="text"
                    placeholder="Post your reply"
                    className="w-full p-3 outline-none bg-transparent text-white rounded-xl"
                    value={commentForm}
                    onChange={(e) => setCommentForm(e.target.value)}
                  />
                </div>
                <div onClick={handleComment} className="flex justify-end">
                  <button className="bg-blue-500 rounded-full px-4 py-1 text-white ">
                    Reply
                  </button>
                </div>
              </div>
              <hr className="border-gray-800 mt-4" />
              <div className="mt-4">
                {comments &&
                  comments.map((comment) => (
                    <div className="w-full ">
                      <div className="flex p-4 gap-3 mt-6 text-white">
                        <div>
                          <img
                            className="object-cover rounded-full w-[35px] h-[35px] aspect-square"
                            src={comment?.createdBy?.avatar}
                            alt=""
                            onClick={() => navigate(`/profile/${comment?.createdBy?._id}`)}
                          />
                        </div>
                        <div className="w-full">
                          <div className="flex gap-1 justify-between w-full">
                            <div>
                              <p className="text-lg font-semibold">
                                {comment?.createdBy?.name}
                              </p>
                              <p className="text-sm text-white opacity-90">
                                @{comment?.createdBy?.username}
                              </p>
                            </div>
                           {
                            comment?.createdBy?._id === initialState?.userid && (
                              <FiMoreVertical className="text-lg cursor-pointer" />
                            )
                           }
                          </div>
                          <p className="text-md">{comment?.content}</p>
                        </div>
                      </div>
                      <hr className="border-gray-800 mt-4" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div class="animate-pulse flex space-x-4 p-4 w-full  h-[550px] ">
    
        <div className="w-full bg-slate-800"></div>
        
  </div>
      )} 
    </>
  );
};

export default Post;
