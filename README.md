## MbxPlaces

GraphBuilder is a graph constructor 
![alt image](http://imgs-info.ru/2019/09/24/SNIMOK-EKRANA-2019-09-23-V-23.34.37.png)
## Usage example

```js
```js
<GraphBuilder />
```
```js
<GraphBuilder
    onNodeCLick={ node => console.log(node) }
    onAddNode={ node => console.log(node) }
/>
```

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
