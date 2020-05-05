import React, {Component} from 'react';

class UserPrompt extends Component {

    render() {
        return (
            <li>
                <p>Submitted by: {this.props.name}</p>
                <p>{this.props.prompt}</p>
                <button onClick={this.props.handleClick}></button>
            </li>
        )
    }
    
}

export default UserPrompt;