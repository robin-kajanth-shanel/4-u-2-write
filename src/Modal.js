import React, { Component } from 'react';
import UserPrompt from './UserPrompt' 
import PromptSubmit from './PromptSubmit'

class Modal extends Component {

    // constructor() {
    //     super();
    //     this.state ={
    //         userPrompts: []
    //     }
    // }

    // componentDidMount() {
    //     const dbRef = firebase.database().ref();
    //     const promptsArray = [];
    //     dbRef.on("value", (snapshot) => {
    //         const data = snapshot.val();
    //         for (let key in data) {
    //             console.log(data[key])
    //             promptsArray.unshift(data[key])
    //         }
    //     })
    //     this.setState({userPrompts: promptsArray});
    // }

    constructor() {
        super();
        this.state ={
            selectedPrompt: ""
        }
    }

    // showSubmitForm = () => {
        
    // }

    selectPrompt = (promptText) => {
        const selectedPrompt = promptText
        this.setState()
        this.props.selectPrompt(selectedPrompt)
    }

    render() {
            return (
                <div className="modal">
                    <button onClick={this.props.exitModal}>Exit</button> 
                    <ul>
                        {this.props.userPrompts.map((prompt, index) => {
                            return(
                                <UserPrompt 
                                    key={index}
                                    name={prompt.name}
                                    prompt={prompt.prompt}
                                    handleClick={this.props.selectPrompt}
                                /> 
                            )
                        })}
                    </ul>
                    <button onClick={this.showSubmitForm}>Submit a Prompt</button>
                    <PromptSubmit />
                </div>
            )
            }
    }


export default Modal;