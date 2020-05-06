import React, { Component } from "react";

// Code modified from Coding Entrepeneurs: https://www.youtube.com/watch?v=NAx76xx40jM

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 10,
      keepChecking: true
    };
  }

  componentDidMount() {
    const { secondsToCount } = this.props;
    this.setState({
      counter: secondsToCount,
      keepChecking: this.props.keepChecking
    });
    // this.state.keepChecking ?
    this.doIntervalChange();
    //   clearInterval(this.myInterval);
  }

  doIntervalChange = () => {
    if (this.props.keepChecking) {
      this.myInterval = setInterval(() => {
        this.setState((prevState) => ({ counter: prevState.counter - 1 }));
        this.props.sendTime(this.state.counter);
        if (this.state.counter < 0) {
          clearInterval(this.myInterval);
          this.setState({
            counter: 0,
          });
          alert("warning");
        }
      }, 1000);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.keepChecking !== prevProps.keepChecking) {
      clearInterval(this.myInterval)
    }
  }

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
