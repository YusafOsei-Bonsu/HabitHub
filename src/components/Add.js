import React, { Component } from 'react'

export default class Add extends Component {

    state = {
        frequency: [false],
        name: ""
    }

    handleName = (e) => {
        this.setState({...this.state, name: e.target.value})
    }

    handleFrequency = (e) => {
        let completed = [];
        for (let i = 0; i < Number(e.target.value); i++) {
            completed.push(false)
        }
        this.setState({...this.state, frequency: completed})
    }

    render() {
        return (
        <div>
            <input id="habittext" required onChange={this.handleName} type="text" name="add" placeholder="Enter the habit..."></input>
            
            <p>Frequency per day: <select required onChange={this.handleFrequency}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select></p>
            
            <button onClick={this.props.addHabit.bind(this, this.state.name, this.state.frequency)} className="btn btn-lg add-habit">Add habit</button>
        </div>
        )
    }
}
