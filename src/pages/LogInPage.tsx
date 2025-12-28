import { useContext, useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")



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
        <button>Log in</button>
      </div>
      <button>Sign up</button>
    </>
  );
};

export default LoginPage;
