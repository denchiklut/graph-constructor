```jsx
import React from 'react';
import GraphBuilder from './index.js';
class App extends React.Component {
    constructor() {
        super();
        this.graphBuilder = React.createRef();
        this.add = this.add.bind(this);
        this.insert = this.insert.bind(this);
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

    render() {
        return (
            <div>
                <GraphBuilder
                    ref={ this.graphBuilder }
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
