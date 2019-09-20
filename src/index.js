import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from 'react-d3-tree';
import uuid from 'uuid';
import cn from 'classnames';

import { color, clearGraph, remove, cut } from "./utils";

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
        wrapperClassName: PropTypes.string
    };

    static defaultProps = {
        onNodeCLick: Function.prototype,
        onAddNode: Function.prototype,
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

    addNode = nodeData => {
        const { data, selected } = this.state;
        let added = [];

        const add = (searched, graphData) => {
            let i, currentChild;

            if (searched.unique === graphData.unique) {
                graphData.children.push(
                    {
                        name: '5',
                        unique: uuid.v4(),
                        children: []
                    });

                added.push(graphData.children[0]);
            } else {
                for (i = 0; i < graphData.children.length; i++) {
                    currentChild = graphData.children[i];
                    add(searched, currentChild);
                }
            }

            return graphData ;
        };

        const updatedData = selected.map(item => add(item, data[0]));
        this.clear();

        this.setState({ selected: added, data: updatedData }, () => this.colorizeNode(this.state.selected));

        this.props.onAddNode(added, updatedData)
    }

    insertNode = nodeData => {
        const { data, selected } = this.state;
        let inserted = [];

        const insert = (searched, graphData) => {
            let i, currentChild;

            if (searched.unique === graphData.unique) {
                const oldChildren = graphData.children ? graphData.children.slice(): [];
                graphData.children = [];

                graphData.children.push(
                    {
                        name:     'insert',
                        unique:   uuid.v4(),
                        children: [...oldChildren]
                    })

                inserted.push(graphData.children[0])

            } else {
                for (i = 0; i < graphData.children.length; i++) {
                    currentChild = graphData.children[i];
                    insert(searched, currentChild);
                }

                return graphData;
            }
        };

        const updatedData = selected.map(item => insert(item, data[0]));
        this.clear();

        this.setState({ selected: inserted, data: updatedData }, () => this.colorizeNode(this.state.selected))

        // this.props.onAddNode(inserted, updatedData)
    }

    removeNode = () => {
        const { data, selected } = this.state;

        const updatedData = selected.map(item => remove(item.unique, data[0]));
        this.setState({ data: updatedData });

        // this.props.removeNode(this.state.selected[0], data)
    }

    cutNode = () => {
        const { data, selected } = this.state;

        const updatedData = selected.map(item => cut(item, data[0]));
        this.setState({ data: [updatedData[0].data] })

        // this.props.removeNode(this.state.selected[0], newData)
    }

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
                this.setState({ selected: [
                    ...selected.filter(item => item.unique !== nodeKey.unique)]
                            .sort((a, b) => a.depth - b.depth)},
                    () => this.colorizeNode(this.state.selected))
            } else {
                this.setState({ selected: [...selected, nodeKey]
                            .sort((a, b) => a.depth - b.depth)},
                    () => this.colorizeNode(this.state.selected))
            }

            return true;
        }

        this.setState({ selected: [nodeKey] }, () => {
            this.colorizeNode(this.state.selected);
            this.props.onNodeCLick(nodeKey);
        })
    };

    render() {
        const { wrapperClassName } = this.props;

        return (
            <div className={ cn('wrapper', wrapperClassName) }>
                <Tree
                    transitionDuration = { 0 }
                    collapsible        = { false }
                    orientation        = "vertical"
                    styles             = { svgStyle }
                    onClick            = { this.click }
                    textLayout         = {{ x: 28, y: 0, }}
                    data               = { this.state.data }
                    scaleExtent        = {{ min: 0.1, max: 8 }}
                />

                <button onClick={ this.addNode }>add</button>
                <button onClick={ this.insertNode }>insert</button>
                <button onClick={ this.removeNode }>remove</button>
                <button onClick={ this.cutNode }>cut</button>
            </div>
    )
        ;
    }
}

export default GraphBuilder;
