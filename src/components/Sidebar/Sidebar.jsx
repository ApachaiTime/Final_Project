import "./Sidebar.css";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
export default function Sidebar({ setSelectedDate }) {
  const customFormatters = {
    formatWeekdayName: (day) => format(day, "EEEEE"),
  };

  return (
    <div className="sidebar__content">
      <DayPicker
        mode="single"
        onSelect={setSelectedDate}
        formatters={customFormatters}
      />
      <label htmlFor="price">
        {" "}
        Price:
        <input id="price" type="range" />
      </label>
    </div>
  );
}
