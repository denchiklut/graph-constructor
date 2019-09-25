## GraphConstructor

GraphConstructor is a graph constructor 
![alt image](http://imgs-info.ru/2019/09/24/SNIMOK-EKRANA-2019-09-23-V-23.34.37.png)
## Usage example
##### You can select multiple nodes with `alt` button pressed
```jsx
import React, { Component } from 'react';
import GraphConstructor from 'graph-constructor';

const svgStyle = {
    nodes: {
        node: {
            circle: {
                fill: "#a94690",
                stroke: '#837086',
                strokeWidth: 1
            }
        },
        leafNode: {
            circle: {
                fill: "#a94690",
                stroke: '#837086',
                strokeWidth: 1
            }
        }
    }
};

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
    graphConstructor = React.createRef();

    state = {
        data: [
            {
                unique:'0',
                name: 'Start',
                children: [],
            }
        ]
    };

    add = () => {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphConstructor.current.addNode(data);
    };

    insert = () => {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphConstructor.current.insertNode(data);
    };

    update = ({ type, temp, data }) => {
        // Here you can update date from the backend
        // console.log('Type of action', temp)
        // console.log('Data that was added or removed ', temp)
        // console.log('Result data', data)
        this.setState({ data })
    }

    render() {
        const { data } = this.state;

        return (
            <div>
                <GraphConstructor
                    data={ data }
                    styles={ svgStyle }
                    onChange={ this.update }
                    nodeSvgShape={ rect }
                    ref={ this.graphConstructor }
                    onNodeCLick={ node => console.log(node) }
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
};

export default App;

```

## props

| Name                      | Type    | Default                               |
| ------------------------- | ------- | ------------------------------------- |
| data                      | array   |Required                               |
| onChange                  | func    |Function.prototype                     |
| onError                   | func    |Function.prototype                     |
| onNodeCLick               | func    |Function.prototype                     |
| styles                    | object  |null                                   |
| orientation               | string  |vertical                               |
| wrapperClassName          | string  |null                                   |
| textLayout                | object  |{ x: 28, y: 0, }                       |
| scale                     | object  |{ min: 0.1, max: 8 }                   |
| selectedColor             | object  |{ fill: '#ca2750', stroke: '#f50057' } |
| copiedColor               | object  |{ fill: '#ff8e53', stroke: '#f57100' } |
| nodeSvgShape              | object  |Circle object look at Readme.md        |


## onChange
`onChange` is a function that will be call when you will manipulate with graph data

##### What actions you can do with graph?
1. You can add node
2. You can insert node between to existing
3. You can remove node with all children of deleted node
4. You can cut node! It will add all children from deleted node to parent!
5. You can clone some piece of tree and paste in another place of graph 

Whenever one of these actions occurs, the `onChange` function is called with 3 arguments.
1. `type`: `CLONE_TREE`, `ADD_NODE`, `INSERT_NODE`, `REMOVE_NODE`, `CUT_NODE`
2. `temp`: data that was added or removed or was cloned depends on action occurred
3. `data`: this is current graph data 


## Shapes
By default all nodes in graph are circle. 
Pass `nodeSvgShape` prop to GraphConstructor to specify what shapes of nodes do you want

To change shapes in a specific node you should pass an object `nodeSvgShape`.
This is a square example!
```
{
    unique: '0',
    children: [],
    name: 'some name',
    nodeSvgShape: {
        shape: 'rect',
        shapeProps: {
            fill: '#21cbf3',
            stroke: '#939fe4',
            width: 20,
            height: 20,
            x: -10,
            y: -10,
        }
    }
}
```

All shapes 

##### circle
```
{
    shape: 'circle',
    shapeProps: {
        r: 20,
    },
}
```


##### rect
```
{
    shape: 'rect',
    shapeProps: {
        width: 40,
        height: 40,
        y: -20,
        x: -20,
    }
}
```

##### ellipse
```
{
    shape: 'ellipse',
    shapeProps: {
        rx: 20,
        ry: 40,
    }
}
```

##### none
```
{
    shape: 'none'
}
```
