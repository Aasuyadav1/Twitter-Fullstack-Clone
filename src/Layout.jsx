import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Aside from './components/Aside'
import { Link } from 'react-router-dom'
import useStore from './lib/store'

const Layout = () => {
  const {initialState} = useStore((state) => state)

  return (
    <>
      <div className="p-relative bg-[#0c1218] w-full">
        <div className="flex justify-center w-full">
          <Navbar />
          <main className="max-w-screen-lg w-full">
            <div className="flex flex-col md:flex-row md:w-full">
              <section className="border border-y-0 border-gray-800 md:max-w-[600px] w-full">
                <div className="flex justify-between items-center">
                  <div className="mx-2">
                   <Link to="/">
                   <h2 className="px-4 py-2 text-xl font-semibold text-white">Home</h2>
                   </Link>
                  </div>
                  <div className="mx-2">
                  {
                initialState?.userData && initialState?.userData?._id ? (
                    <Link to={`/profile/${initialState.userData._id}`}  class="group flex items-center px-2 py-2 text-base leading-6 font-semibold text-white rounded-full hover:text-blue-300">
                <svg class="mr-4 h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
          
            </Link>
                ) : null
            }
                  </div>
                </div>
                <Outlet />
              </section>
              <Aside />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Layout
