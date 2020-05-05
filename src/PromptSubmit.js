import React, { Component } from 'react';
import firebase from './firebase';

class PromptSubmit extends Component {
    constructor() {
        super();
        this.state={
            name: "",
            prompt: ""
        }
    }

    submitPrompt = (e) => {
        e.preventDefault();
        const dbRef = firebase.database().ref()
        const object = { name: this.state.name, prompt: this.state.prompt }
        dbRef.push(object) 
    }
    
    handleUserInput = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        return(
            <form action="" className="promptSubmitForm" onSubmit={this.submitPrompt}>
                <label className="visuallyHidden" htmlFor="name">Your Name (optional)</label>
                <input type="text" id="name" placeholder="Your Name (optional)" onChange={this.handleUserInput}/>
                <label className="visuallyHidden" htmlFor="prompt">Your Prompt</label>
                <textarea name="prompt" id="prompt" placeholder="Type your prompt here" required cols="30" rows="10" onChange={this.handleUserInput}></textarea> 
                <button type="submit">Submit Prompt!</button>
            </form>
        )
    }
}

export default PromptSubmit;