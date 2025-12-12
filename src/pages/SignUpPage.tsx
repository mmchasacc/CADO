const SignUpPage = () => {
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


export default SignUpPage