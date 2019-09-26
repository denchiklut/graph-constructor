import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from 'react-d3-tree';
import cn from 'classnames';

import { color, clearGraph, remove, cut, copy, paste, addNode, insertNode } from "./utils";

import './index.css';

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

const circle = {
    shape: 'circle',
    shapeProps: {
        r: 20,
    }
};

class GraphConstructor extends Component {
    static propTypes = {
        onNodeCLick: PropTypes.func,
        onChange: PropTypes.func,
        onError: PropTypes.func,
        orientation: PropTypes.string,
        styles: PropTypes.object,
        nodeSvgShape: PropTypes.object,
        scale: PropTypes.object,
        textLayout: PropTypes.object,
        selectedColor: PropTypes.object,
        copiedColor: PropTypes.object,
        data: PropTypes.array.isRequired,
        pathFunc: PropTypes.string,
        wrapperClassName: PropTypes.string
    };

    static defaultProps = {
        onNodeCLick: Function.prototype,
        onChange: Function.prototype,
        onError: Function.prototype,
        styles: svgStyle,
        scale: { min: 0.1, max: 8 },
        textLayout: { x: 28, y: 0, },
        selectedColor: { fill: '#ca2750', stroke: '#f50057' },
        copiedColor: { fill: '#ff8e53', stroke: '#f57100' },
        nodeSvgShape: circle,
        orientation: 'vertical',
        pathFunc: 'diagonal',
        wrapperClassName: null
    };

    state = {
        data: this.props.data,
        selected: []
    };

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({ data: this.props.data })
        }
    }

    copyBranch = () => {
        const { selected } = this.state;
        const { copiedColor: { fill, stroke } } = this.props;
        const copied = copy(selected[0]);

        this.colorizeNode(copied.newSelected, fill, stroke);
        this.setState({ copied: copied.data });
    };

    pasteBranch = () => {
        const { data, selected, copied } = this.state;
        const pastedData = paste(data[0], selected, copied);

        this.setState({ selected: [], data: [pastedData] }, () =>  {
            this.props.onChange({ type: 'CLONE_TREE', temp: copied, data: [pastedData] });
            this.clear();
        });
    };

    addNode = nodeData => {
        const { data, selected } = this.state;
        const { nodeSvgShape, selectedColor: { fill, stroke } } = this.props;

        if (selected.length === 0) return this.props.onError({ type: 'Node does not selected' });
        const updateData = addNode(selected, data[0], nodeData, nodeSvgShape);
        this.clear();

        this.setState({ selected: updateData.added, data: updateData.data }, () => {
            this.props.onChange({ type: 'ADD_NODE', temp: updateData.added, data: updateData.data });
            this.colorizeNode(this.state.selected, fill, stroke)
        });
    };

    insertNode = nodeData => {
        const { data, selected } = this.state;
        const { nodeSvgShape, selectedColor: { fill, stroke } } = this.props;

        if (selected.length === 0) return this.props.onError({ type: 'Node does not selected' });
        const updateData = insertNode(selected, data[0], nodeData, nodeSvgShape);
        this.clear();

        this.setState({ selected: updateData.inserted, data: updateData.data }, () => {
            this.props.onChange({ type: 'INSERT_NODE', temp: updateData.inserted, data: updateData.data });
            this.colorizeNode(this.state.selected, fill, stroke);
        });
    };

    removeNode = () => {
        const { data, selected } = this.state;
        if (selected.length === 0) return alert('Выберите элемент');
        const updatedData = selected.map(item => remove(item.unique, data[0]));

        this.setState({ data: updatedData }, () => {
            this.props.onChange({ type: 'REMOVE_NODE', temp: this.state.selected[0], data: updatedData })
        });
    };

    cutNode = () => {
        const { data, selected } = this.state;
        const updatedData = selected.map(item => cut(item, data[0]));

        this.setState({ data: [updatedData[0].data], selected: [] }, () => {
            this.props.onChange({ type: 'CUT_NODE', temp: selected, data: [updatedData[0].data] });
        });
    };

    clear = () => {
        const { data } = this.state;
        const { nodeSvgShape, styles } = this.props;
        const { fill, stroke } = styles.nodes.node.circle;

        const clearedData = clearGraph(data[0], nodeSvgShape, fill, stroke);
        this.setState({ data: [clearedData] })
    };

    colorizeNode = (nodesSelected, fill, stroke) => {
        const { data } = this.state;
        const { nodeSvgShape } = this.props;
        const searchIds = nodesSelected.map(node => node.unique);
        const coloredData =  searchIds.map(searchId => color(searchId, data[0], nodeSvgShape, fill, stroke));

        this.setState({ data: coloredData });
    };

    click = (nodeKey, e) => {
        this.clear();
        const { selectedColor: { fill, stroke } } = this.props;

        if (e.altKey) {
            const { selected } = this.state;

            if (selected.find(item => item.unique === nodeKey.unique) !== undefined) {
                this.setState({ selected: [...selected.filter(item => item.unique !== nodeKey.unique)]
                            .sort((a, b) => a.depth - b.depth) },
                    () => {
                        if (this.state.selected.length === 0) {
                            this.colorizeNode([this.state.selected], fill, stroke)
                        } else {
                            this.colorizeNode(this.state.selected, fill, stroke)
                        }

                    }
                )
            } else {
                this.setState({ selected: [...selected, nodeKey].
                        sort((a, b) => a.depth - b.depth) },
                    () => this.colorizeNode(this.state.selected, fill, stroke)
                );
            }

            return true;
        }

        this.setState({ selected: [nodeKey] }, () => {
            this.colorizeNode(this.state.selected, fill, stroke);
            this.props.onChange({ type: 'NODE_CLICK', temp: nodeKey, data: this.state.data });
            this.props.onNodeCLick(nodeKey);
        })
    };

    render() {
        const { wrapperClassName, styles, orientation, pathFunc, textLayout, scale, nodeSvgShape } = this.props;

        return (
            <div className={ cn('wrapper', wrapperClassName) }>
                <Tree
                    transitionDuration = { 0 }
                    nodeSvgShape={ nodeSvgShape }
                    scaleExtent        = { scale }
                    collapsible        = { false }
                    styles             = { styles }
                    pathFunc           = { pathFunc }
                    onClick            = { this.click }
                    textLayout         = { textLayout }
                    orientation        = { orientation }
                    data               = { this.state.data }
                />
            </div>
    )
        ;
    }
}

export default GraphConstructor;
