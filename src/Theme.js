import React from "react";

const Theme = (props) => {
  return (
    <div className="toggleButton">
      <span>{props.lightMode ? "Light" : "Dark"} Mode</span>
      <button
        className={props.lightMode ? "move" : null}
        onClick={props.toggleTheme}
      >
        <i className="fas fa-moon"></i>
        <i className="fas fa-sun"></i>
      </button>
    </div>
  );
};

export default Theme;
