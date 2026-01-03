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
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-purple-200 ml-1">Deadline</label>
      <div className="relative">
        <button
          onClick={handleShowCalendar}
          className="w-full p-3 bg-black/20 text-white rounded-xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all hover:bg-white/5 text-left flex items-center justify-between"
        >
          <span>{showCalendar ? "Close Calendar" : date.toLocaleDateString()}</span>
          <span className="text-white/50">📅</span>
        </button>

        {showCalendar && (
          <div className="absolute z-50 top-[-20rem] left-0  mt-2 w-full p-2 bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl animate-fade-in-down">
            <Calendar
              className="w-full bg-transparent border-none font-outfit text-white"
              tileClassName="rounded-lg hover:bg-purple-600/30 transition-colors text-white"
              onChange={(newDate) => {
                setDate(newDate as Date)
                setShowCalendar(false)
              }}
              value={date}
              minDate={today}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
