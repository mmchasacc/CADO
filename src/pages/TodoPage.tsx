import CalendarComponent from "../components/Calendar";


const TodoPage = () => {
  return (
    <>
      <div className="flex flex-col gap-9 p-4 w-[300px] bg-gray-800 rounded-xl">
        <h1 className="font-extrabold">ADD TASK</h1>
        <textarea
          className="text-left bg-gray-200 text-gray-800 rounded-xs p-2"
          placeholder='I need to buy "eggs" '
        />

        <label className="text-left mb-[-30px]">Category:</label>
        <div className="w-max">
          <select className="w-[218px] text-black bg-gray-200 rounded-sm p-2">
            <option value="shopping" className="text-black">
              Shopping
            </option>
            <option value="school" className="text-black">
              School
            </option>
            <option value="work" className="text-black">
              Work
            </option>
          </select>
          <button className="bg-gray-300 w-[50px] h-full rounded-lg text-black" >+</button>
        </div>
        <input
          className="text-center bg-gray-200 text-gray-800 rounded-sm p-2"
          type="text"
          placeholder="Message to yourself (notification)"
        />
        <div>
        <CalendarComponent />

        </div>
        <div>
            <select id="prioritySelection" className="bg-black rounded-sm p-2 w-35">
                <option value="Urgent" className="text-red-400" >
                    Urgent
                </option>
                <option value="Serious" className="text-yellow-300" >
                    Serious
                </option>
                <option value="getInDone" className="text-green-400" >
                    Get it done
                </option>
            </select>
            <button className="bg-green-600 p-1.5 w-30 rounded-sm">Confirm</button>
        </div>
      </div>
    </>
  );
};

export default TodoPage;
