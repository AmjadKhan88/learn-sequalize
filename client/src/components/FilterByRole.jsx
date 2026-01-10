import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const role = [
  "Defaults",
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Analyst",
  "DevOps Engineer",
  "Marketing Specialist",
  "Sales Executive",
  "Project Manager",
  "System Administrator",
  "Other",
];

const FilterByRole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelect = (role) => {
    // Create a NEW URLSearchParams object
    const newParams = new URLSearchParams(searchParams);
    if (role === "Defaults") {
      newParams.delete("role");
      setSearchParams(newParams);
    } else {
      newParams.delete("page");
      newParams.delete("search");
      newParams.set("role", role);
      setSearchParams(newParams);
    }
    setSelected(role);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col w-46 text-sm relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 pr-2 py-2  rounded bg-white text-gray-600  shadow hover:bg-gray-50 focus:outline-none"
      >
        <span className="text-gray-600">{selected}</span>
        <svg
          className={`w-5 h-5 inline float-right transition-transform duration-200 ${
            isOpen ? "rotate-0" : "-rotate-90"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#6B7280"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="w-full max-h-32 overflow-y-auto   [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-slate-100
                  dark:[&::-webkit-scrollbar-track]:bg-neutral-200
                  dark:[&::-webkit-scrollbar-thumb]:bg-slate-300 bg-white border border-gray-300  rounded shadow mt-1 py-2"
        >
          {role.map((country) => (
            <li
              key={country}
              className="px-4 text-gray-600 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
              onClick={() => handleSelect(country)}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterByRole;
