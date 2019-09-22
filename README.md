## MbxPlaces

MbxPlaces is a simple address suggester based on MapBox API
![alt image](http://imgs-info.ru/2019/09/16/SNIMOK-EKRANA-2019-09-16-V-13.30.333367bb19f5bbac1c.png)
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
