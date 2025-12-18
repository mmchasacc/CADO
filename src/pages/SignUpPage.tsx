import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/signup";

const SignUpPage = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    const result = USER_REGEX.test(user)
    console.log(result)
    console.log(user)
    setValidName(result)
  }, [user])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd)
    console.log(result)
    console.log(pwd)
    setValidPwd(result)
    const match = pwd === matchPwd
    setValidMatch(match)
  }, [pwd, matchPwd])


  useEffect(() => {
    setErrMsg("")
  }, [user, pwd, matchPwd])


  return (
    <>
      <div className="flex flex-col gap-8">
        <h1>Sign up</h1>
        <input
          className=" bg-black rounded-[5px] p-2"
          type="email"
          placeholder="Enter Email"
        />
        <input
          className=" bg-black rounded-[5px] p-2"
          type="password"
          placeholder="Enter Password"
        />
        <input
          className=" bg-black rounded-[5px] p-2"
          type="text"
          placeholder="Enter Name"
        />
        <button className="bg-teal-400">Sign up</button>
        <button>Log in</button>
      </div>
    </>
  );
};

export default SignUpPage;
