"use strict";

const Area = require("./area.js");

const defaultItems = [
    [0, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2]
];

const speedControlElement = document.getElementById('control-speed'),
    sizeControlElement = document.getElementById('control-size');


try {

    const game = new Area({
        autostart: false
    });

    game.items = defaultItems;

    if (!!speedControlElement) {

        game.speed = speedControlElement.value;

        speedControlElement.addEventListener("input", (event) => game.speed = speedControlElement.value);
    }

    if (!!sizeControlElement) {

        game.cellSize = sizeControlElement.value;

        sizeControlElement.addEventListener("input", (event) => game.cellSize = sizeControlElement.value);
    }

    game.start();


} catch (e) {

}