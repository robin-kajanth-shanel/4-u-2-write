import React, { Component } from "react";

// Code modified from Coding Entrepeneurs: https://www.youtube.com/watch?v=NAx76xx40jM

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 10,
    };
  }

  componentDidMount() {
    const { secondsToCount } = this.props;
    this.setState({
      counter: secondsToCount,
    });

    this.doIntervalChange();
  }

  doIntervalChange = () => {
    this.myInterval = setInterval(() => {
      this.setState((prevState) => ({ counter: prevState.counter - 1 }));
      if (this.state.counter === 0) {
        clearInterval(this.myInterval);
        alert("warning");
      }
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  render() {
    const { counter } = this.state;
    return (
      <div>
        <h3>Current Count: {counter}</h3>
      </div>
    );
  }
}

export default Timer;
