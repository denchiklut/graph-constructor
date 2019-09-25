```jsx
import React, { Component } from 'react';
import GraphConstructor from './index.js';

const rect = {
    shape: 'rect',
    shapeProps: {
        width: 40,
        height: 40,
        y: -20,
        x: -20,
    }
}

class App extends Component {
    constructor() {
        super();
        this.graphConstructor = React.createRef();
        this.state = {
            data: [
                {
                    unique:'0',
                    name: 'Start',
                    children: [],
                }
            ],                
        }
        this.add = this.add.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
    };
    
    add() {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphConstructor.current.addNode(data)
    };

    insert() {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphConstructor.current.insertNode(data)
    };

    update({ type, temp, data }) {
        // Here you can update date from the backend 
        // console.log('Type of action', temp)
        // console.log('Data that wad added or removed ', temp)
        // console.log('Result data', data)
        this.setState({ data })
    }

    render() {
        const { data } = this.state;

        return (
            <div>
                <GraphConstructor
                    data={ data }
                    onChange={ this.update }
                    ref={ this.graphConstructor }
                    onError={ error => console.error(error) }
                    //nodeSvgShape={ rect }
                />

                <button onClick={ this.add }>add</button>
                <button onClick={ this.insert }>insert</button>
                <button onClick={ () => this.graphConstructor.current.removeNode() }>remove</button>
                <button onClick={ () => this.graphConstructor.current.cutNode() }>cut</button>
                <button onClick={ () => this.graphConstructor.current.copyBranch() }>Copy branch</button>
                <button onClick={ () => this.graphConstructor.current.pasteBranch() }>Paste branch</button>
            </div>
        );
    }
}; <App />
```
