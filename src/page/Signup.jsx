import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'

const Signup = () => {
    const navigate = useNavigate()
    const {initialState} = useStore((state)=> state)
    const B_URL = process.env.BACKEND_URL
    const [formData, setFormData] = useState({
        name : "",
        username : "",
        email : "",
        password : "",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.name || !formData.username || !formData.email || !formData.password) {
            return toast.error("All fields are required")
        }
        try {
            const response = await fetch(`${B_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();

            if(response.ok){
                navigate("/")
                toast.success(data.message)
                localStorage.setItem("token", data.token)
                setFormData({
                    name : "",
                    username : "",
                    email : "",
                    password : "",
                })
            } else {
                toast.error(data.message)
            } 
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(!initialState?.userData?._id){
            navigate("/home")
        }else{
            navigate("/")
        }
    },[initialState?.userData?._id])

  return (
    <section class=" bg-[#0c1218] w-full">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-gray-800 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                  Sign in to your account
              </h1>
              <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label for="name" class="block mb-2 text-sm font-medium text-white ">Your name</label>
                      <input onChange={handleChange} type="text" name="name" id="name" class=" border  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="name" required="" />
                  </div>
                  <div>
                      <label for="username" class="block mb-2 text-sm font-medium text-white">Your username</label>
                      <input onChange={handleChange} type="text" name="username" id="username" class=" border  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="username" required="" />
                  </div>
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium  text-white">Your email</label>
                      <input onChange={handleChange} type="email" name="email" id="email" class=" border   sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="name@company.com" required="" />
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                      <input onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" class=" sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required="" />
                  </div>
                  <div class="flex items-center justify-between">
                      <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border rounded  0 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800" required="" />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="remember" class="text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <Link  class="text-sm font-medium hover:underline text-primary-500">Forgot password?</Link>
                  </div>
                  <button type="submit" class="w-full text-white bg-primary-600 bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">Sign in</button>
                  <p class="text-sm font-light  text-gray-400">
                      Already have an account? <Link to="/login"  class="font-medium hover:underline text-primary-500">Log in</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
    </section>
  )
}

export default Signup