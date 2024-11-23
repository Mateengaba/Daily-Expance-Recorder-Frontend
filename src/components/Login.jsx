import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BASEURL } from '../confg'






const Login = () => {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();


  const loginUser = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        alert("Required fields are missing",)
        return
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setError("Invalid email format");
        return;
      }

      const objToSend = {
        email,
        password,

      };
      console.log("objToSend", objToSend)

      // login API
      const response = await axios.post(`${BASEURL}/user/login`, objToSend)
      console.log("Full Response:", response.data); // Check the full response structure


      if (response.data.status) {
        // Encrypt user data and store it in localStorage
        console.log("Response Data:", response.data.data); // Debugging

        const userEncrypt = window.btoa(JSON.stringify(response.data.data));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", userEncrypt);

        // Optional: Store userId for future requests
        const userId = response.data.data._id;  // Adjust if response structure is different
        localStorage.setItem("userId", userId); // Store userId in localStorage

        // Redirect to transactions page
        navigate("/transaction");
        alert(response.data.message);

        const userName = response.data.data.name; // Accessing the correct field
        console.log("User Name:", userName); // Debugging

        // alert(`Welcome, ${userName}`);


      } else {
        alert(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    }


  }





  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-200">

        <div className="w-96 py-6 px-8 bg-white rounded shadow-xl">
          <form onSubmit={loginUser} action="">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-800 font-bold">
                Email:
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  //console.log(e.target.value); // Yeh value console mein print hogi
                }}
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-800 font-bold">
                Password:
              </label>
              <input
                type="password"
                name="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  // console.log(e.target.value); // Yeh value console mein print hogi
                }}
                placeholder="Password"
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
              />

            </div>
            <button className="cursor-pointer hover:bg-indigo-700 py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded">
              Login
            </button>

            <p className='text-end mt-3'>
              <Link to="/signup" className='ms-2 block text-sm text-sky-500 underline transition-all font-bold hover:text-sky-700'>Don't Have An Account</Link>
            </p>
          </form>
        </div>


      </div>

    </div>
  )
}

export default Login
