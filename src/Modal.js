import React, { Component } from 'react';
import UserPrompt from './UserPrompt' 
import PromptSubmit from './PromptSubmit'

class Modal extends Component {
    constructor() {
        super();
        this.state ={
            selectedPrompt: "",
            renderPrompts: true
        }
    } 
    
    selectPrompt = (promptText) => { 
        this.props.selectPrompt(promptText)
    }

    showForm = () => {
        this.setState({ renderPrompts: !this.state.renderPrompts })
    }

    render() {
            return (
                <div className="modalOuter">
                    <div className="modalInner">
                        <button className="exitButton" onClick={this.props.exitModal} aria-label="Exit modal">
                            <i className="far fa-times-circle" aria-hidden="true"></i>
                        </button> 
                        {this.state.renderPrompts ? 
                        <>
                            <div className="modalTop">
                                <h2>Prompts Submitted by Users</h2>
                                <button className="promptFormButton" onClick={this.showForm}>
                                    <p>Submit a Prompt</p>
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
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
                        </>
                        : <PromptSubmit closeModal={this.closeModal} back={this.showForm}/>    
                        }
                    </div>
                </div>
            )
            }
    }


export default Modal;