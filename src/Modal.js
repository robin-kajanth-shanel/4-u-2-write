import React, { Component } from 'react';

class Modal extends Component {
    render() {
        return(
            <div className="modal">
                <button onClick={this.props.exitModal}>Exit</button>
            </div>
        )
    }
}

export default Modal;