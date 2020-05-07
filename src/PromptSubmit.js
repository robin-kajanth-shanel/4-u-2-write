import React, { Component } from 'react';
import firebase from './firebase';

class PromptSubmit extends Component {
    constructor() {
        super();
        this.state={
            name: "Anonymous",
            prompt: ""
        }
    }

    // Saves the submitted prompt to Firebase
    submitPrompt = (e) => {
        e.preventDefault();
        const dbRef = firebase.database().ref()
        const object = { name: this.state.name, prompt: this.state.prompt }
        dbRef.push(object) 

        this.props.closeModal()
    }
    
    handleUserInput = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        return(
            <>
                <div className="modalTop"> 
                    <button className="backButton" onClick={this.props.back}>
                        <i className="fas fa-chevron-left"></i>
                        <p>Back to User Prompts</p>
                    </button>
                </div>
                <form action="" className="promptSubmitForm" onSubmit={this.submitPrompt}>
                    <label className="sr-only" htmlFor="name">Your Name (optional)</label>
                    <input type="text" id="name" placeholder="Your Name (optional)" onChange={this.handleUserInput}/>
                    <label className="sr-only" htmlFor="prompt">Your Prompt</label>
                    <textarea name="prompt" id="prompt" placeholder="Type your prompt here" required cols="20" rows="10" onChange={this.handleUserInput}></textarea> 
                    <button type="submit">Submit Prompt!</button>
                </form>
            </>
        )
    }
}

export default PromptSubmit;