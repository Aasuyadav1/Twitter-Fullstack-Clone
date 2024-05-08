
import {create} from 'zustand'

const useStore = create((set, get)=>({
    initialState : {
        userid: null,
        username: null,
        email: null,
        token: localStorage.getItem("token") || null,
        isLoggedIn: false,
        allPosts: null,
        userData: null
    },



    setInitialState : (name, value) => {
        const {initialState} = get();
        set({initialState : {...initialState, [name] : value}})
    },

    getCurrentUser : async () => {
        const {initialState} = get();
        const {setInitialState} = get()
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/user`,{
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${initialState.token}`
                }
            })

            const data = await response.json();
            console.log(response)

            if(response.ok){
                setInitialState("isLoggedIn", true)
                setInitialState("username", data.user.username)
                setInitialState("email", data.user.email)
                setInitialState("userid", data.user._id)
                setInitialState("userData", data.user)
                console.log("after setting userData", initialState)
          //
            } else {
                // setInitialState("isLoggedIn", false)
                // setInitialState("username", null)
                // setInitialState("email", null)
                // setInitialState("userid", null)
                // setInitialState("token", null)
                // setInitialState("userData", null)
                console.log("user fatching failed")
            }
        } catch (error) {
            console.log(error)

        }
    },

    getAllPosts : async () => {
        const {setInitialState, initialState} = get()
        const {posts} = get()
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/all/posts`,{
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                    
                }
            })

            const data = await response.json();
            
            if(response.ok){
               await setInitialState("allPosts", data.posts.reverse())
                console.log(initialState)
            }else{
                console.log("post fatching failed")
            }
        } catch (error) {
            Console.log(error)
        }
    }
}))

export default useStore;