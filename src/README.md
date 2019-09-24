```jsx
import React from 'react';
import GraphBuilder from './index.js';


class App extends React.Component {
    constructor() {
        super();
        this.graphBuilder = React.createRef();
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
        this.graphBuilder.current.addNode(data)
    };

    insert() {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphBuilder.current.insertNode(data)
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
                <GraphBuilder
                    data={ data }
                    onChange={ this.update }
                    ref={ this.graphBuilder }
                    onError={ e => console.error(e.type) }
                />

                <button onClick={ this.add }>add</button>
                <button onClick={ this.insert }>insert</button>
                <button onClick={ () => this.graphBuilder.current.removeNode() }>remove</button>
                <button onClick={ () => this.graphBuilder.current.cutNode() }>cut</button>
                <button onClick={ () => this.graphBuilder.current.copyBranch() }>Copy branch</button>
                <button onClick={ () => this.graphBuilder.current.pasteBranch() }>Paste branch</button>
            </div>
        );
    }
}; <App />
```
