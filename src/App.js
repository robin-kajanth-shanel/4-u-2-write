import React, { Component } from "react";
import Modal from "./Modal";
import firebase from "./firebase";

import Timer from "./Timer";
import "./styles.css";
class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      title: "",
      setTime: "",
      prompts: [],
      selectedPrompt: "",
      userPrompts: [],
      isCountingDown: false,
      percentTime: ""
    };
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const promptsArray = [];
      for (let key in data) {
        promptsArray.unshift(data[key]);
      }
      this.setState({ userPrompts: promptsArray });
    });
  }

  setTimer = (e) => {
    e.preventDefault();
    // Sets the writing timer according to the user's selection
    setTimeout(() => {
      alert("hi");
    }, this.state.setTime);
  };

  getFormSelection = (e) => {
    this.setState({
      setTime: e.target.value,
    });
  };

  saveTitle = (e) => {
    this.saveText(e, "title");
  };

  saveMessage = (e) => {
    // Set the 15sec warning timer once user starts the writing timer
    this.saveText(e, "message");
  };

  stopTime = () => {
    // clearTimeout(this.state.warningTimer);
    this.setState({
      isCountingDown: false,
    });
  };

  startTime = () => {
    // this.state.warningTimer();
    this.setState({
      isCountingDown: true,
    });
  };

  saveText = (e, typeOfText) => {
    switch (typeOfText) {
      case "title":
        this.setState({
          title: e.target.value,
        });
        break;
      case "message":
        this.setState({
          title: e.target.value,
        });
        break;
      default:
        console.log("no text state to save found");
    }
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  selectPrompt = (prompt) => {
    const selectedPrompt = prompt.target.value;
    console.log("Prompt:", selectedPrompt);
    this.setState({ selectedPrompt: selectedPrompt });
    // display the selected prompt for the writer above the writing area
  };

  getTime = (time) => {
    let percent = Math.floor((time/15)*100) 
    this.setState({
      percentTime: percent
    }) 
    document.documentElement.style.setProperty('--inner-width', `${this.state.percentTime}%`)
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Placeholder Title</h1>
          <button className="toggleButton"></button>
        </header>

        <main>
          <h2>Prompt of The Day</h2>
          <p>
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. ”{" "}
          </p>
          <button onClick={this.toggleModal}>Get User Generated Prompts</button>
          {this.state.modalOpen ? (
            <Modal
              exitModal={this.toggleModal}
              selectPrompt={this.selectPrompt}
              userPrompts={this.state.userPrompts}
            />
          ) : null}
          <form action="" className="timeSelectForm" onSubmit={this.setTimer}>
            <label htmlFor="intervals">How long do you want to write?</label>
            <select
              name="intervals"
              id="intervals"
              onChange={this.getFormSelection}
            >
              <option value="">Select an option</option>
              <option value="5000">5 sec</option>
              <option value="10000">5 min</option>
            </select>
            <button type="submit">Submit</button>
          </form>

          {this.state.isCountingDown ? <Timer secondsToCount="15" sendTime={this.getTime}/> : null}

          <div>
            <p>Selected prompt: {this.state.selectedPrompt}</p>
            <button>Export to PDF</button>
            <form action="">
              <label htmlFor="">Title</label>
              <input
                type="text"
                placeholder="Title"
                onChange={this.saveTitle}
              />
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                onChange={this.saveMessage}
                onKeyDown={this.stopTime}
                onKeyUp={this.startTime}
              ></textarea>
              <div className="progressBar"></div>
            </form>
            <div className="outer" >
              <div className="inner"></div>
            </div>
          </div>
        </main>

        <footer></footer>
      </div>
    );
  }
}

export default App;
