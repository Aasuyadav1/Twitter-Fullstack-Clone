import React, { useEffect } from "react";
import Card from "../components/Card";
import Uploadpost from "../components/Uploadpost";
import Navbar from "../components/Navbar";
import Twittercard from "../components/Twittercard";
import Aside from "../components/Aside";
import { useNavigate } from "react-router-dom";
import useStore from "../lib/store";

const Home = () => {
  const { initialState, getCurrentUser } = useStore((state) => state);
  const navigate = useNavigate();
  useEffect(() => {
    getCurrentUser();
    if (!initialState.isLoggedIn) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Uploadpost />
      <Card />
    </div>
  );
};

export default Home;
