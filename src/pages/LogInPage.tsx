import { useContext, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = () => {
    const savedData = localStorage.getItem("user_pass")

    const user = JSON.parse(savedData)

    if (user.email === email && user.password === password) {
      navigate("/todo")
    } else {
      alert("Wrong email or password")
    }
  }
  
  return (
    <>
      <div className="flex flex-col gap-8">
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
        <button type="submit" onClick={handleLogin} className="bg-amber-300 hover:bg-amber-600 active:bg-amber-100 text-black">Log in</button>
      </div>
      <button type="submit">Sign up</button>
    </>
  );
}

export default LoginPage;
