import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useStore from "../lib/store";
import { toast } from "sonner";

const Modal = ({ showModel, setShowModal, toggleModel, postId }) => {
  const { initialState, setInitialState, getAllPosts } = useStore(
    (state) => state
  );
  const [formData, setformData] = useState({
    content: "",
  });

  const B_URL = process.env.BACKEND_URL;

  const [post, setPost] = useState([]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${B_URL}/post/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${initialState.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPost(data.post);
        setformData({
          content: data.post.content,
        });
        console.log("edit data", data);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.content) return toast.error("Please fill the content");
    try {
      const response = await fetch(`${B_URL}/update/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${initialState.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        toggleModel();
        getAllPosts();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return (
    <>
      {showModel && post && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 flex items-center justify-center bg-[#192734] bg-opacity-50 overflow-y-auto"
        >
          <div className="relative  w-full max-w-[450px] max-h-full border-solid border border-gray-600 rounded-lg">
            <div className="relative bg-[#192734] rounded-lg shadow ">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                {/* <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Update Post
                </h3> */}
                <div className="flex gap-1 items-center">
                  <img
                    src={post?.createdBy?.avatar}
                    className="h-[35px] rounded-full w-[35px] object-cover aspect-square"
                    alt=""
                  />
                  <div className="flex flex-col leading-0">
                    <span className="text-white text-md">
                      {post?.createdBy?.name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      @{post?.createdBy?.username}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleModel}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <textarea
                  className="w-full outline-none bg-[#192734] rounded-lg p-2 text-white"
                  name="content"
                  value={formData?.content}
                  id=""
                  onChange={(e) =>
                    setformData({ ...formData, content: e.target.value })
                  }
                ></textarea>
                <img className="w-full " src={post?.postPhoto} alt="" />
              </div>

              <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="text-black bg-white px-4 rounded-full py-1.5 text-sm font-medium"
                >
                  Edit Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
