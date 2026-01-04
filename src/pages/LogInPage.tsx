import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password
      })

      const { userId } = response.data
      localStorage.setItem("userId", userId)

      navigate("/todo")
    } catch (error) {
      console.error("Login failed", error)
      alert("Invalid email or password")
    }
  }


  const handleOnClick = () => {
    navigate("/signup")
  }

  return (
    <>
      <div className="flex flex-col items-center mt-60">
        <form onSubmit={handleLogin} className="flex flex-col gap-8 bg-[#111827] p-10 w-100 h-120 pt-20 rounded-2xl">
          <h1 className="text-3xl">Log in</h1>
          <input
            className=" bg-black rounded-[5px] p-2"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className=" bg-black rounded-[5px] p-2"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-s font-bold text-black">Log in</button>
          <button type="button" className="bg-white hover:bg-gray-200 p-2 rounded-lg font-bold transition text-black" onClick={handleOnClick}>Sign up</button>

        </form>
      </div>
    </>
  );
}

export default LoginPage;
