import React from 'react';

function Rectangle({x, y, width, height, color, onClick, onTouchStart}) {
    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={color}
            onClick={onClick}
            onTouchStart={onTouchStart}
        />
    );
}

export default Rectangle;