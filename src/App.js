import React, { Component } from "react";
import Modal from "./Modal";
import firebase from "./firebase";
import Header from "./Header";
import DailyPrompts from "./DailyPrompts";
import Timer from "./Timer";
import SelectForm from "./SelectForm";
import "./styles.css";
import swal from "sweetalert";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      message: "",
      wordCount: 0,
      setTime: 300000,
      elapsedTime: 300000,
      prompts: [],
      selectedPrompt: "None selected",
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
      htmlMessage: "",
      configuration: {
          toolbar: ['heading', 'bold', 'italic', 'bulletedList', 'numberedList', 'alignment', 'blockQuote', 'link']
      }
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

    ClassicEditor
      .create(document.querySelector('#editor'),
        {
          alignment: {
            options: ['left', 'center', 'right']
          }
        }
      ) 
      .catch(error => {
        console.error(error);
      });
  }

  // Gets the prompt of the day from the imported DailyPrompt function component
  getDailyPrompt = () => {
    const dailyPromptsArray = DailyPrompts();
    const today = new Date().getDate();
    const prompt = dailyPromptsArray[today - 1].dailyPrompt;
    this.setState({ selectedPrompt: prompt });
  };

  // Sets the timer
  setTimer = (e) => {
    e.preventDefault();

    this.setState({ formDisable: false });

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

  // Saves the textarea input in the component state, on change
  saveMessage = (e) => {
    this.saveText(e, "message");
    this.setState({ isCountingDown: false }, () => { this.startTime() });
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

  // Saves text input into the component state and updates the word count
  saveText = (e) => {
    this.setState({ message: e.target.value }, () => { this.wordCount() }); 
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

  // Resets the form
  enableForm = () => {
    this.setState({
      formDisable: false,
      wordCount: 0,
    });
  };

  getPlainText(text) {
    return text.replace(/<[^>]*>/g, '');
  }

  handleEditorChange = (e, editor) => { 
    const text = this.getPlainText(editor.getData());
    this.setState({
      htmlMessage: editor.getData(),
      message: text,
      isCountingDown: false
      }, () => {
        this.wordCount(); 
        this.startTime();
      }
    );
  }

  printWindow = () => {
    const printArea = document.querySelector('.printArea') 
    printArea.innerHTML = this.state.htmlMessage 
    window.print();
  }

  render() {
    return (
      <>
        <div className="printArea">
        </div>
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

            {this.state.isCountingDown ? 
              <Timer
                secondsToCount="15"
                sendTime={this.getTime}
                keepChecking={this.state.keepChecking}
              />
            : null}

            <div className="writingComponent">
              <h3>Selected Prompt:</h3>
              <p className="prompt">{this.state.selectedPrompt}</p>

              {this.state.displayForm ? (
                <>
                  <CKEditor
                    config={this.state.configuration}
                    editor={ClassicEditor}
                    disabled={this.state.formDisable ? true : false}
                    onChange={this.handleEditorChange}
                  />
                  <div className="outer">
                    <div className="inner"></div>
                  </div>
                  <div className="formBottomBar">
                    <p>Word Count: {this.state.wordCount}</p>
                    <button className="saveToPDF" onClick={this.printWindow} aria-label="Save To PDF">
                        <i className="far fa-file-pdf" aria-hidden="true"></i> 
                    </button> 
                  </div>
                </>
              ) : null}
            </div>
          </main>

          <footer className="wrapper">
            <p>
              ©2020 <a href="https://kajanthkumar.com/">Kajanth</a>, <a href="https://www.robinnong.com">Robin</a> and <a href="https://shanelbeebe.com/">Shanel</a>. Daily prompts provided by <a href="https://thestoryshack.com/">StoryShack</a>.
            </p>
          </footer>
        </div>
      </>
    );
  }
}

export default App;
