import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/signup";

const SignUpPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()


    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")

      try {
        const response = await axios.post("http://localhost:5000/api/signup", {
          email,
          password
        })

        const { token } = response.data
        localStorage.setItem("token", token)

        navigate("/todo")
      } catch (err: any) {
        if (err.response && err.response.data.message) {
          setError(err.response.data.message)
        } else {
          setError("An error occurred during signup. Please try again")
        }
      }
    }


    const handleOnClick = () => {
      navigate("/login")
    }



  return (
    <>
      <div>
        <form onSubmit={handleSignup} className="flex flex-col gap-8 w-60">


        <h1>Sign up</h1>
        <input
          className=" bg-black rounded-[5px] p-2"
          type="email"
          placeholder="Enter Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        <input
          className=" bg-black rounded-[5px] p-2"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          />
        <button type="submit" className="bg-green-500 hover:bg-green-600 p-2 rounded font-bold transition">Register</button>
        <button className="bg-white hover:bg-gray-200 p-2 rounded font-bold transition text-black" onClick={handleOnClick}>Back to login</button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
