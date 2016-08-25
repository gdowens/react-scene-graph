import React, { Component, PropTypes } from 'react';
import SVGComponent from './SVGComponent';
import Line from './Line';
import TextPath from './TextPath';

export default class Connection extends Component {

    static propTypes = {
        startingScene: PropTypes.object.isRequired,
        endingScene: PropTypes.object.isRequired,
    };

    render() {
        const { startingScene, endingScene } = this.props;

        const x1 = startingScene.x + startingScene.width / 2;
        const y1 = startingScene.y + startingScene.height / 2;
        const x2 = endingScene.x + endingScene.width / 2;
        const y2 = endingScene.y + endingScene.height / 2;

        const lineId = `${x1}${x2}`;

        return (
            <SVGComponent>
                <Line
                    id={lineId}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth="3"
                    stroke="blue"
                />
                <TextPath
                    href={lineId}
                    text={"Hehe"}
                />
            </SVGComponent>
        );
    }
}
