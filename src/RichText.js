import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import Timer from "./Timer";
import SaveToPDF from "./SaveToPDF";

class RichText extends Component {
  constructor(props) {
    super(props);

    this.modules = {
      toolbar: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    };

    this.formats = [
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "list",
      "bullet",
      "align",
      "color",
      "background",
    ];

    this.state = {
      text: "",
      title: "",
      wordCount: 0,
      isCountingDown: false,
      titleComplete: "",
      textComplete: "",
      pdfClass: "visuallyHidden",
      isReady: false,
    };

    this.rteChange = this.rteChange.bind(this);
  }

  wordCount = () => {
    const words = this.state.text;
    const numWords = words.split(" ").filter((item) => {
      return item !== "";
    });
    this.setState({
      wordCount: numWords.length,
    });
  };

  rteChange(content, delta, source, editor) {
    console.log("HTML", editor.getHTML());
    const justText = editor.getText();
    this.setState(
      {
        text: content,
      },
      () => {
        this.wordCount();
      }
    );
    console.log(this.state.text);
  }

  // Switch case for saving text inputs into the component state
  saveText = (e, typeOfText) => {
    switch (typeOfText) {
      case "title":
        this.setState({
          title: e.target.value,
        });
        break;
      default:
        console.log("no text state to save found");
    }
  };

  // Saves the title input in the component state, on change
  saveTitle = (e) => {
    this.saveText(e, "title");
  };

  savePDF = async () => {
    await this.setState({
      titleComplete: this.state.title,
      textComplete: this.state.text,
      pdfClass: "",
      isReady: true,
    });
    console.log(
      this.state.textComplete,
      this.state.titleComplete,
      this.state.pdfClass
    );
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

  clearForm = () => {
    this.setState({
      text: "",
      wordCount: 0,
    });
  };

  render() {
    return (
      <div>
        {this.state.isCountingDown ? (
          <Timer
            secondsToCount="15"
            sendTime={this.props.getTime}
            keepChecking={this.props.keepChecking}
          />
        ) : null}

        <SaveToPDF
          savePDF={this.savePDF}
          title={this.state.titleComplete}
          text={this.state.textComplete}
          displayForm={this.props.displayForm}
          pdfClass={this.state.pdfClass}
          isReady={this.state.isReady}
        />

        <form action="" className="writingForm">
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            type="text"
            className="title"
            id="title"
            placeholder="Title"
            onChange={this.saveTitle}
          />
        </form>
        <ReactQuill
          theme="snow"
          modules={this.modules}
          formats={this.formats}
          onChange={this.rteChange}
          value={this.state.text}
          onKeyDown={this.stopTime}
          onKeyUp={this.startTime}
        />
        <div className="outer">
          <div className="inner"></div>
        </div>
        <div className="formBottomBar">
          <p>Word Count: {this.state.wordCount}</p>
          <button onClick={this.clearForm}>Clear</button>
        </div>
      </div>
    );
  }
}

export default RichText;
