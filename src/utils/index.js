import uuid from "uuid";

/**
 * This function colorized node by searchId
 */
export const color = (searchId, data, svgShape, fill, stroke) => {
    let i, currentChild;

    if (searchId === data.unique) {
        if (data.nodeSvgShape) {
            data.nodeSvgShape.shapeProps = {
                ...data.nodeSvgShape.shapeProps,
                fill: fill,
                stroke: stroke
            }
        } else {
            data.nodeSvgShape = { ...svgShape,
                shapeProps: {
                    ...svgShape.shapeProps,
                    fill: fill,
                    stroke: stroke,
                }
            }
        }
    }

    if (data.children) {
        for (i = 0; i < data.children.length; i++) {
            currentChild = data.children[i];
            color(searchId, currentChild, svgShape, fill, stroke);
        }
    }

    return data;
};


/**
 * This function reset all colors
 */
export const clearGraph = (data, svgShape, fill, stroke) => {
    let currentChild, i;

    if (data.nodeSvgShape) {
        if (data.nodeSvgShape.shapeProps) {
            data.nodeSvgShape.shapeProps.fill = fill;
            data.nodeSvgShape.shapeProps.stroke = stroke;
        }
    } else {
        data.nodeSvgShape = { ...svgShape,
            shapeProps: {
                ...svgShape.shapeProps,
                fill: fill,
                stroke: stroke,
            }
        }
    }

    if (data.children) {
        for (i = 0; i < data.children.length; i++) {
            currentChild = data.children[i];
            clearGraph(currentChild, svgShape, fill, stroke);
        }
    }

    return data;
};

/**
 * This function add node
 */
export const addNode = (selected, graphData, newData, svgShape) => {
    let added = [];

    const add = (searched, data) => {
        let i, currentChild;

        if (searched.unique === data.unique) {
            data.children.push(
                {
                    name: newData.name,
                    unique: uuid.v4(),
                    nodeSvgShape: { ...svgShape },
                    children: []
                });

            added.push(data.children[0]);
        } else {
            for (i = 0; i < data.children.length; i++) {
                currentChild = data.children[i];
                add(searched, currentChild);
            }
        }

        return data ;
    };

    const data = selected.map(item => add(item, graphData));

    return { added, data };
};


/**
 * This function remove node from graph
 */
export const remove = (searchId, data) => {
    let i, currentChild;

    for (i = 0; i < data.children.length; i++) {
        currentChild = data.children[i];

        if (searchId === currentChild.unique) {
            data.children.splice(i, 1);
        }

        remove(searchId, currentChild);
    }

    return data
};


/**
 * This function insert node to graph
 */
export const insertNode = (selected, graphData, newData, svgShape) => {
    let inserted = [];

    const insert = (searched, graphData) => {
        let i, currentChild;

        if (searched.unique === graphData.unique) {
            const oldChildren = graphData.children ? graphData.children.slice(): [];
            graphData.children = [];

            graphData.children.push(
                {
                    name: newData.name,
                    unique:   uuid.v4(),
                    nodeSvgShape: { ...svgShape },
                    children: [...oldChildren]
                });

            inserted.push(graphData.children[0])

        } else {
            for (i = 0; i < graphData.children.length; i++) {
                currentChild = graphData.children[i];
                insert(searched, currentChild);
            }
        }

        return graphData;
    };
    const data = selected.map(item => insert(item, graphData));

    return { inserted, data };
};


/**
 * This function cut node from graph
 */
export const cut = (searched, graphData) => {
    let i, currentChild, currentParent, result;

    if (searched.unique === graphData.unique) {
        return { status: true, data: graphData }
    }

    else {
        for (i = 0; i < graphData.children.length; i++) {
            currentChild = graphData.children[i];

            if (searched.unique === currentChild.unique) {
                currentParent = graphData
            }

            result = cut(searched, currentChild);

            if (result.status) {
                currentParent.children.map((item, idx) => item.unique === searched.unique ? currentParent.children.splice(idx, 1) : item);
                currentParent.children.push(...searched.children);

                removeTrash(graphData.children)
            }
        }

        return { status: false, data: graphData };
    }
};


/**
 * This function copy graph
 */
export const copy = (data) => {
    let newSelected = [];

    if (Object.keys(data).length === 0) {
        alert("Сначала виделите узел в графе");
        return true
    }

    const clrData = newData => {
        let i, currentChild;

        newSelected.push(newData);
        delete(newData.id);
        delete(newData.parent);
        delete(newData.depth);
        delete(newData._collapsed);
        delete(newData._children);
        delete(newData.x);
        delete(newData.y);

        if (newData.children)  {
            for (i = 0; i < newData.children.length; i++) {
                currentChild = newData.children[i];
                clrData(currentChild);
            }
        }
    };

    clrData(data);

    return { newSelected, data }
};


/**
 * This function paste graph
 */
export const paste = (data, selected, copied) => {
    selected.map(item => addGraph(item, data, copied));
    return data;
};


/**
 * This is a helper function.
 * It pastes copied graph
 */
function addGraph(searched, newData, copied) {
    if (searched.unique === newData.unique) {
        newData.children.push(setUnique(JSON.parse(JSON.stringify(copied))))
    } else {
        if (newData.children) {
            for (let i = 0; i < newData.children.length; i++) {
                addGraph(searched, newData.children[i], copied)
            }
        }
        return true;
    }
}


/**
 * This is a helper function.
 * It sets unique keys for pasted graph
 */
function setUnique(data) {
    let i, currentChild;

    data.unique = uuid.v4();
    if (data.children)  {
        for (i = 0; i < data.children.length; i++) {
            currentChild = data.children[i];
            currentChild.unique = uuid.v4();

            setUnique(currentChild);
        }
    } else {
        data.children = []
    }

    return data
}


/**
 * This is a helper function.
 * It removes all metadata to build a val
 */
function removeTrash(arr) {
    arr.map(item => {
        item.children ? removeTrash(item.children) : item.children = [];
        delete(item.id);
        delete(item.x);
        delete(item.y);
        delete(item.depth);
        delete(item.parent);
        delete(item._children);
        delete(item._collapsed);
    })
}
