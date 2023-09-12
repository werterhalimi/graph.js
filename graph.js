const points = [
    {
        x: 0,
        y: 500,
    },
    {
        x: 100,
        y: 60,
    },
    {
        x: 170,
        y: 700,
    },
    {
        x: 240,
        y: 460,
    },
    {
        x: 350,
        y: 500,
    },
    {
        x: 450,
        y: 25,
    },


    {
        x: 550,
        y: 850,
    },
    {
        x: 650,
        y: 420,
    },
    {
        x: 870,
        y: 200,
    },

    {
        x: 1000,
        y: 500,
    },
];


const svg = document.querySelector("body > svg.graph");
const parent = document.querySelector('body');

const redraw = () => {
    parent.innerHTML += ''
}
const drawPoints = (element, point, radius, color) => {
    const circle = document.createElement('circle');
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", color);
    element.appendChild(circle);
}

const traceLine = (element, points, color) => {
    let path = "M" + points[0].x + " " +points[0].y;
    for (const point of points)
        path += ' L' + point.x + ' ' + point.y;
    const pathEl = document.createElement('path');
    pathEl.setAttribute('d', path);
    pathEl.setAttribute('stroke', color);
    pathEl.setAttribute('fill', 'none');
    element.appendChild(pathEl);
}


for (const point of points) {
    drawPoints(svg, point, 3, 'blue')
}

traceLine(svg, points, 'black')

redraw();


const ratios = [];
for (const point of points) {
    ratios.push(point.x / 1000);
}

const findCursorPosition = (mousePos) => {
    let start = 0;
    const cursorRatio = mousePos.x / 1000;

    for (const ratio of ratios) {
        if (ratio > start && ratio < cursorRatio)
            start = ratio;
    }
    start = Math.min(points.length - 2, ratios.indexOf(start));
    const dir = {
        x: points[start + 1].x - points[start].x,
        y: points[start + 1].y - points[start].y
    }

    const angle = Math.atan2(dir.y, dir.x - 1);
    const tan = Math.tan(angle) * (mousePos.x - points[start].x);
    return {x: mousePos.x, y: points[start].y + tan}
}
const onMouseMove = (event) => {
    const pos = findCursorPosition({x:event.offsetX, y: event.offsetY});
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    document.querySelector("body > svg > circle.cursor").setAttribute('cx', pos.x);
    document.querySelector("body > svg > circle.cursor").setAttribute('cy', pos.y);
    document.querySelector("body > svg > text").setAttribute('x', pos.x);
    document.querySelector("body > svg > text").setAttribute('y', ''+ (pos.y - 15));
    document.querySelector("body > svg > text").innerHTML = 'x:' + pos.x + ' y:' + Math.floor(pos.y);
    redraw();
}

document.querySelector("svg.graph").addEventListener("mouseleave", function(event) {
    document.removeEventListener("mousemove", onMouseMove);
    document.querySelector("body > svg > circle.cursor").setAttribute('r', '0');
    document.querySelector("body > svg > circle.cursor").setAttribute('fill', 'none');

});

document.querySelector("svg.graph").addEventListener("mouseenter", function(event) {
    document.addEventListener("mousemove", onMouseMove);
    document.querySelector("body > svg > circle.cursor").setAttribute('r', '10');
    document.querySelector("body > svg > circle.cursor").setAttribute('fill', 'red');
});


