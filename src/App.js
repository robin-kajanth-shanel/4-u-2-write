import React, { Component } from "react"; 
import Modal from "./Modal";
import firebase from "./firebase";
import DailyPrompts from "./DailyPrompts";
import Timer from "./Timer";
import "./styles.css";
import { PDFViewer, PDFDownloadLink, Document, Page } from '@react-pdf/renderer';
import PDFExport from './PDFExport';
import swal from "sweetalert";

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      title: "",
      message: "",
      wordCount: "",
      setTime: 10000,
      elapsedTime: 10000,
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
      pdfClass: "visuallyHidden",
      titleComplete: "",
      messageComplete: ""
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

      // When the timer reaches 0 
      if (this.state.elapsedTime === 0) {
        // Display the pop-up modal
        swal({ 
          text: "Time's up! Restart the timer to continue writing" 
        });

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
    })
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

  // Saves the input on submit
  savePDF = () => {
    this.setState({
      titleComplete: this.state.title,
      messageComplete: this.state.message,
      pdfClass: ""
    })
  }

  enableForm = () => { this.setState({ formDisable: false }) } 

  render() {
    return (
      <div className={`App ${this.state.theme}`}>
        <header className="wrapper">
          <h1>Story Starter</h1>
          <div className="toggleButton">
            {/* <span>{this.state.lightMode ? "Dark" : "Light"} Mode</span> */}
            <button className={this.state.lightMode ? "move" : null} onClick={this.toggleTheme}>
              <i className="fas fa-sun"></i>
              <i className="fas fa-moon"></i>
            </button>
          </div>
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
              <option value="300000">5 min</option>
              <option value="600000">10 min</option>
              <option value="1200000">20 min</option>
              <option value="1800000">30 min</option>
            </select>
            <button type="submit">Start Timer</button>
          </form>

          {this.state.isCountingDown ? (
            <Timer
              secondsToCount="15"
              sendTime={this.getTime}
              keepChecking={this.state.keepChecking}
            />
          ) : null}

          <div className="writingComponent">
            <h3>Selected Prompt:</h3>
            <p className="prompt">{this.state.selectedPrompt}</p>

            <div className="saveToPDF">
              <PDFDownloadLink className={this.state.pdfClass} document={
                <PDFExport
                  title={this.state.titleComplete}
                  message={this.state.messageComplete}
                />} fileName={`${this.state.titleComplete}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
              </PDFDownloadLink>
              {this.state.displayForm ?
                <button type="button" onClick={this.savePDF} aria-label="Save To PDF">
                  <i className="far fa-file-pdf" aria-hidden="true"></i>
                </button>
                : null
              }
            </div>

            {this.state.displayForm
              ? (
                <>
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
                    <div className="outer">
                      <div className="inner"></div>
                    </div>
                    <div className="formBottomBar">
                      <p>Word Count: {this.state.wordCount}</p>
                      <button type="reset" onClick={this.enableForm}>Clear</button>
                    </div>
                  </form>
                </>
              )
              : null}
          </div>
        </main>

        <footer className="wrapper">
          <p>©2020 <a href="https://kajanthkumar.com/">Kajanth</a>, <a href="https://www.robinnong.com">Robin</a> and <a href="https://shanelbeebe.com/">Shanel</a>.</p>
        </footer>
      </div>
    );
  }
}


export default App;
