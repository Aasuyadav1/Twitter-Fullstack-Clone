import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { IoMdHeartEmpty } from "react-icons/io";
import useStore from "../lib/store";
import { useNavigate } from "react-router-dom";
import Twittercard from "./Twittercard";

const Card = () => {
  const { getAllPosts, initialState, setInitialState } = useStore(
    (state) => state
  );
  const B_URL = process.env.BACKEND_URL;
  useEffect(() => {
    getAllPosts();
    initialState.allPosts
      ? console.log(initialState.allPosts)
      : console.log("no posts");
  }, []);
  return (
    <>
      {initialState?.allPosts ? (
        initialState?.allPosts?.map((post) => (
          <Twittercard post={post} key={post._id} />
        ))
      ) : (
        <div class="animate-pulse  flex justify-center mx-auto space-x-4 p-4 max-w-[600px] w-full  h-[550px] ">
          <div className="w-full bg-slate-800"></div>
        </div>
      )}
    </>
  );
};

export default Card;
