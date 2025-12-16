import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"

const CalendarComponent = () => {
  const today = new Date();

  const [date, setDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleShowCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div>
      <label>Select deadline:</label>
      <button onClick={handleShowCalendar} className="bg-emerald-300 text-black p-[8px 12px] cursor-pointer w-full h-[50px] rounded-sm"> {showCalendar ? "Close" : `${date.toLocaleDateString()}`} </button>
      {showCalendar && (
        <div className="position-relative z-50 top-full left-0 mt-2.5 drop-shadow-black">
          <Calendar className="bg-gray-200 text-black rounded-sm" onChange={(newDate) => {
            setDate(newDate)
            setShowCalendar(false)
          }} value={date} minDate={today} />
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
