import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASEURL } from '../confg';



const Signup = () => {

  const [username, setUsername] = useState("")
  const [age, setAge] = useState("")
  const [number, setNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const navigate = useNavigate();


  const SignupHandler = async (e) => {
    e.preventDefault();

    try {
      // Basic field validation
      if (!username || !age || !number || !email || !password) {
        alert("All fields are required");
        return
      }

      // Email and password validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Invalid email format");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }

      const objToSend = {
        username,
        age,
        number,
        email,
        password,

      };
      console.log("objToSend", objToSend)

      const response = await axios.post(`${BASEURL}/user/signup`, objToSend)

      if (response.data.status) {
        alert(response.data.message);
        navigate("/");
        setUsername(""); // Clear fields after success
        setAge("");
        setNumber("");
        setEmail("");
        setpassword("");

      } else {
        alert(response.data.message);

      }

    } catch (error) {
      console.log("error", error.message);
      alert("error", error.message);

    }



  }






  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-96 py-6 px-8 bg-white rounded shadow-xl"> {/* Width ko yahan set kiya gaya hai */}
        <form action="" onSubmit={SignupHandler}>
          <div className="mb-5">
            <label htmlFor="Username" className="block text-gray-800 font-bold">
              User Name:
            </label>
            <input
              type="text"
              name='username'
              placeholder="username"
              onChange={(e) => {
                setUsername(e.target.value);
                //   console.log(e.target.value); // Yeh value console mein print hogi
              }}
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="Username" className="block text-gray-800 font-bold">
              Age:
            </label>
            <input
              type="text"
              name='age'
              onChange={(e) => {
                setAge(e.target.value);
                //console.log(e.target.value); // Yeh value console mein print hogi
              }}
              placeholder="Enter Age"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="number" className="block text-gray-800 font-bold">
              Phone Number:
            </label>
            <input
              type="number"
              name='number'
              onChange={(e) => {
                setNumber(e.target.value);
                //console.log(e.target.value); // Yeh value console mein print hogi
              }}
              placeholder="Phone Number"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-gray-800 font-bold">
              Email:
            </label>
            <input
              type="email"
              name='email'
              onChange={(e) => {
                setEmail(e.target.value);
                //console.log(e.target.value); // Yeh value console mein print hogi
              }}
              placeholder="@email"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="Password" className="block text-gray-800 font-bold">
              Password:
            </label>
            <input
              type="password"
              name='password'
              onChange={(e) => {
                setpassword(e.target.value);
                // console.log(e.target.value); // Yeh value console mein print hogi
              }}
              placeholder="Password"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            />
          </div>

          <button className="cursor-pointer hover:bg-indigo-700 py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded">
            Signup
          </button>

          <p className='text-end mt-3'>
            <Link to="/" className='block text-sm text-sky-500 underline transition-all font-bold hover:text-sky-700 ms-2'>Already Have An Account?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
