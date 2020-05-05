import React, { Component } from 'react';
import UserPrompt from './UserPrompt' 
import PromptSubmit from './PromptSubmit'

class Modal extends Component {
<<<<<<< HEAD
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

=======
    constructor() {
        super();
        this.state ={
            selectedPrompt: ""
        }
    }

>>>>>>> e5cf98ecc10d79c60952cc5b1251748fc7617839
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
<<<<<<< HEAD
                    {/* {this.props.userPrompts.map((prompt, index) => {
=======
                    {this.props.userPrompts.map((prompt, index) => {
                        
>>>>>>> e5cf98ecc10d79c60952cc5b1251748fc7617839
                        return(
                            <UserPrompt 
                                key={index}
                                name={prompt.name}
                                prompt={prompt.prompt}
                                handleClick={this.props.selectPrompt}
                            /> 
                        )
                    })} */}

                    {this.props.children}
                </ul>
                <button onClick={this.showSubmitForm}>Submit a Prompt</button>
                <PromptSubmit />
            </div>
        )
    }
}

export default Modal;