import React from "react";

const ToggleButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center rounded-md w-fit px-4 py-2 text-xs font-medium focus:outline-none ${
      isActive
        ? "border-sky-500 bg-sky-500 text-white dark:border-sky-500 dark:bg-sky-500 dark:text-white"
        : "border-neutral-300 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
    }`}
  >
    {label}
  </button>
);

const ToggleButtonGroup = ({ activeButtons, setActiveButtons }) => {
  const buttons = ["Image", "Video", "News", "Maps"];

  const handleClick = (label) => {
    const newActiveButtons = activeButtons.includes(label)
      ? activeButtons.filter((btn) => btn !== label)
      : [...activeButtons, label];

    setActiveButtons(newActiveButtons);
    console.log("Active buttons in ToggleButtonGroup:", newActiveButtons);
  };

  return (
    <div className="flex space-x-2">
      {buttons.map((label) => (
        <ToggleButton
          key={label}
          label={label}
          isActive={activeButtons.includes(label)}
          onClick={() => handleClick(label)}
        />
      ))}
    </div>
  );
};

export default ToggleButtonGroup;
