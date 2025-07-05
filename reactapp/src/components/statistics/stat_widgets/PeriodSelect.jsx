import React, { useState } from 'react';

const PeriodSelect = ({ periods, onPeriodSelect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handlePeriodChange = (period) => {
    onPeriodSelect(period);
    setSelectedPeriod(period);
    toggleDropdown();
  };

  return (
    <div className="relative inline-block text-left"> {/* Make sure this div is relatively positioned */}
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedPeriod ? selectedPeriod.period : 'Select Period'}
        <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="z-10 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700 mt-1"> {/* Absolute positioning with a slight margin top */}
          <ul className="max-h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
            {periods.map((period, index) => (
              <li key={index} className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <label className="w-full text-sm font-medium text-gray-900 dark:text-gray-300" onClick={() => handlePeriodChange(period)}>{period.period}</label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PeriodSelect;
