const LoginPage = () => {
  return (
    <>
      <div className="flex flex-col gap-8">
        <h1>Log in</h1>
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
        <button>Log in</button>
      </div>
      <button>Sign up</button>
    </>
  );
};

export default LoginPage;
