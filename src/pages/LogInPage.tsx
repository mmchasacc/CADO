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

      const { token } = response.data
      localStorage.setItem("token", token)

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
      <div>
        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <h1>Log in</h1>
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
          <button type="submit" className="bg-amber-300 hover:bg-amber-600 active:bg-amber-100 text-black">Log in</button>
          <button type="submit" onClick={handleOnClick}>Sign up</button>

        </form>
      </div>
    </>
  );
}

export default LoginPage;
