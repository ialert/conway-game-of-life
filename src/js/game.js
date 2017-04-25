"use strict";

const Item = require("./item.js");

//Min count of neighbors when target cell remains alive
const MIN_ALIVE_ITEMS = 2;

//Max count of neighbors when target cell remains alive
const MAX_ALIVE_ITEMS = 3;

//Count of neighbors to create new point
const NEW_LIFE_ITEMS = 3;


/**
 * Game class.
 * Generates points on the game area
 */
class Game {

    constructor() {

        this._areaSize = {
            x: 0,
            y: 0,
        }

        this._items = [];
        this._previousItems = [];

    }

    /**
     * Set game items
     * @param  {Array} items
     */
    set items(items) {

        this._items = items;
    }

    /**
     * Get game items
     * @return {Array} items
     */
    get items() {

        return this._items;
    }

    /**
     * Set game area size
     * @param {Integer} x
     * @param {Integer} y
     */
    setAreaSize(x, y) {

        this._areaSize.x = x;
        this._areaSize.y = y;
    }

    /**
     * Get game area size
     * @return {Array} Area size
     */
    getAreaSize() {

        return this._areaSize;
    }

    /**
     * Add new item to game items
     * @param {Item} item
     */
    addItem(item) {

        return this._appendItem(this.items, item);

    }

    /**
     * Get items for next step
     * @return {Array} Next items
     */
    getNextItems() {

        let nextItems = [];

        for (let currentItem of this.items) {

            nextItems = this._getItems(nextItems, currentItem);

        }

        if (this._isNewState(nextItems)) {

            this._previousItems.push(JSON.stringify(nextItems));

            this.items = nextItems;

        } else {

            this.items = [];
        }

        return this.items;
    }


    /**
     * Assign new item to target array.Also check game area bounds
     * @param  {Array} items Target array
     * @param  {Item}  item Added item 
     * @return {Array} New target array
     */
    _appendItem(items, item) {


        if (this._isExistsItem(items, item)) return false;

        if (item.x > this._areaSize.x) item.x = 0;

        if (item.y > this._areaSize.y) item.y = 0;

        if (item.x < 0) item.x = this._areaSize.x;

        if (item.y < 0) item.y = this._areaSize.y;

        items.push(item);

        return items;
    }

    /**
     * Check if element exists in target array
     * @param  {Array} items Target array
     * @param  {Item} lookupItem Sought element
     * @return {Boolean} True if exists  
     */
    _isExistsItem(items, lookupItem) {

        return (items.findIndex(searchItem => searchItem.x == lookupItem.x && searchItem.y == lookupItem.y) > -1);
    }

    /**
     * Check new state of game
     * @param  {Array}  newItems New items
     * @return {Boolean} True if game state is new
     */
    _isNewState(newItems) {

        return !this._previousItems.includes(JSON.stringify(newItems));
    }

    /**
     * Check && get neighbors for current item
     * @param  {Array}  nextItems Items for next step
     * @param  {Item}  currentItem Current item
     * @param  {Boolean} isDeepSearch True if search is recursive
     * @return {Array}  New items for next step
     */
    _getItems(nextItems, currentItem, isDeepSearch) {

        let neighborsFound = 0;

        for (let i = currentItem.x - 1; i <= currentItem.x + 1; i++) {

            for (let j = currentItem.y - 1; j <= currentItem.y + 1; j++) {

                let temp_i = i;
                let temp_j = j;

                if (temp_i > this._areaSize.x) temp_i = 0;

                if (temp_j > this._areaSize.y) temp_j = 0;

                if (temp_i < 0) temp_i = this._areaSize.x;

                if (temp_j < 0) temp_j = this._areaSize.y;

                if (temp_i != currentItem.x || temp_j != currentItem.y) {

                    const tempItem = new Item(temp_i, temp_j);

                    if (this._isExistsItem(this.items, tempItem)) {

                        neighborsFound++;
                    }

                    if (!isDeepSearch) {

                        nextItems = this._getItems(nextItems, tempItem, true);
                    }
                }
            }
        }

        if ((!isDeepSearch && neighborsFound >= MIN_ALIVE_ITEMS && neighborsFound <= MAX_ALIVE_ITEMS) || (isDeepSearch && neighborsFound == NEW_LIFE_ITEMS)) {
            this._appendItem(nextItems, currentItem);
        }


        return nextItems;
    }

}


module.exports = Game;