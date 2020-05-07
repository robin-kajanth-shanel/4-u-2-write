import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Modal from "./Modal";
import firebase from "./firebase";
import DailyPrompts from "./DailyPrompts";
import Timer from "./Timer";
import "./styles.css";
import { PDFViewer, PDFDownloadLink, Document, Page } from '@react-pdf/renderer';
import PDFExport from './PDFExport';
class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      title: "",
      message: "",
      wordCount: "",
      setTime: "",
      elapsedTime: "",
      prompts: [],
      selectedPrompt: "",
      userPrompts: [],
      isCountingDown: false,
      percentTime: "",
      dailyPrompt: "",
      formDisable: false,
      stopTimer: false,
      keepChecking: true,
      displayForm: false,
      lightMode: false,
      theme: "lightMode",
      pdfClass: "visuallyHidden"
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
          formDisable: !this.state.formDisable,
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

  // Saves the title input in the component state, on change
  saveTitle = (e) => {
    this.saveText(e, "title");
  };

  // Saves the textarea input in the component state, on change
  saveMessage = (e) => {
    this.saveText(e, "message");
  };

  // Stops the 15 second warning timer
  stopTime = () => {
    this.setState({
      isCountingDown: false,
    });
  };

  // Starts the 15 second warning timer
  startTime = () => {
    this.setState({
      isCountingDown: true,
    });
  };

  wordCount = () => {
    const words = this.state.message;
    const numWords = words.split(" ").filter((item) => {
      return item !== "";
    });
    this.setState({
      wordCount: numWords.length,
    });
  };

  // Switch case for saving text inputs into the component state
  saveText = (e, typeOfText) => {
    switch (typeOfText) {
      case "title":
        this.setState({
          title: e.target.value,
        });
        break;
      case "message":
        this.setState(
          {
            message: e.target.value,
          },
          () => {
            this.wordCount();
          }
        );
        break;
      default:
        console.log("no text state to save found");
    }
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
        theme: "lightMode"
      }) 
      document.documentElement.style.setProperty("--body-font-color", "black")
    } else {
      this.setState({
        theme: "darkMode"
      });
      document.documentElement.style.setProperty("--body-font-color", "white")
    }
  }

  displayPDFLink = () => {
    this.setState({
      pdfClass: ""
    })
    
  render() {
    return (
      <div className={`App ${this.state.theme}`} >
        <header className="wrapper">
          <h1>Placeholder Title</h1>
          <div class="toggleButton">
            <span>{this.state.lightMode ? "Light" : "Dark"} Mode</span> 
            <button className={this.state.lightMode? "move": null} onClick={this.toggleTheme}>
              <i class="fas fa-moon"></i>
              <i class="fas fa-sun"></i>
            </button>
          </div>
        </header>

        <main className="wrapper">
          <div className="promptSelection">
            <h2>Choose Your Prompt</h2>
            <button onClick={this.getDailyPrompt}>Get Daily Prompt</button>
            <button onClick={this.toggleModal}>Get User Generated Prompts</button>
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
              <option value="">Select an option</option>
              <option value="5000">5 sec</option>
              <option value="10000">5 min</option>
            </select>
            <button type="submit" onClick={this.displayPDFLink}>Start Timer</button>
          </form>

          {this.state.isCountingDown ? (
            <Timer
              secondsToCount="7"
              sendTime={this.getTime}
              keepChecking={this.state.keepChecking}
            />
          ) : null}

          <div className="writingComponent">
            <h3>Selected Prompt</h3>
            <p>{this.state.selectedPrompt}</p>
            <p>
              {this.state.formDisable
                ? "Time's up! Restart the timer to continue writing"
                : null}
            </p>

          <PDFDownloadLink className={this.state.pdfClass} document={
              <PDFExport
                title={this.state.title}
                message={this.state.message}
              />} fileName={`${this.state.title}.pdf`}>
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
            </PDFDownloadLink>

            <form action="" className="writingForm">
              <label htmlFor="title" className="sr-only">Title</label>
              <input
                type="text"
                className="title"
                id="title"
                placeholder="Title"
                onChange={this.saveTitle}
              />
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                disabled={this.state.formDisable ? true : false}
                onChange={this.saveMessage}
                onKeyDown={this.stopTime}
                onKeyUp={this.startTime}
              ></textarea>
              <div className="progressBar"></div>
            </form>
            <p>Word Count: {this.state.wordCount}</p>
            
            {this.state.displayForm
              ? (
                <div>

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
                      disabled={this.state.formDisable ? true : false}
                      onChange={this.saveMessage}
                      onKeyDown={this.stopTime}
                      onKeyUp={this.startTime}
                    ></textarea>
                    <div className="progressBar"></div>
                  </form>
                 
                </div>
              )
              
              : null}
            <div className="outer">
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
