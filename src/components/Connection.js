import React, { Component, PropTypes } from 'react';
import SVGComponent from './SVGComponent';
import Line from './Line';
import TextPath from './TextPath';

export default class Connection extends Component {

    static propTypes = {
        startX: PropTypes.number.isRequired,
        startY: PropTypes.number.isRequired,
        endX: PropTypes.number,
        endY: PropTypes.number,
        endingScene: PropTypes.object,
    };

    render() {
        const { startX, startY, endX, endY, endingScene } = this.props;

        const x2 = endX ? endX : endingScene.x + endingScene.width / 2;
        const y2 = endY ? endY : endingScene.y + endingScene.height / 2;
        const lineId = `${startX}${x2}`;

        return (
            <SVGComponent>
                <Line
                    id={lineId}
                    x1={startX}
                    y1={startY}
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
