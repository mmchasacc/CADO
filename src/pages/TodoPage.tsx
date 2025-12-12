import CalendarComponent from "../components/Calendar";


const TodoPage = () => {
  return (
    <>
      <div className="flex flex-col gap-9 p-4 w-[300px] bg-gray-800 rounded-xl">
        <input
          className="text-center bg-gray-200 text-gray-800 rounded-xs p-2"
          type="text"
          placeholder="What do you want to add?"
        />

        <label>Category:</label>
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
        {/* <input type="date" value="2025-12-12" min="" /> */}
      </div>
    </>
  );
};

export default TodoPage;
