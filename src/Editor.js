import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import SaveToPDF from "./SaveToPDF";

import Timer from "./Timer";

class Editor extends Component {
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
      completeText: "",
      textComplete: "",
      pdfClass: "visuallyHidden",
      isReady: false,
    };
    this.rteChange = this.rteChange.bind(this);
  }

  rteChange(content, delta, source, editor) {
    console.log("HTML", editor.getHTML());
    const justText = editor.getText(content);
    console.log("JustText", justText);
    this.setState(
      {
        text: content,
        completeText: justText,
      },
      () => {
        this.props.wordCount();
      }
    );
    console.log(this.state.text);
  }

  savePDF = async () => {
    await this.setState({
      textComplete: this.state.completeText,
      pdfClass: "",
      isReady: true,
    });
    console.log(
      "TextComplete",
      this.state.textComplete,
      this.state.titleComplete,
      this.state.pdfClass,
      this.state.isReady
    );
  };

  render() {
    return (
      <div>
        <SaveToPDF
          savePDF={this.savePDF}
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
            onChange={this.props.saveTitle}
          />
        </form>
        <ReactQuill
          theme="snow"
          modules={this.modules}
          formats={this.formats}
          onChange={this.rteChange}
          value={this.state.text}
          onKeyDown={this.props.stopTime}
          onKeyUp={this.props.startTime}
        />
        <div className="outer">
          <div className="inner"></div>
        </div>
        <div className="formBottomBar">
          <p>Word Count: {this.props.wordCount}</p>
          {/* <button onClick={this.clearForm}>Clear</button> */}
        </div>
      </div>
    );
  }
}

export default Editor;
