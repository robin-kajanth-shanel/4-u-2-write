import React, { Component } from 'react'; 
import Modal from './Modal'
import firebase from './firebase';
import './styles.css';
class App extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      title: "",
      time: "",
      prompts: [],
      selectedPrompt: "",
      userPrompts: [],
    }
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const promptsArray = [];
      for (let key in data) {
        promptsArray.unshift(data[key])
      }
      this.setState({ userPrompts: promptsArray });
    })
  }

  setTimer = (e) => {
    e.preventDefault()
    // use setTimeout and this.state.time to set interval  
  }

  getFormSelection = (e) => { 
    this.setState({
      time: e.target.value
    })
  }

  saveTitle = (e) => { 
    this.saveText(e, "title")
  }

  saveMessage = (e) => {
    this.saveText(e, "message")
  }

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
    console.log(this.state.title)
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  } 

  selectPrompt = (prompt) => {
    const selectedPrompt = prompt.target.value;
    console.log("Prompt:", selectedPrompt);
    this.setState({ selectedPrompt: selectedPrompt });
    // display the selected prompt for the writer above the writing area
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
          <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ” </p>
          <button onClick={this.toggleModal}>Get User Generated Prompts</button>
          {this.state.modalOpen 
          ? <Modal 
          exitModal={this.toggleModal}
          selectPrompt={this.selectPrompt}
          userPrompts={this.state.userPrompts}
          /> 
          : null }
          <form action="" className="timeSelectForm" onSubmit={this.setTimer}>
            <label htmlFor="intervals">How long do you want to write?</label>
            <select name="intervals" id="intervals" onChange={this.getFormSelection}>
              <option value="">Select an option</option>
              <option value="300000">5 min</option>
            </select>
            <button type="submit">Submit</button>
          </form>

            <div>
              <p>Selected prompt: {this.state.selectedPrompt}</p>
              <button>Export to PDF</button>
              <form action="">
                <label htmlFor="">Title</label>
                <input type="text" placeholder="Title" onChange={this.saveTitle}/>
                <textarea name="" id="" cols="30" rows="10" onChange={this.saveMessage}></textarea>
                <div className="progressBar"></div>
              </form>
            </div>
        </main>

        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
