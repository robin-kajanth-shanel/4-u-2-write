import React, { Component } from "react";
import swal from "sweetalert";

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
          swal({ 
            text: "Keep writing!"
           });
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
    return (
      <div className="visuallyHidden">
      </div>
    );
  }
}

export default Timer;
