## GraphBuilder

GraphBuilder is a graph constructor 
![alt image](http://imgs-info.ru/2019/09/24/SNIMOK-EKRANA-2019-09-23-V-23.34.37.png)
## Usage example

```jsx
import React, { Component } from 'react';
import GraphBuilder from 'graph-builder';


class App extends React {
    graphBuilder = React.createRef();

    state = {
        data: [
            {
                unique:'0',
                name: 'Start',
                children: [],
            }
        ],                
    }
    
    add = () => {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphBuilder.current.addNode(data);
    };

    insert = () => {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphBuilder.current.insertNode(data);
    };

    update = ({ type, temp, data }) => {
        // Here you can update date from the backend 
        // console.log('Type of action', temp)
        // console.log('Data that wad added or removed ', temp)
        // console.log('Result data', data)
        this.setState({ data })
    }

    render() {
        return (
            <div>
                <GraphBuilder
                    data={ data }
                    onChange={ this.update }
                    ref={ this.graphBuilder }
                    onError={ error => console.error(error) }
                    onNodeCLick={ node => console.error(node) }
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
};
```

## props

| Name                      | Type    | Default                               | Description                        |
| ------------------------- | ------- | ------------------------------------- | ---------------------------------- |
| data                      | array   |Required                               |                                    |
| onChange                  | func    |Function.prototype                     |                                    |
| onError                   | func    |Function.prototype                     |                                    |
| onNodeCLick               | func    |Function.prototype                     |                                    |
| styles                    | object  |null                                   |                                    |
| orientation               | string  |vertical                               |                                    |
| wrapperClassName          | string  |null                                   |                                    |
| textLayout                | object  |{ x: 28, y: 0, }                       |                                    |
| scale                     | object  |{ min: 0.1, max: 8 }                   |                                    |
| selectedColor             | object  |{ fill: '#ca2750', stroke: '#f50057' } |                                    |
| copiedColor               | object  |{ fill: '#ff8e53', stroke: '#f57100' } |                                    |

