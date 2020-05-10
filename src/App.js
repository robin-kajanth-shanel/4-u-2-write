import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Modal from "./Modal";
import firebase from "./firebase";
import DailyPrompts from "./DailyPrompts";
import Timer from "./Timer";
import "./styles.css";
import { PDFViewer, PDFDownloadLink, Document, Page } from '@react-pdf/renderer';
import PDFExport from './PDFExport';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RichTextEditor from './RichTextEditor'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
// window.html2canvas = html2canvas;



class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      title: "Title",
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
      messageComplete: "",
      htmlMessage: ""
    };

    this.modules = {
      toolbar: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ]
    };

    this.formats = [
      'font',
      'size',
      'bold', 'italic', 'underline',
      'list', 'bullet',
      'align',
      'color', 'background'
    ];

    this.rteChange = this.rteChange.bind(this);
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
    //start the stay awake 15 second timer
    this.startTime()

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

  rteChange = (content, delta, source, editor) => {
    console.log(editor.getHTML()); // rich text
    console.log(editor.getText()); // plain text
    console.log(editor.getLength()); // number of characters
  }

  handleEditorChange = (e, editor) => {
    const text = this.getPlainText(editor.getData());
      this.setState({ 
        htmlMessage: editor.getData(),
        message: text
      }, () => {
          this.stopTime();
          this.startTime();
      }
      );
      
  }

  // copied from https://stackoverflow.com/questions/12895795/getting-non-html-text-from-ckeditor
  getPlainText(text) {
    // console.log(text);
    return text.replace(/<[^>]*>/g, '');;
}

  savejsPDF = () => {

    // attempt 1

    // let doc = new jsPDF('p', 'pt', 'a4');
    // doc.setFontSize(18);
    // let elementHTML = this.state.htmlMessage;
    // const div = document.getElementById('hidden');
    // div.insertAdjacentHTML('beforeend', elementHTML);
    // console.log(div);
    // doc.addHTML( div, function() {
    //   doc.save(`${this.state.title}JSPDF.pdf`);
    // });


    // attempt2


    // const filename = `${this.state.title}JSPDF.pdf`;

    // html2canvas(this.state.htmlMessage).then(canvas => {
    //   let pdf = new jsPDF('p', 'mm', 'a4');
    //   pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
    //   pdf.save(filename);
    // });
    // var pdf = new jsPDF('p', 'pt', 'a4');
    // console.log(elementHTML);
    // pdf.addHTML(div, function () {
    //   pdf.save('filename.pdf');
    // // });
    // let element = document.getElementById('element-to-print');
    // var element = document.getElementById('hidden');
    // html2pdf(element);


    // attempt 3


    


  }

  //only 30 api requests allowed per hour
  sejdaCall = () => {
    console.log("sejda CALLED");
    const apikey = 'api_E8E31975EC4D4AC9AF6AA05EBB6730E7';
    const corsenabledApiKey = 'api_public_30b85e8b214d4bbd81875c376a043811';
    const apikeynoline = `E8E31975EC4D4AC9AF6AA05EBB6730E7`;
    const corsenabledApiKeynoline = '30b85e8b214d4bbd81875c376a043811';

    axios({
      method: `POST`,
      'Content-Type': 'application/json',
      url: "https://api.sejda.com/v2/html-pdf",
      params: {
        filename: 'out.pdf',
        pageSize: 'a4',
        publishableKey: corsenabledApiKey,
        htmlcode: encodeURIComponent(this.state.htmlMessage)
      }
      }).then(() => {
        
      });
    
  }

  savehtml2pdf = () => {
    let elementHTML = this.state.htmlMessage;
    const div = document.getElementById('hidden');
    div.insertAdjacentHTML('beforeend', elementHTML);
      const options = {
        filename: 'output.pdf',
        image: { type: 'jpeg'},
        html2canvas:{},
        jsPDF:{orientation: 'landscape'}
      }
    console.log(div);

    html2pdf().from(div).set(options).save();
  }


  pdflayer = () => {

    const apiKey = 'b99c095367b4eea1ff3208b8aac4b1a0';
    const pdfURL = `http://api.pdflayer.com/api/convert`;
    const htmlData = this.state.htmlMessage;
    // const BASE_URL = 'http://api.pdflayer.com/api/convert?access_key=' + apiKey+ '&document_html=' + htmlData;

    axios({
      method: `POST`,
      'Content-Type': 'application/json',
      url: pdfURL,
      encoding: null,
      responseType: 'blob',
      params: {
        document_name: 'pdflayer.pdf',
        access_key: apiKey,
        document_url: "https://kajanthkumar.com/",
      }
    }).then((response) => {
      //download the incoming pdf copied from https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.pdf');
      document.body.appendChild(link);
      link.click();
    });



    // let config = require('./../config');
    // let request = require('request');
    // let ACCESS_KEY = '?access_key=' + config.pdflayer_acccess_key;
    // const BASE_URL = 'http://api.pdflayer.com/api/convert?access_key='+ apiKey;
    // const API_URL = BASE_URL + ACCESS_KEY;

    // let formData = {
    //         document_html: this.state.htmlMessage
    //     }

    // axios.post({ url: BASE_URL, formData: formData, encoding: null}, function optionalCallback(err, httpResponse, body) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //           // Here you can save the file or do anything else with it
    //             console.log(body);
    //         }
    //     });
  }

  htmlRocket = () => {
    const url = "http://api.html2pdfrocket.com/pdf";
    const apiKey = `0632e472-7bd4-4d36-bad9-01d6509a662b`;

    const htmlToSend = encodeURIComponent(this.state.htmlMessage);
    const data = "apikey=" + apiKey + "&value=" + htmlToSend;

    axios({
      method: `POST`,
      'Content-Type': 'application/json',
      url: url,
      document_html: encodeURIComponent(this.state.htmlMessage),
      responseType: 'blob',
      params: {
        data: data
      }
    }).then((res) => {

    });
  }

  render() {
    return (
      <div className={`App ${this.state.theme}`} >
        <header className="wrapper">
          <h1>Story Starter</h1>
          <div className="toggleButton">
            <span>{this.state.lightMode ? "Light" : "Dark"} Mode</span>
            <button className={this.state.lightMode ? "move" : null} onClick={this.toggleTheme}>
              <i className="fas fa-moon"></i>
              <i className="fas fa-sun"></i>
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
              <option value="30000">30 sec</option>
              <option value="300000">5 min</option>
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
            <p>{this.state.selectedPrompt}</p>
            <div className="timesUp">
              <p>
                {this.state.formDisable
                  ? "Time's up! Restart the timer to continue writing"
                  : null}
              </p>
            </div>
            <button onClick={this.savejsPDF}>JSPDF</button>
            <button onClick={this.savehtml2pdf}>html2pdf</button>
            <button onClick={this.sejdaCall}>sejdaCall</button>
            <button onClick={this.pdflayer}>PDFlayer</button>
            <div id="hidden"></div>
            <div className="saveToPDF">
              <PDFDownloadLink className={this.state.pdfClass} document={
                <PDFExport
                  title={this.state.titleComplete}
                  message={this.state.messageComplete}
                  htmlMessage={this.state.htmlMessage}
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
                  </form>
                    {/* <ReactQuill theme="snow" modules={this.modules}
                    formats={this.formats} onChange={this.rteChange}
                    value={this.state.message} /> */}
                    <CKEditor
                      editor={ClassicEditor}
                      disabled={this.state.formDisable ? true : false}
                      onChange={this.handleEditorChange}
                      />
                    <textarea
                      name=""
                      id=""
                      cols="30"
                      rows="10"
                      onKeyDown={this.stopTime}
                      onKeyUp={this.startTime}
                    ></textarea>
                    <div className="formBottomBar">
                      <p>Word Count: {this.state.wordCount}</p>
                      <button type="reset" onClick={this.enableForm}>Clear</button>
                    </div>
                  <div className="outer">
                    <div className="inner"></div>
                  </div>
                </>
              )
              : null}
          </div>
        </main>

        <footer></footer>
      </div>
    );
  }
}


export default App;
