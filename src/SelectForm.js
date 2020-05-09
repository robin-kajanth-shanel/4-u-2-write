import React from 'react';

const SelectForm = (props) => {
    return (
        <>
            <form action="" className="timeSelection" onSubmit={props.setTimer}>
                <h2>How long do you want to write?</h2>
                <label htmlFor="intervals" className="sr-only">Time Intervals</label>
                <select
                    name="intervals"
                    id="intervals"
                    onChange={props.getFormSelection}
                >
                    <option value="300000">5 min</option>
                    <option value="600000">10 min</option>
                    <option value="1200000">20 min</option>
                    <option value="1800000">30 min</option>
                    <option value="2700000">45 min</option>
                    <option value="3600000">1 hr</option>
                </select>
                <button type="submit" onClick={props.startTime}>Start Timer</button>
            </form>
        </>
    )
}

export default SelectForm;