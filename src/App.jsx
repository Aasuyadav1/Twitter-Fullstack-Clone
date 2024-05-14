import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./page/Login";
import Signup from "./page/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import useStore from "./lib/store";
import Post from "./components/Post";
import Profile from "./page/Profile";
import ProfileUpdate from "./page/ProfileUpdate";
import { FollowLists } from "./page/FollowLists";
import FollowersLists from "./page/FollowersLists";
import Navbar from "./components/Navbar";
import Layout from "./Layout";

function App() {
  const { getCurrentUser, initialState } = useStore((state) => state);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
   <div className='bg-[#0c1218]'>
    <BrowserRouter>
    
    <Routes>
       <Route path="/" element={<Layout/>} >
       <Route path="/home" element={<Home/>} />
        <Route path='/post/:id' element={<Post/>} />
        <Route path="update/profile/:id" element={<ProfileUpdate/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="user/follow/:id" element={<FollowLists/>} />
        <Route path="user/followers/:id" element={<FollowersLists/>} />
       </Route>
         <Route path="/signup" element={<Signup />} />
          <Route index path="/" element={<Login />} />
    </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App;
