import React, { Component } from "react";
import Modal from "./Modal";
import firebase from "./firebase";
import Header from "./Header";
import DailyPrompts from "./DailyPrompts";
import Timer from "./Timer";
import SelectForm from "./SelectForm";
import Form from "./Form";
import Editor from "./Editor";
import "./styles.css";
import {
  PDFViewer,
  PDFDownloadLink,
  Document,
  Page,
} from "@react-pdf/renderer";
import PDFExport from "./PDFExport";
import swal from "sweetalert";

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      title: "",
      message: "",
      wordCount: 0,
      setTime: 300000,
      elapsedTime: 300000,
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
      pdfClass: "hidden",
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

  // Sets the timer
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
          title: "Time's up!",
          text: "Restart the timer to continue writing",
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
    });
  };

  // Saves the title input in the component state, on change
  saveTitle = (e) => this.saveText(e, "title");

  // Saves the textarea input in the component state, on change
  saveMessage = (e) => {
    this.saveText(e, "message");
    this.setState(
      {
        isCountingDown: false,
      },
      () => {
        this.startTime();
      }
    );
  };

  // Stops the 15 second warning timer
  stopTime = () => this.setState({ isCountingDown: false });

  // Starts the 15 second warning timer
  startTime = () => this.setState({ isCountingDown: true });

  // Displays the word count as the user types
  wordCount = () => {
    const words = this.state.message;
    const numWords = words.split(" ").filter((item) => {
      return item !== "";
    });
    this.setState({ wordCount: numWords.length });
  };

  // Switch case for saving text inputs into the component state
  saveText = (e, typeOfText) => {
    switch (typeOfText) {
      case "title":
        this.setState({ title: e.target.value });
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
    }
  };

  // Toggles the visibility of the modal
  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
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

    this.setState({ percentTime: percent });

    document.documentElement.style.setProperty(
      "--inner-width",
      `${this.state.percentTime}%`
    );
  };

  //Toggles the light and dark mode theme
  toggleTheme = () => {
    this.setState({ lightMode: !this.state.lightMode });
    // Toggles the font and background colours
    if (this.state.lightMode) {
      this.setState({ theme: "lightMode" });
      document.documentElement.style.setProperty("--body-font-color", "black");
    } else {
      this.setState({ theme: "darkMode" });
      document.documentElement.style.setProperty("--body-font-color", "white");
    }
  };

  // Saves the input on submit
  savePDF = () => {
    this.setState({
      titleComplete: this.state.title,
      messageComplete: this.state.message,
      pdfClass: "",
    });
  };

  // Resets the form
  enableForm = () => {
    this.setState({
      formDisable: false,
      wordCount: 0,
    });
  };

  render() {
    return (
      <div className={`App ${this.state.theme}`}>
        {this.state.modalOpen ? (
          <Modal
            closeModal={this.toggleModal}
            selectPrompt={this.selectPrompt}
            userPrompts={this.state.userPrompts}
          />
        ) : null}

        <Header
          lightMode={this.state.lightMode}
          toggleTheme={this.toggleTheme}
        />

        <main className="wrapper">
          <div className="description">
            <p>The writing app that keeps you focused.</p>
            <p>Choose your prompt. Choose your time. Start writing!</p>
          </div>

          <div className="promptSelection">
            <h2>Choose Your Prompt</h2>
            <button onClick={this.getDailyPrompt}>Get Daily Prompt</button>
            <button onClick={this.toggleModal}>Get User Prompts</button>
          </div>

          <SelectForm
            setTimer={this.setTimer}
            getFormSelection={this.getFormSelection}
            startTime={this.startTime}
          />

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

            {/* <div className="saveToPDF">
              <PDFDownloadLink
                className={this.state.pdfClass}
                document={
                  <PDFExport
                    title={this.state.titleComplete}
                    message={this.state.messageComplete}
                  />
                }
                fileName={`${this.state.titleComplete}.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Loading document..." : "Download now!"
                }
              </PDFDownloadLink>
              {this.state.displayForm ? (
                <button
                  type="button"
                  onClick={this.savePDF}
                  aria-label="Save To PDF"
                >
                  <i className="far fa-file-pdf" aria-hidden="true"></i>
                </button>
              ) : null}
            </div> */}

            <Editor
              wordCount={this.wordCount}
              howManyWords={this.state.wordCount}
              isCountingDown={this.state.isCountingDown}
              saveTitle={this.saveTitle}
              stopTime={this.stopTime}
              startTime={this.startTime}
              displayForm={this.state.displayForm}
            />
            {/* {this.state.displayForm ? (
              <Form
                saveTitle={this.saveTitle}
                disableForm={this.state.formDisable}
                saveMessage={this.saveMessage}
                wordCount={this.state.wordCount}
                enableForm={this.enableForm}
              />
            ) : null} */}
          </div>
        </main>

        <footer className="wrapper">
          <p>
            ©2020 <a href="https://kajanthkumar.com/">Kajanth</a>,{" "}
            <a href="https://www.robinnong.com">Robin</a> and{" "}
            <a href="https://shanelbeebe.com/">Shanel</a>.
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
