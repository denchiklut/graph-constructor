## MbxPlaces

GraphBuilder is a graph constructor 
![alt image](http://imgs-info.ru/2019/09/24/SNIMOK-EKRANA-2019-09-23-V-23.34.37.png)
## Usage example

```jsx
import React from 'react';
import GraphBuilder from 'graph-builder';
class App extends React.Component {
    graphBuilder = React.createRef();
    
    add = () => {
        const name = prompt('Enter name', '');
        const data = { name };
        this.graphBuilder.current.addNode(data)
    };

    insert = () => {
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

## props

| Name                      | Type    | Default  | Description                        |
| ------------------------- | ------- | -------- | ---------------------------------- |
| limit                     | number  | 5        | count of suggested addresses       |
| onSelect                  | func    | required | handler on address selected        |
| apiKey                    | string  | required | your API key for MapBox            |
| bbox                      | array   | null     | bbox of searching area             |
| inputClassname            | string  | null     | Custom class for input             |
| placeholder               | string  | address  | Input placeholder                  |
| initialValue              | string  | null     | Default value                      |
| suggestedItemClassname    | string  | null     | Custom class for suggested item    |
| wrapperClassname          | string  | null     | Custom class for wrapper container |
| suggestedWrapperClassname | string  | null     | Custom class for list wrapper      |
