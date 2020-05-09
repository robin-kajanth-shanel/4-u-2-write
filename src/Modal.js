import React, { Component } from 'react';
import UserPrompt from './UserPrompt'
import PromptSubmit from './PromptSubmit'

class Modal extends Component {
    constructor() {
        super();
        this.state = {
            selectedPrompt: "",
            renderPrompts: true
        }
    }

    // Sends the text of the chosen prompt to the parent component to have it displayed
    selectPrompt = promptText => this.props.selectPrompt(promptText)

    // Toggles the visibility of the prompt submission component on button click
    showForm = () => { this.setState({ renderPrompts: !this.state.renderPrompts }) }

    render() {
        return (
            <div className="modalOuter">
                <div className="modalInner">
                    <button className="exitButton" onClick={this.props.closeModal} aria-label="Exit modal">
                        <i className="far fa-times-circle" aria-hidden="true"></i>
                    </button>
                    {this.state.renderPrompts ?
                        <>
                            <div className="modalTop">
                                <h2>Prompts Submitted by Users</h2>
                                <button onClick={this.showForm}>
                                    <p>Submit a Prompt</p>
                                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                                </button>
                            </div>
                            <ul>
                                {this.props.userPrompts.map((prompt, index) => {
                                    return (
                                        <UserPrompt
                                            key={index}
                                            name={prompt.name}
                                            prompt={prompt.prompt}
                                            handleClick={this.props.selectPrompt}
                                        />
                                    )
                                })}
                            </ul>
                        </>
                        : <PromptSubmit closeModal={this.props.closeModal} back={this.showForm} />
                    }
                </div>
            </div>
        )
    }
}


export default Modal;