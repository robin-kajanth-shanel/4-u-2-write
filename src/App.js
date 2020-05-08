import React, { Component } from "react";
import Modal from "./Modal";
import firebase from "./firebase";
import DailyPrompts from "./DailyPrompts";
import Theme from "./Theme";

import "./styles.css";

import RichText from "./RichText";
class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      setTime: 10000,
      elapsedTime: 10000,
      prompts: [],
      selectedPrompt: "",
      userPrompts: [],
      percentTime: "",
      dailyPrompt: "",
      formDisable: false,
      stopTimer: false,
      keepChecking: true,
      displayForm: false,
      lightMode: false,
      theme: "lightMode",
      titleComplete: "",
      messageComplete: "",
    };
  }

  // On page load, get the user generated prompts saved to Firebase
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

  // Gets the prompt of the day from the imported DailyPrompt function component
  getDailyPrompt = () => {
    const dailyPromptsArray = DailyPrompts();
    const today = new Date().getDate();
    const prompt = dailyPromptsArray[today - 1].dailyPrompt;
    this.setState({
      selectedPrompt: prompt,
    });
  };

  setTimer = (e) => {
    e.preventDefault();

    this.setState({
      formDisable: false,
    });

    // Sets the writing timer according to the user's selection
    const writingTimer = setInterval(() => {
      this.setState({
        keepChecking: true,
        elapsedTime: this.state.elapsedTime - 1000,
        displayForm: true,
      });
      this.getTime();

      if (this.state.elapsedTime === 0) {
        this.setState({
          keepChecking: false,
          formDisable: true,
          stopTimer: !this.state.stopTimer,
          elapsedTime: this.state.setTime,
        });
        clearInterval(writingTimer);
      }
    }, 1000);
  };

  // Gets the user's selected time and saves it in state
  getFormSelection = (e) => {
    this.setState({
      setTime: e.target.value,
      elapsedTime: e.target.value,
    });
  };

  // Toggles the visibility of the modal
  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  // On selecting a user generated prompt, display the selected prompt above the writing area and close the modal
  selectPrompt = (prompt) => {
    const selectedPrompt = prompt.target.value;
    this.setState({
      selectedPrompt: selectedPrompt,
      modalOpen: !this.state.modalOpen,
    });
  };

  // Calculates the elasped writing time as a percentage of time remaining to set the width of the progress bar
  getTime = () => {
    let percent = Math.floor(
      (this.state.elapsedTime / this.state.setTime) * 100
    );
    this.setState({
      percentTime: percent,
    });
    document.documentElement.style.setProperty(
      "--inner-width",
      `${this.state.percentTime}%`
    );
  };

  //Toggles the light and dark mode theme
  toggleTheme = () => {
    this.setState({
      lightMode: !this.state.lightMode,
    });
    if (this.state.lightMode) {
      this.setState({
        theme: "lightMode",
      });
      document.documentElement.style.setProperty("--body-font-color", "black");
    } else {
      this.setState({
        theme: "darkMode",
      });
      document.documentElement.style.setProperty("--body-font-color", "white");
    }
  };

  enableForm = () => {
    this.setState({ formDisable: false });
  };

  render() {
    return (
      <div className={`App ${this.state.theme}`}>
        <header className="wrapper">
          <h1>Story Starter</h1>
          <Theme
            toggleTheme={this.toggleTheme}
            lightMode={this.state.lightMode}
          />
        </header>

        <main className="wrapper">
          <div className="promptSelection">
            <h2>Choose Your Prompt</h2>
            <button onClick={this.getDailyPrompt}>Get Daily Prompt</button>
            <button onClick={this.toggleModal}>Get User Prompts</button>
          </div>
          {this.state.modalOpen ? (
            <Modal
              exitModal={this.toggleModal}
              selectPrompt={this.selectPrompt}
              userPrompts={this.state.userPrompts}
            />
          ) : null}
          <form action="" className="timeSelection" onSubmit={this.setTimer}>
            <h2>How long do you want to write?</h2>
            <select
              name="intervals"
              id="intervals"
              onChange={this.getFormSelection}
            >
              <option value="10000">10 sec</option>
              <option value="30000">30 sec</option>
              <option value="300000">5 min</option>
            </select>
            <button type="submit">Start Timer</button>
          </form>

          <div className="writingComponent">
            <h3>Selected Prompt:</h3>
            <p>{this.state.selectedPrompt}</p>
            <div className="timesUp">
              <p>
                {this.state.formDisable
                  ? "Time's up! Restart the timer to continue writing"
                  : null}
              </p>
            </div>

            {this.state.displayForm ? (
              <RichText
                getTime={this.getTime}
                keepChecking={this.state.keepChecking}
                displayForm={this.state.displayForm}
                formDisable={this.state.formDisable}
              />
            ) : null}
          </div>
        </main>

        <footer className="wrapper">
          <p>
            ©2020 Kajanth, <a href="https://www.robinnong.com">Robin</a> and
            Shanel.
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
