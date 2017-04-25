"use strict";

const Game = require("./game.js");
const Item = require("./item.js");

/**
 * Area class.
 * Draws game area with canvas
 */
class Area {

    constructor(options) {

        //default options
        this._options = Object.assign({}, {
            elementID: 'game',

            cellSize: 20,
            gridColor: "#ddd",
            cellColor: "#339900",

            speed: 100,
            autostart: true,

        }, options);


        if (!this._isCanvasSupported()) {

            throw new Error("Canvas is not supported");
        }

        this._element = document.getElementById(this._options.elementID);

        if (!this._element) {

            throw new ReferenceError("Area element is not existed.");
        }

        this.size = {
            width: 0,
            height: 0,
        }

        this._context = this._element.getContext("2d");

        this._gameHandler = new Game();

        this._init();

    }

    /**
     * Set cell size
     * @param  {Integer} cellSize
     */
    set cellSize(cellSize) {

        this._options.cellSize = parseInt(cellSize);
        this._setAreaSize();
    }

    /**
     * Get cell size
     * @return {Integer}
     */
    get cellSize() {

        return this._options.cellSize;
    }

    /**
     * Set speed of game
     * @param  {Integer} speed
     */
    set speed(speed) {

        this._options.speed = parseInt(speed);
    }

    /**
     * Get current speed of game
     * @return {Integer}
     */
    get speed() {

        return this._options.speed;
    }

    /**
     * Set game items
     * @param  {Array} cells
     */
    set items(cells) {

        for (let cell of cells) {

            const item = new Item(cell[0], cell[1]);

            this._gameHandler.addItem(item);

        }

        if (this._options.autostart) this.start();
    }

    /**
     * Get current game items
     * @return {Array}
     */
    get items() {

        return this._gameHandler.items;
    }

    /**
     * Start game
     */
    start() {

        if (!this.playing) {

            this.playing = true;
            this._performStep();
        }
    }

    /**
     * Stop game
     */
    stop() {

        if (this.timerID) clearTimeout(this.timerID);
        this.playing = false;
    }

    /**
     * Init game && set bounds
     */
    _init() {

        const parentElement = this._element.parentElement;

        if (!!parentElement) {

            const containerWidth = parentElement.getBoundingClientRect().width;
            const containerHeight = parentElement.getBoundingClientRect().height;

            this._element.width = containerWidth;
            this._element.height = containerHeight;
        }

        this._setAreaSize();
    }

    /**
     * Set area size
     */
    _setAreaSize() {

        let y = Math.floor(this._element.width / this._options.cellSize);
        let x = Math.floor(this._element.height / this._options.cellSize);

        this._gameHandler.setAreaSize(x, y);
    }

    /**
     * Perform next step
     */
    _performStep() {

        this.timerID = setTimeout(() => {

            if (this.playing) {
                requestAnimationFrame(() => this._performStep());

                this._drawFrame();
            }

        }, this._options.speed);
    }

    /**
     * Draw canvas frame
     */
    _drawFrame() {

        this._drawBackground();
        this._drawItems();

    }

    /**
     * Draw canvas background
     */
    _drawBackground() {


        this._clearArea();

        for (var x = 0.5; x < this._element.width; x += this._options.cellSize) {

            this._context.moveTo(x, 0);
            this._context.lineTo(x, this._element.height);
        }

        for (var y = 0.5; y < this._element.height; y += this._options.cellSize) {

            this._context.moveTo(0, y);
            this._context.lineTo(this._element.width, y);
        }

        this._context.strokeStyle = this._options.gridColor;
        this._context.stroke();


    }

    /**
     * clear canvas area
     */
    _clearArea() {

        //Rewriting width of canvas element
        this._element.width = this._element.width;
    }

    /**
     * Draw current items on canvas
     */
    _drawItems() {

        this._context.fillStyle = this._options.cellColor;

        let items = this._gameHandler.getNextItems();

        if (items.length == 0) {

            this.stop();

            return;
        }

        for (let item of items) {

            this._context.fillRect(item.y * this._options.cellSize, item.x * this._options.cellSize, this._options.cellSize, this._options.cellSize);

        }
    }

    /**
     * Check is canvas supported
     * @return {Boolean} True if canvas is supported
     */
    _isCanvasSupported() {

        return !!document.createElement('canvas').getContext;
    }
}

module.exports = Area;