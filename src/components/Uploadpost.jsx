import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { toast } from "sonner";
import useStore from "../lib/store";

const Uploadpost = () => {
  const { getAllPosts, initialState } = useStore((state) => state);
  const B_URL = process.env.BACKEND_URL;
  const [formData, setformData] = useState({
    postPhoto: null,
    content: "",
  });
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initialState?.userData?._id) {
      return toast.error("Please login to post");
    }
    if (!formData.postPhoto || !formData.content)
      return toast.error("All fields are required");
    try {
      setLoader(true);
      console.log("file from frontend ", formData.postPhoto);
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.postPhoto);
      formDataToSend.append("content", formData.content);

      const response = await fetch(`${B_URL}/create/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      console.log("data", data);
      console.log("response", response);
      if (response.ok) {
        setLoader(false);
        console.log("post created successfully");
        toast.success(data.message);

        await setformData({
          postPhoto: null,
          content: "",
        });
        getAllPosts();
      } else {
        toast.error(data.message);
        console.log("something went wrong");
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="px-4 py-2 w-full  border border-gray-800 border-solid">
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <div className="flex items-start gap-2">
          <img
            src={
              initialState?.userData?.avatar ||
              "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
            }
            className="object-cover rounded-full w-[40px] aspect-square"
            alt=""
          />
          <textarea
            onChange={(e) =>
              setformData({ ...formData, content: e.target.value })
            }
            name=""
            id=""
            cols="30"
            rows="2"
            value={formData.content}
            placeholder="What is happening"
            className=" outline-none w-full p-3 resize-none bg-transparent text-white rounded-xl"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="image" className="text-yellow-500 text-xl">
            <CiImageOn className="text-yellow-500 text-xl" />
          </label>
          <input
            name="file"
            onChange={(e) =>
              setformData({ ...formData, postPhoto: e.target.files[0] })
            }
            type="file"
            id="image"
            className="file-input hidden file-input-bordered w-full max-w-xs"
          />
          <button
            type="submit"
            className="bg-blue-500 rounded-full px-4 py-1 text-white"
          >
            {loader ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Uploadpost;
