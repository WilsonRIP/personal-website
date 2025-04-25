"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";

// Styles need to be imported globally, typically in layout.tsx or global.css
// import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        inline // Show the calendar inline
        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <div className="mt-4 text-center text-gray-700 dark:text-gray-300">
        Selected date: {startDate ? startDate.toLocaleDateString() : "None"}
      </div>
    </div>
  );
};

export default CustomDatePicker;
