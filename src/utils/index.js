import uuid from "uuid";

/**
 * This function colorized node by searchId
 */
export const color = (searchId, data, fill, stroke) => {
    let i, currentChild;

    if (searchId === data.unique) {
        if (data.nodeSvgShape) {
            data.nodeSvgShape.shapeProps = {
                ...data.nodeSvgShape.shapeProps,
                fill: fill
            }
        } else {
            data.nodeSvgShape = {
                shape: 'circle',
                shapeProps: {
                    r: 10,
                    fill: fill,
                    stroke: stroke
                },
            }
        }
    }

    if (data.children) {
        for (i = 0; i < data.children.length; i ++) {
            currentChild = data.children[i];
            color(searchId, currentChild, fill, stroke);
        }
    }

    return data;
};


/**
 * This function reset all colors
 */
export const clearGraph = data => {
    let currentChild, i;

    if (data.nodeSvgShape) {
        if (data.nodeSvgShape.shapeProps) {
            data.nodeSvgShape.shapeProps.fill = "#a94690";
            data.nodeSvgShape.shapeProps.stroke = "#837086";
        }
    }

    if (data.children) {
        for (i = 0; i < data.children.length; i ++) {
            currentChild = data.children[i];
            clearGraph(currentChild);
        }
    }

    return data;
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
                currentParent.children.map((item, idx) => item.unique === searched.unique ? currentParent.children.splice(idx, 1) : item)
                currentParent.children.push(...searched.children)

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
        alert("Сначала виделите узел в графе")
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
            for (i = 0; i < newData.children.length; i ++) {
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
    if (Object.keys(copied).length === 0) {
        alert("Сначала склонируйте ветку");
        return []
    } else {
        selected.map(item => addGraph(item, data, copied))
    }

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
