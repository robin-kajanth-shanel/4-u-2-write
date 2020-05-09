import React from 'react';

const Header = (props) => {
    return (
        <header className="wrapper">
            <h1>Story Starter</h1>
            <div className="toggleButton">
                <button className={props.lightMode ? "move" : null} aria-label="Toggle between light and dark mode" onClick={props.toggleTheme}>
                    <i className="fas fa-sun"></i>
                    <i className="fas fa-moon"></i>
                </button>
            </div>
        </header>
    )
}

export default Header;