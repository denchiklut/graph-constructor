import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from 'react-d3-tree';
import uuid from 'uuid';
import cn from 'classnames';

import { color, clearGraph, remove, cut, copy, paste, addNode, insertNode } from "./utils";

import './index.css';

const svgStyle = {
    nodes: {
        node: {
            circle: {
                fill: "#a94690",
                stroke: '#837086',
                strokeWidth: 1,
                transform: 'scale(2,2)'

            }
        },
        leafNode: {
            circle: {
                fill: "#a94690",
                stroke: '#837086',
                strokeWidth: 1,
                transform: 'scale(2,2)'
            }
        }
    }
};

class GraphBuilder extends Component {
    static propTypes = {
        onNodeCLick: PropTypes.func,
        onAddNode: PropTypes.func,
        onInsertNode: PropTypes.func,
        onRemoveNode: PropTypes.func,
        onCutNode: PropTypes.func,
        onCopyTree: PropTypes.func,
        onPasteTree: PropTypes.func,
        onError: PropTypes.func,
        orientation: PropTypes.string,
        collapsible: PropTypes.bool,
        styles: PropTypes.objectOf({}),
        wrapperClassName: PropTypes.string
    };

    static defaultProps = {
        onNodeCLick: Function.prototype,
        onAddNode: Function.prototype,
        onInsertNode: Function.prototype,
        onRemoveNode: Function.prototype,
        onCutNode: Function.prototype,
        onCopyTree: Function.prototype,
        onPasteTree: Function.prototype,
        onError: Function.prototype,
        styles: null,
        collapsible: false,
        orientation: 'vertical',
        wrapperClassName: null
    };

    state = {
        data: [
            {
                unique:'0',
                name: '0',
                children: [
                    {
                        unique: uuid.v4(),
                        name: '1',
                        children: []
                    },
                    {
                        unique: uuid.v4(),
                        name: '2',
                        children: []
                    },
                ],
            },
        ],
        selected: [],
    };

    copyBranch = () => {
        const { selected } = this.state;
        const copied = copy(selected[0]);

        this.colorizeNode(copied.newSelected, "#ff8e53", "#f57100");
        this.setState({ copied: copied.data });
        // this.props.onCopyTree(copied.data)
    };

    pasteBranch = () => {
        const { data, selected, copied } = this.state;
        const pastedData = paste(data[0], selected, copied);

        this.setState({ selected: [], data: [pastedData] },
            () =>  {
                this.props.onPasteTree([pastedData]);
                this.clear();
            });
    };

    addNode = nodeData => {
        const { data, selected } = this.state;
        if (selected.length === 0) return alert('Выберите элемент');
        const updateData = addNode(selected, data[0], nodeData);
        this.clear();

        this.setState({ selected: updateData.added, data: updateData.data }, () => this.colorizeNode(this.state.selected));
        // this.props.onAddNode(updateData.added, updateData.data)
    };

    insertNode = nodeData => {
        const { data, selected } = this.state;
        if (selected.length === 0) return alert('Выберите элемент');
        const updateData = insertNode(selected, data[0], nodeData);
        this.clear();

        this.setState({ selected: updateData.inserted, data: updateData.data }, () => this.colorizeNode(this.state.selected))
        // this.props.onInsertNode(updateData.inserted, updateData.data)
    };

    removeNode = () => {
        const { data, selected } = this.state;
        if (selected.length === 0) return alert('Выберите элемент');
        const updatedData = selected.map(item => remove(item.unique, data[0]));

        this.setState({ data: updatedData });
        // this.props.onRemoveNode(this.state.selected[0], data)
    };

    cutNode = () => {
        const { data, selected } = this.state;
        const updatedData = selected.map(item => cut(item, data[0]));

        this.setState({ data: [updatedData[0].data] })
        // this.props.onCutNode(this.state.selected[0], newData)
    };

    clear = () => {
        const { data } = this.state;
        const clearedData = clearGraph(data[0]);

        this.setState({ data: [clearedData] })
    };

    colorizeNode = (nodesSelected, fill="#ca2750", stroke="#f50057") => {
        const { data } = this.state;
        const searchIds = nodesSelected.map(node => node.unique);
        const coloredData =  searchIds.map(searchId => color(searchId, data[0], fill, stroke));

        this.setState({ data: coloredData });
    };

    click = (nodeKey, e) => {
        this.clear();

        if (e.altKey) {
            const { selected } = this.state;

            if (selected.find(item => item.unique === nodeKey.unique) !== undefined) {
                this.setState({ selected: [...selected.filter(item => item.unique !== nodeKey.unique)]
                            .sort((a, b) => a.depth - b.depth) },
                    () => {
                        if (this.state.selected.length === 0) {
                            this.colorizeNode([this.state.selected])
                        } else {
                            this.colorizeNode(this.state.selected)
                        }

                    }
                )
            } else {
                this.setState({ selected: [...selected, nodeKey].
                        sort((a, b) => a.depth - b.depth) },
                    () => this.colorizeNode(this.state.selected)
                );
            }

            return true;
        }

        this.setState({ selected: [nodeKey] }, () => {
            this.colorizeNode(this.state.selected);
            this.props.onNodeCLick(nodeKey);
        })
    };

    render() {
        const { wrapperClassName, styles, orientation, collapsible } = this.props;

        return (
            <div className={ cn('wrapper', wrapperClassName) }>
                <Tree
                    transitionDuration = { 0 }
                    collapsible        = { collapsible }
                    orientation        = { orientation }
                    styles             = { styles || svgStyle }
                    onClick            = { this.click }
                    textLayout         = {{ x: 28, y: 0, }}
                    data               = { this.state.data }
                    scaleExtent        = {{ min: 0.1, max: 8 }}
                />

                <button onClick={ this.addNode }>add</button>
                <button onClick={ this.insertNode }>insert</button>
                <button onClick={ this.removeNode }>remove</button>
                <button onClick={ this.cutNode }>cut</button>
                <button onClick={ this.copyBranch }>Copy branch</button>
                <button onClick={ this.pasteBranch }>Paste branch</button>
            </div>
    )
        ;
    }
}

export default GraphBuilder;
