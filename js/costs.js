/**
 * Created by epwebworks on 19.02.2016.
 */
;
"use strict";

window.onload = function() {



    /*******************************************
     *                                         *
     *            Module Functions             *
     *                                         *
     *******************************************/

    /**
     * Returns a newly created object that inherits
     * properties from the prototype object p.
     *
     * @param p
     * @returns {*}
     */
    function inherit(p){
        if (p == null) throw TypeError();

        if (Object.create){
            return Object.create(p);
        }

        var t = typeof p;
        if (t !== 'object' && t !== 'function'){
            throw TypeError();
        }
        function f(){};
        f.prototype = p;
        return new f();
    }

    /**
     * Function copies properties of its second and subsequent
     * arguments on its first argument
     */
    var extend = (function (){
        for (var p in {toString:null}) {
            return function extend(o) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var prop in source) {
                        o[prop] = source[prop];
                    }
                }
                return o;
            };
        }

        var protoprops = ['toString', 'valueOf', 'constructor', 'hasOwnProperty',
            'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString'];
        return function patched_extend(o){
            for (var i = 1; i < arguments[i].length; i++){
                var source = arguments[i];
                for (var prop in source){
                    o[prop] = source[prop];
                }

                for (var j = 0; j < protoprops.length; j++){
                    prop = protoprops[j];
                    if (source.hasOwnProperty(prop)){
                        o[prop] = source[prop];
                    }
                }
                return o;
            };
        }
    }());

    function checkTypes(){
        // Make it generic instead of object.method
    }



    /*******************************************
     *                                         *
     *          Module SUPER CLASS             *
     *                                         *
     *******************************************/

    /**
     * Defines class constructor for SuperClass
     *
     * @param initValue
     * @constructor
     */
    function DesignCost(initValue){
        this._classID = DesignCost.SUPER_CLASS_ID;
        this._init(initValue);
    }

    DesignCost.prototype = {
        constructor: DesignCost,

        /**
         * Return part of error message with proper class name
         *
         * @returns {string}
         */
        get errMsgClassName(){
            return '(Class:' + this._classID + ')';
        },

        /**
         * Return part of error message with object id
         *
         * @returns {string}
         */
        get errMsgID(){
            return ' id="' + this.id + '"';
        },

        /**
         * Returns part of error message consisting of Class name and Object id
         *
         * @returns {string}
         */
        get errMsgClassAndId(){
            return this.errMsgClassName + this.errMsgID;
        },

        /**
         * Checks if value type is "Number"
         *
         * @param {Any value} val Value to check
         * @returns {boolean} Result of check
         * @private
         */
        _isNumber: function(val){
            return typeof val === 'number';
        },

        /**
         * Checks if value type is "String"
         *
         * @param {Any value} val Value to check
         * @returns {boolean} Result of check
         * @private
         */
        _isString: function(val){
            return typeof val === 'string';
        },

        /**
         * Checks if value type is "Boolean"
         *
         * @param {Any value} val Value to check
         * @returns {boolean} Result of check
         * @private
         */
        _isBoolean: function(val){
            return typeof val === 'boolean';
        },

        /**
         * Checks if value type is "Object"
         *
         * @param {Any value} val Value to check
         * @returns {boolean} Result of check
         * @private
         */
        _isObject: function(val){
            if (!Array.isArray(val)){
                return typeof val === 'object';
            }
        },

        /**
         * Checks if value type is "Array"
         *
         * @param {Any value} val Value to check
         * @returns {boolean} Result of check
         * @private
         */
        _isArray: function(val){
            return Array.isArray(val);
        },

        /**
         * Converts string to array
         *
         * @param {String} str String value to convert
         * @returns {Array} Array
         * @private
         */
        _str2arr: function(str){
            return [str];
        },

        /**
         * Converts string to number
         *
         * @param str
         * @returns {number}
         * @private
         */
        _str2num: function (str) {
            return +str;
        },

        /**
         * Checks type of value and returns it as a string if it`s amongst set variants
         *
         * @param {Any value} val Value to check
         * @param {String} valName Value name to display in error messages
         * @param {String|Array} type One or more type to check for accordance
         * @returns {String} Type
         * @private
         */
        _checkType: function(val, valName, type){
            var checkResult, errMsg, arrTypes;

            // check if no arguments are missed
            if (arguments.length < 3){
                throw new Error(this.errMsgClassAndId + ' _checkType: insufficient number of arguments, must be 3');
            }

            // check if valName is valid
            if (!this._isString(valName)){
                throw new TypeError(this.errMsgClassAndId + ' _checkType: "valType" is not "string"');
            }

            /**
             * for function _checkType invocation with 3 arguments:
             * 1. if type of arg "type" is string converts it to array
             * 2. throws an error if type of arg "type" is not "string" or "array"
             */
            if (arguments.length === 3){
                if (this._isString(type)){
                    arrTypes = this._str2arr(type);
                } else if (this._isArray(type)){
                    arrTypes = type;
                } else {
                    throw new TypeError(this.errMsgClassAndId + ' _checkType: "type" type must be "string" or "array"');
                }
            }

            // iterates array with types to check
            // return type or throws an error
            function checkTypes(arr){
                var i, len = arr.length, errMsg = ': type of "' + valName + '" is not';
                for (i = 0; i < len; i++){
                    switch (arr[i].toLowerCase()){
                        case 'string':
                            if (!this._isString(val)){
                                errMsg += ' "string",';
                            } else {
                                return 'string';
                            }
                            break;

                        case 'number':
                            if (!this._isNumber(val)){
                                errMsg += ' "number",';
                            } else {
                                return 'number';
                            }
                            break;

                        case 'boolean':
                            if (!this._isBoolean(val)){
                                errMsg += ' "boolean",';
                            } else {
                                return 'boolean';
                            }
                            break;

                        case 'object':
                            if (!this._isObject(val)){
                                errMsg += ' "object",';
                            } else {
                                return 'object';
                            }
                            break;

                        case 'array':
                            if (!this._isArray(val)){
                                errMsg += ' "array",';
                            } else {
                                return 'array';
                            }
                            break;

                        default :
                            break;
                    }
                }
                throw new TypeError(this.errMsgClassAndId + errMsg);
            }

            return checkTypes.call(this, arrTypes);
        },

        /**
         * Checks if type of value is String or Number
         *
         * @param {Any value} val Value to check
         * @param {String} valName Value name to display in error messages
         * @returns {String} Type
         * @private
         */
        _checkIfStrNum: function(val, valName){
            return this._checkType(val, valName, ['string', 'number']);
        },

        /**
         * Checks if type of value is String, Number or Object
         *
         * @param {Any value} val Value to check
         * @param {String} valName Value name to display in error messages
         * @returns {String} Type
         * @private
         */
        _checkIfStrNumObj: function(val, valName){
            return this._checkType(val, valName, ['string', 'number', 'object']);
        },

        /**
         * Sets instance ID
         *
         * @param {String|Number|Object} initValue
         * @private
         */
        _setID: function(initValue){
            switch (typeof initValue){
                case 'string':
                case 'number':
                    this._id = initValue;
                    break;

                case 'object':
                    if (!initValue.hasOwnProperty('id')){
                        throw new Error(this.errMsgClassName + this._errors.initValueObjectNoID);
                    }
                    this._checkType(initValue.id, 'initValue.id', ['string', 'number']);
                    this._id = initValue.id;
            }
        },

        /**
         * Returns instance ID
         *
         * @returns {String|Number|Object|*}
         */
        get id(){
            return this._id;
        },

        /**
         * Is executed on instance initialization
         *
         * @param (String|Number|Object) initValue
         * @private
         */
        _init: function(initValue){
            this._setID(initValue);
        },

        convertNum2Finance: function(val, currency){
            var text, i, len;

            this._checkType(val, 'val', ['number']);
            if (arguments[1]){
                this._checkType(currency, 'currency', ['string'])
            }

            text = val.toString();
            text = text.split('');
            len = text.length;
            for (i = 0; i < len; i++){
                if (i !== 0 && i % 3 === 0){
                    text[len - i] = ' ' + text[len - i];
                }
            }
            text = text.join('') + ' p.';

            return text;
        },

        convertNum2FinanceRU: function(val){
            return this.convertNum2Finance(val, ' p.')
        }

    };

    Object.defineProperties(DesignCost.prototype, {
        /**
         * Accessory property 'classID'
         */
        classID: {
            get: function () {
                return this._classID;
            },
            enumerable: true,
            configurable: true
        },

        controller: {
            set: function(val){
                this._controller = val;
            },
            get: function(){
                return this._controller;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessory property 'id'
         */
        id: {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        }
    });

    /*******************************************
     *                                         *
     *           Module CONSTANTS              *
     *                                         *
     *******************************************/

    DesignCost.PREFIX = 'ep-dc-';

    // Classes IDs
    DesignCost.SUPER_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'SUPER';
    DesignCost.CONTROLLER_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'CONTROLLER';
    DesignCost.MODEL_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'MODEL';
    DesignCost.MODEL_ITEM_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'MODEL-ITEM';
    DesignCost.ROUTER_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'ROUTER';
    DesignCost.SET_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'SET';
    DesignCost.SET_ITEM_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'SET-ITEM';
    DesignCost.VIEW_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'VIEW';
    DesignCost.VIEW_ITEM_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'VIEW-ITEM';
    DesignCost.VIEW_VALUE_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'VIEW-VALUE';
    DesignCost.VIEW_VALUE_AREA_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'VIEW-VALUE-AREA';
    DesignCost.VIEW_VALUE_COST_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'VIEW-VALUE-COST';
    DesignCost.VIEW_VALUE_FLOORS_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'VIEW-VALUE-FLOORS';
    DesignCost.VIEW_VALUE_INCLUDED_CLASS_ID = DesignCost.PREFIX.toUpperCase() + 'VIEW-VALUE-INCLUDED';

    // General IDs
    DesignCost.AREA_ID = DesignCost.PREFIX + 'area';
    DesignCost.CONTROLLER_ID = DesignCost.PREFIX + 'controller';
    DesignCost.COST_ID = DesignCost.PREFIX + 'cost';
    DesignCost.DESIGN_COST_ID = DesignCost.PREFIX + 'super';
    DesignCost.FLOORS_ID = DesignCost.PREFIX + 'floors';
    DesignCost.INCLUDED_ID = DesignCost.PREFIX + 'included';
    DesignCost.MODEL_ID = DesignCost.PREFIX + 'model';
    DesignCost.VIEW_ID = DesignCost.PREFIX + 'view';
    DesignCost.SUPER_ID = DesignCost.PREFIX + 'super';

    // Architect section IDs
    DesignCost.ARCHITECT_ID = DesignCost.PREFIX + 'architect';
    DesignCost.ARCHITECT_BASE_ID = DesignCost.PREFIX + 'architect-base';
    DesignCost.ARCHITECT_ELECTRIC_ID = DesignCost.PREFIX + 'architect-electric';
    DesignCost.ARCHITECT_FURNITURE_ID = DesignCost.PREFIX + 'architect-furniture';
    DesignCost.ARCHITECT_MARKERS_ID = DesignCost.PREFIX + 'architect-markers';
    DesignCost.ARCHITECT_MEASUREMENTS_ID = DesignCost.PREFIX + 'architect-measurements';
    DesignCost.ARCHITECT_OPENINGS_ID = DesignCost.PREFIX + 'architect-openings';
    DesignCost.ARCHITECT_ROOF_ID = DesignCost.PREFIX + 'architect-roof';
    DesignCost.ARCHITECT_TERRITORY_ID = DesignCost.PREFIX + 'architect-territory';

    // Construct section IDs
    DesignCost.CONSTRUCT_ID = DesignCost.PREFIX + 'construct';
    DesignCost.CONSTRUCT_BASE_ID = DesignCost.PREFIX + 'construct-base';
    DesignCost.CONSTRUCT_BEAMS_ID = DesignCost.PREFIX + 'construct-beams';
    DesignCost.CONSTRUCT_CHANNELS_ID = DesignCost.PREFIX + 'construct-channels';
    DesignCost.CONSTRUCT_FOUNDATION_ID = DesignCost.PREFIX + 'construct-foundation';
    DesignCost.CONSTRUCT_FRAMING_ID = DesignCost.PREFIX + 'construct-framing';
    DesignCost.CONSTRUCT_RAFTERS_ID = DesignCost.PREFIX + 'construct-rafters';



    /*******************************************
     *                                         *
     *     Classes:  SET and SET ITEM          *
     *                                         *
     *******************************************/

    /**
     * DesignCostSet class constructor
     *
     * @class DesignCostSet
     * @param {String|Number|Object} initValue
     * @constructor
     */
    function DesignCostSet(initValue){
        this._classID = DesignCost.SET_CLASS_ID;
        this._initSet(initValue);
    }

    DesignCostSet.prototype = inherit(DesignCost.prototype);

    /**
     * DesignCostSet class and instance methods and properties
     */
    extend(DesignCostSet.prototype, {
        constructor: DesignCostSet,

        /**
         * Sets up Set object on instantiation
         *
         * @param {String|Number|Object} initValue
         * @private
         */
        _initSet: function(initValue){
            this._length = 0;
            this._items = {};
            switch (this._checkIfStrNumObj(initValue, 'initValue')) {
                case 'number':
                case 'string':
                    this._id = initValue;
                    break;

                case 'object':
                    this._checkIfStrNum(initValue.id, 'initValue.id');
                    this._id = initValue.id;

                default :
                    break;
            }
        },

        /**
         * Adds item to set
         *
         * @param {Object} item Set item
         */
        add: function(item){
            this._checkType(item, 'item', 'object');
            if (this._items.hasOwnProperty(item.id)) {
                throw new Error(this.errMsgClassAndId + ' Cannot add new item to set: item with id="' + item.id +  '" is already in set');
            }
            this._items[item.id] = item;
            this._length ++;
        },

        /**
         * Checks if item is already in set
         *
         * @param {String|Number} itemId
         * @returns {boolean}
         */
        isInSet: function(itemId){
            this._checkIfStrNum(itemId, 'itemId');
            return this._items.hasOwnProperty(itemId);
        },

        /**
         * Iterates Set and invokes Callback function for every iteration
         *
         * @param fn
         */
        forEach: function(fn){
            var i = 0, item,
                items = this.items;

            for (item in items){
                fn(items[item], i);
                i++;
            }
        },

        /**
         * Gets item from set
         *
         * @param {String|Number} itemId
         * @returns {Object} Item
         */
        get: function(itemId){
            this._checkIfStrNum(itemId, 'itemId');
            if (!this._items.hasOwnProperty(itemId)){
                throw new Error(this.errMsgClassAndId + ' Cannot get item from set: item with id="' + itemId + '" is not in set');
            }
            return this._items[itemId];
        },

        /**
         * Removes item from set
         *
         * @param {String|Number} itemId
         */
        remove: function(itemId){
            this._checkIfStrNum(itemId, 'itemId');
            if (!this._items.hasOwnProperty(itemId)){
                throw new Error(this.errMsgClassAndId + ' Cannot remove item from set: item with id="' + itemId + '" is not in the set');
            }
            delete this._items[itemId];
            this._length --;

        },

        parseSet: function(string){
            var self = this,
                pos = string.indexOf('=');
            var setID = string.substr(0, pos),
                items = string.substr(pos + 2);

            this._setID(setID);

            items = items.substr(0, items.length - 2);
            items = items.split(';');

            items.forEach(function(item){
                var newItem = new DesignCostSetItem('id');
                newItem.parseItem(item);
                self.add(newItem);
            });
        },

        stringifySetItemValues: function(){
            var result = this.id + '={';
            this.forEach(function(setItem){
                result += (setItem.stringifyItem() + ';');
            });
            result += '}';
            return result;
        },

        /**
         * Overrides default Object method toString()
         *
         * @returns {string}
         */
        toString: function(){
            var msg = '', item;

            msg += 'Set:' +  this.errMsgID;
            msg += ' length=' + this.length + ' (Items: ';

            for (item in this._items){
                msg += this._items[item].id + '; ';
            }

            msg += ')';

            return msg;
        }
    });

    /**
     * DesignCostSet accessory properties
     */
    Object.defineProperties(DesignCostSet.prototype, {
        /**
         * Accessory property 'id'
         */
        id: {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessory property 'length'
         */
        length: {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessory property 'items'
         */
        items: {
            get: function () {
                return this._items;
            },
            enumerable: true,
            configurable: true
        }

    });

    /**
     * DesignCostSetItem class constructor
     *
     * @class DesignCostSetItem
     * @param initValue
     * @constructor
     */
    function DesignCostSetItem(initValue){
        this._classID = DesignCost.SET_ITEM_CLASS_ID;
        this._defaultValuesNames = ['area', 'floors', 'cost', 'included'];
        this._initSetItem(initValue);
    }

    DesignCostSetItem.prototype = inherit(DesignCostSet.prototype);

    /**
     * DesignCostSet/item class and instance methods and properties
     */
    extend(DesignCostSetItem.prototype, {
        constructor: DesignCostSetItem,

        /**
         * Sets up Set Item object on instantiation
         *
         * @param {String|Number|Object} initValue
         * @private
         */
        _initSetItem: function(initValue){
            var self = this;
            this._length = 0;
            this._values = {};

            switch (this._checkIfStrNumObj(initValue, 'initValue')) {
                case 'number':
                case 'string':
                    this._id = initValue;
                    break;

                case 'object':
                    this._checkIfStrNum(initValue.id, 'initValue.id');
                    this._id = initValue.id;

                    this._defaultValuesNames.forEach(function(valueName){
                        if (initValue.hasOwnProperty(valueName)){
                            self[valueName] = initValue[valueName];
                            self._length ++;
                        }
                    });
                    break;

                default :
                    break;
            }
        },

        stringifyItem: function(){
            return this.id + '=' + this._stringifyValues();
        },

        _stringifyValues: function(){
            return JSON.stringify(this.values);
        },

        parseItem: function(itemJSONString){
            var pos = itemJSONString.indexOf('=');
            var itemID = itemJSONString.substr(0, pos),
                values = decodeURIComponent(itemJSONString.substr(pos + 1));

            this._setID(itemID);
            this._parseValues(values);
        },

        _parseValues: function(valuesJSONString){
            this._values = JSON.parse(valuesJSONString);
        },

        /**
         * Overrides default Object method toString()
         *
         * @returns {string}
         */
        toString: function(){
            var msg = '', value;

            msg += 'Item:' +  this.errMsgID;
            msg += ' length=' + this.length + ' (Values: ';

            for (value in this._values){
                msg += value + '=' + this._values[value] + '; ';
            }

            msg += ')';

            return msg;
        }
    });

    /**
     * DesignCostSetItem accessory properties
     */
    Object.defineProperties(DesignCostSetItem.prototype, {
        /**
         * Accessory property 'items'
         */
        values: {
            get: function () {
                return this._values;
            },
            enumerable: true,
            configurable: true
        },

        area: {
            set: function (val) {
                if (!this._isNumber(val)){
                    val = this._str2num(val);
                }
                this._checkType(val, '_values.area', 'number');
                this._values.area = val;
            },
            get: function () {
                return this._values.area;
            },
            enumerable: true,
            configurable: true
        },

        cost: {
            set: function (val) {
                if (!this._isNumber(val)){
                    val = +val;
                }
                this._checkType(val, '_values.cost', 'number');
                this._values.cost = val;
            },
            get: function () {
                return this._values.cost;
            },
            enumerable: true,
            configurable: true
        },

        floors: {
            set: function (val) {
                if (!this._isNumber(val)){
                    val = this._str2num(val);
                }
                this._checkType(val, '_values.floors', 'number');
                this._values.floors = val;
            },
            get: function () {
                return this._values.floors;
            },
            enumerable: true,
            configurable: true
        },

        included: {
            set: function (val) {
                if (!this._isBoolean(val)){
                    if (this._isString(val)){
                        switch (val){
                            case 'true':
                                val = true;
                                break;

                            case 'false':
                                val = false;
                                break;

                            default :
                                break;
                        }
                    }
                }
                this._checkType(val, '_values.included', 'boolean');
                this._values.included = val;
            },
            get: function () {
                return this._values.included;
            },
            enumerable: true,
            configurable: true
        }

    });



    /*******************************************
     *                                         *
     *          Classes:  CONTROLLER           *
     *                                         *
     *******************************************/

    function DesignCostController(initValue){
        this._classID = DesignCost.CONTROLLER_CLASS_ID;
        this._initController(initValue);
    }

    DesignCostController.prototype = inherit(DesignCost.prototype);

    extend(DesignCostController.prototype, {
        constructor: DesignCostController,

        _initController: function(initValue){
            switch (this._checkIfStrNumObj(initValue, 'initValue (method: _initController)')){
                case 'object':
                    if (initValue.hasOwnProperty('controller')){
                        this._createControllerFromJSON(initValue);
                    } else {
                        this._createControllerFromObject(initValue);
                    }
                    break;

                case 'string':
                case 'number':
                    this._setID(initValue);
                    break;

                default :
                    break;
            }
        },

        _createControllerFromJSON: function(moduleData){
            var controllerData = moduleData.controller;

            this._setID(controllerData);
            this._initModel(moduleData);
            this._initView(moduleData);
            this._initRouter('ep-dc-router');

            if (this.router.urlHasInitValues === true){
                this.event = 'routerHasInitValues';
            } else {
                this.event = 'viewChanged';
            }
        },

        _initModel: function(moduleData){
            this.model = moduleData;
        },

        _initView: function(moduleData){
            this.view = moduleData;
            this.view.controller = this;
        },

        _initRouter: function(routerData){
            this.router = routerData;
            this.router.controller = this;
        },

        getModelValues: function(){
            return this.model.values;
        }
    });

    Object.defineProperties(DesignCostController.prototype, {
        model: {
            set: function(moduleData){
                this._model = new DesignCostModel(moduleData);
            },
            get: function(){
                return this._model;
            },
            enumerable: true,
            configurable: true
        },
        router: {
            set: function(routerData){
                this._router = new DesignCostRouter(routerData);
            },
            get: function(){
                return this._router;
            },
            enumerable: true,
            configurable: true
        },
        view: {
            set: function(moduleData){
                this._view = new DesignCostView(moduleData);
            },
            get: function(){
                return this._view;
            },
            enumerable: true,
            configurable: true
        },
        event: {
            set: function(ev){
                switch (ev){
                    case 'viewChanged':
                        this.model.updateModel(this.view.values);
                        this.view.updateValuesWithSet(this.model.values);
                        break;

                    case 'routerHasInitValues':
                        var newSet = new DesignCostSet('id');
                        newSet.parseSet(this.router.values);

                        this.model.updateModel(newSet);
                        this.view.updateValuesWithSet(this.model.values);

                        break;

                    case 'storingRequested':
                        var apiUrl = 'http://qps.ru/api?url=',
                            longUrl = '';

                        longUrl += this.router.url;

                        longUrl += '?';
                        longUrl += this.model.values.stringifySetItemValues();

                        apiUrl += longUrl;

                        var request = new XMLHttpRequest(),
                            result;
                        request.open('GET', apiUrl);
                        request.onreadystatechange = function(){
                            if (request.readyState === 4 && request.status === 200){
                                showModalCentered('Ссылка на расчет:' + '<br><b>' + request.responseText + '</b>');
                                result = 'success';
                            }
                        };

                        request.send(null);

                        showModalCentered('Загрузка...');

                        setTimeout(function(){
                            if (result !== 'success'){
                                showModalCentered('Ссылка на расчет недоступна.' + '<br>' + 'Попробуйте позже...');
                            }
                        }, 10000);
                        break;

                    default :
                        break
                }
            },
            get: function(){

            },
            enumerable: true,
            configurable: true
        }
    });

    function showModalCentered(modalTextContent){
        var modal = document.getElementById('ep-dc-modal'),
            modalClose = document.getElementById('ep-dc-modal-close'),
            windowCenterX = window.innerWidth / 2 + window.pageXOffset,
            windowCenterY = window.innerHeight / 2 + window.pageYOffset;

        modal.className ='';

        if (modalTextContent !== 'undefined'){
            var modalInner = document.getElementById('ep-dc-modal-inner');
            modalInner.innerHTML = modalTextContent;
        }

        if (modal.style.visibility == 'hidden'){
            modal.style.position = 'absolute';
            modal.style.visibility = 'visible';
            modal.style.left = '-9999px';
        }

        var modalGeometry = modal.getBoundingClientRect(),
            modalLeft = windowCenterX - modalGeometry.width / 2,
            modalTop = windowCenterY - modalGeometry.height / 2;

        modal.style.left = modalLeft + 'px';
        modal.style.top = modalTop + 'px';

        modalClose.addEventListener('click', function(){
            modal.style.visibility = 'hidden';
        }, false);

        window.addEventListener('scroll', function(){
            windowCenterX = window.innerWidth / 2 + window.pageXOffset;
            windowCenterY = window.innerHeight / 2 + window.pageYOffset;
            modalLeft = windowCenterX - modalGeometry.width / 2;
            modalTop = windowCenterY - modalGeometry.height / 2;
            modal.style.left = modalLeft + 'px';
            modal.style.top = modalTop + 'px';
        }, false);

        window.addEventListener('resize', function(){
            modal.style.visibility = 'hidden';
        }, false);

        document.addEventListener('change', function(){
            modal.style.visibility = 'hidden';
        }, false);
    }

    /*******************************************
     *                                         *
     *     Classes:  MODEL and MODEL ITEM      *
     *                                         *
     *******************************************/

    /**
     * Defines class constructor for design cost model
     *
     * @param initValue
     * @constructor
     */
    function DesignCostModel(initValue){
        this._classID = DesignCost.MODEL_CLASS_ID;
        this._defaultValuesNames = ['area', 'floors', 'categories', 'cost', 'included'];
        this._initModel(initValue);
    }

    /**
     * Subclass DesignCostModel prototype inherits from its superclass DesignCosts
     * @type {*}
     */
    DesignCostModel.prototype = inherit(DesignCost.prototype);

    /**
     * Adds properties and methods to class DesignCostModel
     */
    extend(DesignCostModel.prototype, {
        constructor: DesignCostModel,

        _initModel: function(initValue){
            switch (this._checkIfStrNumObj(initValue, 'initValue')){
                case 'object':
                    if (initValue.hasOwnProperty('model')){
                        this._createModelFromJSON(initValue);
                    } else {
                        this._createModelFromObject(initValue);
                    }
                    break;

                case 'string':
                case 'number':
                    this._setID(initValue);
                    break;

                default :
                    break;
            }
        },

        _createModelFromObject: function(initObj){
            this._setID(initObj);
            this.values = initObj;
        },

        /**
         * Instantiates new model from JSON object
         *
         * @param {Object} modelJSON Model as JSON object
         * @private
         */
        _createModelFromJSON: function(modelData){
            var model = modelData.model;

            this._setID(model);
            this.values = model;

            if (model.subs){
                if (this._isArray(model.subs)){
                    console.warn(this.errMsgClassAndId + ' Initialization warning: "Subs" type is array, no proper method to process');
                }

                if (this._isObject(model.subs)){
                    this._createAllModelSubsFromJSON(model.subs);
                }
            }
        },

        /**
         * Instantiates all new Model Items from JSON object
         *
         * @param subsJSON
         * @private
         */
        _createAllModelSubsFromJSON: function(subsJSON){
            var subName;

            for (subName in subsJSON){
                var newSub = this._createModelSubFromJSON(subsJSON[subName]);
                this.addSub(newSub);
                newSub.superior = this;
            }
        },

        /**
         * Instantiates a Model Item from JSON object
         * @param subJSON
         * @private
         */
        _createModelSubFromJSON: function(subJSON){
            return new DesignCostModelItem(subJSON);
        },

        /**
         * Adds reference to sub items
         * @param {Object} sub Reference to sub item object
         */
        addSub: function(sub){
            this._checkType(sub, 'sub', ['object']);

            if (!this._subs) {
                this._subs = [];
            }

            sub.superior = this;
            this._subs.push(sub);
        },

        updateSubs: function(set){
            this._subs.forEach(function(sub){
                sub.update(set);
            });
        },

        /**
         * Updates model state with set of values
         *
         * @param {Object} params Instance of DesignCostSet Class
         * @returns {DesignCostSet} Instance of DesignCostParameters Class
         */
        updateModel: function(set){
            if (set.isInSet(DesignCost.DESIGN_COST_ID)){
                this.values = set.get(DesignCost.DESIGN_COST_ID);
            }

            if (this._subs){
                this.updateSubs(set);
            }

            return this.values;
        }

    });

    /**
     * Adds accessor properties to class DesignCostModel
     */
    Object.defineProperties(DesignCostModel.prototype, {
        /**
         * Accessor property 'area
         */
        area: {
            set: function(val){
                this._area = val;
            },
            get: function(){
                return this._area;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'category'
         */
        category: {
            get: function () {
                if (this.categories){
                    var i = 0,
                        category;
                    while (this.area > this.categories[i]){
                        i++;
                    }
                    return i;
                }
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'categories'
         */
        categories: {
            set: function(categories){
                if (!Array.isArray(categories)){
                    throw new TypeError(this.errMsgClassAndId + ' Initialization error: Area categories type must be "Array" or "ArrayLike"');
                }
                if (categories.length == 0){
                    console.warn(this.errMsgClassAndId + ' Initialization warning: No area categories values');
                }
                this._categories = categories;
            },
            get: function(){
                return this._categories;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'cost'
         */
        cost: {
            get: function () {
                var result = 0;

                this._subs.forEach(function(sub){
                    if (sub.included){
                        result += sub.cost;
                    }
                });
                return result;
            },
            enumerable: true,
            configurable: true
        },

        included: {
            set: function(bool){
                this._checkType(bool, 'bool', ['boolean']);
                this._included = bool;
            },
            get: function(){
                return this._included;
            },
            enumerable: true,
            configurable: true
        },

        values: {
            set: function(modelValuesData){
                var self = this;

                this._checkType(modelValuesData, 'modelValuesData', ['object']);
                this._defaultValuesNames.forEach(function(valueName) {
                    if (valueName in modelValuesData && !(modelValuesData[valueName] === null || modelValuesData[valueName] === undefined)) {
                        self[valueName] = modelValuesData[valueName];
                    }
                });
            },
            get: function(){
                var self = this,
                    allValues = new DesignCostSet(this.id),
                    values = new DesignCostSetItem(DesignCost.DESIGN_COST_ID);

                this._defaultValuesNames.forEach(function(valueName) {
                    if (valueName in values && !(self[valueName] === null || self[valueName] === undefined)) {
                        values[valueName] = self[valueName];
                    }
                });

                allValues.add(values);

                function addSubsValues(subs){
                    subs.forEach(function(sub){
                        var newSubValues = sub.values;
                        allValues.add(newSubValues);
                        if (sub._subs){
                            addSubsValues(sub._subs);
                        }
                    });

                }

                addSubsValues(this._subs);

                return allValues;
            },
            enumerable: true,
            configurable: true
        }
    });

    /**
     * Defines class constructor for Design Cost Model Item
     *
     * @param initValue
     * @constructor
     */
    function DesignCostModelItem(initValue){
        this._classID = DesignCost.MODEL_ITEM_CLASS_ID;
        this._defaultValuesNames = ['categories', 'cost', 'included'];
        this._initModelItem(initValue);
    }

    /**
     * Subclass DesignCostModelItem prototype inherits from its superclass DesignCostsModel
     *
     * @type {*}
     */
    DesignCostModelItem.prototype = inherit(DesignCostModel.prototype);

    /**
     * Adds class properties to class DesignCostModelItem
     */
    extend(DesignCostModelItem.prototype, {
        constructor: DesignCostModelItem,

        _paramsNames: ['id', 'categories', 'cost', 'included'],

        /**
         * Runs on object instantiation
         * @param initValue
         * @private
         */
        _initModelItem: function(initValue){
            switch (this._checkIfStrNumObj(initValue, 'initValue')){
                case 'object':
                    this._createModelItemFromJSON(initValue);
                    break;

                case 'string':
                case 'number':
                    this._setID(initValue);
                    break;

                default :
                    break;
            }

        },

        _createModelItemFromJSON: function(modelItemJSON){
            var modelItem = modelItemJSON;

            this._setID(modelItem);
            this.values = modelItem;

            if (modelItem.subs){
                if (Array.isArray(modelItem.subs)){
                    console.warn(this.errMsgClassAndId + ' Initialization warning: "Subs" type is array, no proper method to process');
                }

                if (typeof modelItem.subs === 'object'){
                    this._createAllModelSubsFromJSON(modelItem.subs);
                }
            }
        },

        update: function(set){
            if (set.isInSet(this.id)){
                this.values = set.get(this.id);
            }

            if (this._subs){
                this._subs.forEach(function (sub) {
                    sub.update(set);
                });
            }
        }
    });

    /**
     * Adds accessor properties to class DesignModelItem
     */
    Object.defineProperties(DesignCostModelItem.prototype, {
        /**
         * Accessory property 'area'
         */
        area: {
            get: function(){
                return this.superior.area;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'category'
         */
        category: {
            get: function () {
                if (!this.categories){
                    return this.superior.category;
                }

                var i = 0,
                    category;
                while (this.area > this.categories[i]){
                    i++;
                }
                return i;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'cost'
         */
        cost: {
            set: function(cost){
                switch(typeof cost){
                    case 'number':
                        if (this._isArray(this._cost)){
                        }
                        this._cost = cost;
                        break;

                    case 'object':
                        if (Array.isArray(cost)){
                            this._cost = cost;
                        }
                        break;

                    default :
                        console.warn(this.errMsgClassAndId + ' Cost values were not set');
                        break;
                }
            },
            get: function(){
                if (typeof this._cost === 'number'){
                    return this._cost;
                }

                if (Array.isArray(this._cost)){
                    return this._cost[this.category];
                }

                if (this._subs){
                    var result = 0;
                    this._subs.forEach(function(sub){
                        if (sub.included){
                            result += sub.cost;
                        }
                    });
                    return result;
                }
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'included'
         */
        included: {
            set: function(val){
                if(typeof val === 'boolean'){
                    this._included = val;
                }
            },
            get: function(){
                return this._included;
            },
            enumerable: true,
            configurable: true

        },

        /**
         * Accessor property 'values'
         */
        values: {
            set: function(modelItemData){
                var self = this;

                this._checkType(modelItemData, 'modelItemData', ['object']);
                this._defaultValuesNames.forEach(function(valueName) {
                    if (valueName in modelItemData && !(modelItemData[valueName] === null || modelItemData[valueName] === undefined)) {
                        /**
                         * Check if updated from Set
                         * if true, prevent Cost from rewriting
                         */
                        if (!(modelItemData._classID === DesignCost.SET_ITEM_CLASS_ID && (valueName === 'cost' || valueName === DesignCost.COST_ID))){
                            self[valueName] = modelItemData[valueName];
                        }
                    }
                });
            },
            get: function(){
                var parameters = new DesignCostSetItem(this.id);

                parameters.id = this.id;
                parameters.cost = this.cost;
                parameters.included = this.included;

                return parameters;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'superior'
         * Sets reference to this parent object
         */
        superior: {
            set: function(superior){
                this._superior = superior;
            },
            get: function(){
                return this._superior;
            },
            enumerable: true,
            configurable: true
        }
    });



    /*******************************************
     *                                         *
     *      Classes:  VIEW and VIEW ITEM       *
     *                                         *
     *******************************************/

    /**
     * Class: DESIGN_COST_VIEW
     *
     * @param initValue
     * @constructor
     */
    function DesignCostView(initValue){
        this._classID = DesignCost.VIEW_CLASS_ID;
        this._values = {};
        this._context = document;
        this._defaultValuesNames = ['area', 'floors', 'cost', 'included'];
        this._initView(initValue);
    }

    DesignCostView.prototype = inherit(DesignCost.prototype);

    extend(DesignCostView.prototype, {
        constructor: DesignCostView,

        _initView: function(initValue){
            switch (this._checkIfStrNumObj(initValue, 'initValue')){
                case 'object':
                    if (initValue.hasOwnProperty('view')){
                        this._createViewFromJSON(initValue);
                    } else {
                        this._createViewFromObject(initValue);
                    }
                    break;

                case 'string':
                case 'number':
                    this._setID(initValue);
                    break;

                default :
                    break;
            }

            this._setupEvents();
        },

        _createViewFromJSON: function(initValue){
            var initValue = initValue.view;

            this._setID(initValue);
            this.setElBySelector(initValue.selector);
            
            if (initValue.hasOwnProperty('values')){
                this._createValuesFromJSON(initValue.values);
            }

            if (initValue.subs){
                if (this._isArray(initValue.subs)){
                    console.warn(this.errMsgClassAndId + ' Initialization warning: "Subs" type is array, no proper method to process');
                }

                if (this._isObject(initValue.subs)){
                    this._createAllViewSubsFromJSON(initValue.subs);
                }
            }
        },

        _createAllViewSubsFromJSON: function(subs){
            var sub, newSubObj;
            for (sub in subs){
                newSubObj = new DesignCostViewItem(subs[sub]);
                newSubObj.superior = this;
                this.addSub(newSubObj);
            }
        },

        /**
         * Creates All Value Objects of This Object from its JSON on initialization
         *
         * @param valuesJSON
         * @private
         */
        _createValuesFromJSON: function(valuesJSON){
            var value;
            for (value in valuesJSON){
                this._createValueFromJSON(valuesJSON[value]);
            }
        },

        /**
         * Creates Single Value Object of This Object from its JSON on initialization
         *
         * @param valueJSON
         * @private
         */
        _createValueFromJSON: function(valueJSON){
            var newValueObj;

            switch (valueJSON.type){
                case DesignCost.AREA_ID:
                    newValueObj = new DesignCostViewValueArea(valueJSON);
                    break;

                case DesignCost.COST_ID:
                    newValueObj = new DesignCostViewValueCost(valueJSON);
                    break;

                case  DesignCost.FLOORS_ID:
                    newValueObj = new DesignCostViewValueFloors(valueJSON);
                    break;

                case DesignCost.INCLUDED_ID:
                    newValueObj = new DesignCostViewValueIncluded(valueJSON);
                    break;

                default :
                    console.warn(this.errMsgClassAndId + ' new DesignCostViewValue object was not instantiated');
                    break;
            }

            this._values[valueJSON.id] = newValueObj;
        },

        _setupEvents: function(){
            var self = this;
            this.el[0].addEventListener('change', function(){
                self.controller.event = 'viewChanged';
             }, false);

            this.context.getElementById('ep-design-cost-store').addEventListener('click', function(){
                self.controller.event = 'storingRequested';
            }, false);
        },

        /**
         * Selects Main Node for a View or View Item
         *
         * @param selector
         */
        setElBySelector: function(selector){
        this._checkType(selector, 'initValue.selector', ['string']);
        this.el = this.context.querySelectorAll(selector);
        },

        /**
         * Registers Item Object as a Sub View Item
         *
         * @param sub
         */
        addSub: function(sub){
            this._checkType(sub, 'sub', ['object']);

            if (!this._subs) {
                this._subs = [];
            }

            sub.superior = this;
            this._subs.push(sub);
        },

        /**
         * Updates Values of This Object and all its Subs with data from Set Object
         *
         * @param set
         */
        updateValuesWithSet: function(set){
            if (set.classID !== DesignCost.SET_CLASS_ID){
                throw new Error(this.errMsgClassAndId + ' Provide Set Object')
            }

            this._updateValuesWithSet(set);

            if (this.subs !== undefined && this.subs.length > 0){
                this._updateSubsValuesWithSet(set);
            }
        },

        /**
         * Updates Values of This Object only
         *
         * @param set
         * @private
         */
        _updateValuesWithSet: function (set) {
            this.values = set.get(DesignCost.SUPER_ID);
        },

        /**
         * Updates Values of Sub Items Objects Only
         *
         * @param set
         * @private
         */
        _updateSubsValuesWithSet: function(set){
            this.subs.forEach(function(sub){
                sub.updateValuesWithSet(set);
            });
        }
    });

    Object.defineProperties(DesignCostView.prototype, {
        /**
         * Accessory property 'context'
         */
        context: {
            set: function(val){
                if (!(val === document || this._checkType(val, 'val', ['object']))){
                    throw new Error(this.errMsgClassAndId + ' Value of "context" must be "document" or "documentFragment"');
                }
                this._context = val;
            },
            get: function(){
                if (this._context !== undefined){
                    return this._context;
                } else if (this.superior !== undefined) {
                    return this.superior.context;
                } else {
                    return document;
                }
            },
            enumerable: true,
            configurable: true
        },

        el: {
            set: function(el){
                this._el = el;
            },
            get: function(){
                return this._el;
            },
            enumerable: true,
            configurable: true
        },

        subs: {
            get: function(){
                return this._subs;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessory property 'values'
         * provide SetItem Object with values for viewItemData
         */
        values: {
            set: function(newValues){
                var value, values = this._values;
                this._checkType(newValues, 'newValues', ['object']);
                for (value in values){
                    values[value]._defaultValuesNames.forEach(function(name){
                        if ((name in newValues) && !(newValues[name] === null || newValues[name] === undefined)){
                            values[value].value = newValues[name];
                        }
                    });
                }
            },
            get: function(){
                var self = this,
                    value, values = this._values,
                    allValues = new DesignCostSet(this.id),
                    newValues = new DesignCostSetItem(DesignCost.DESIGN_COST_ID);

                for (value in values){
                    if (!(values[value] === null || values[value] === undefined)){
                        if (!(values[value].value === null || values[value].value === undefined)){
                            newValues[values[value]._defaultValuesNames[0]] = values[value].value;
                        }
                    }
                }

                allValues.add(newValues);

                function addSubsValues(subs){
                    subs.forEach(function(sub){
                        var newSubValues = sub.values;
                        allValues.add(newSubValues);
                        if (sub._subs){
                            addSubsValues(sub._subs);
                        }
                    });

                }

                addSubsValues(this._subs);

                return allValues;
            },
            enumerable: true,
            configurable: true
        }
    });

    /**
     * Class: DESIGN_COST_VIEW_ITEM
     *
     * @param initValue
     * @constructor
     */
    function DesignCostViewItem(initValue){
        this._classID = DesignCost.VIEW_ITEM_CLASS_ID;
        this._defaultValuesNames = ['cost', 'included'];
        this._values = {};
        this._initViewItem(initValue);
    }

    DesignCostViewItem.prototype = inherit(DesignCostView.prototype);

    extend(DesignCostViewItem.prototype, {
        constructor: DesignCostViewItem,

        _initViewItem: function(initValue){
            this._checkIfStrNumObj(initValue, 'initValue');
            this._setID(initValue.id);
            this.setElBySelector(initValue.selector);

            if (initValue.hasOwnProperty('values')){
                this._createValuesFromJSON(initValue.values);
            }

            if (initValue.subs){
                if (this._isArray(initValue.subs)){
                    console.warn(this.errMsgClassAndId + ' Initialization warning: "Subs" type is array, no proper method to process');
                }

                if (this._isObject(initValue.subs)){
                    this._createAllViewSubsFromJSON(initValue.subs);
                }
            }
        },

        _updateValuesWithSet: function (set) {
            this.values = set.get(this.id);
        }
    });

    Object.defineProperties(DesignCostViewItem.prototype, {
        /**
         * Accessory property 'values'
         * provide SetItem Object with values for viewItemData
         */
        values: {
            set: function(viewItemData){
                var id = this.id;
                var value, values = this._values;
                this._checkType(viewItemData, 'modelItemData', ['object']);
                for (value in values){
                    values[value]._defaultValuesNames.forEach(function(name){
                        if ((name in viewItemData) && !(viewItemData[name] === null || viewItemData[name] === undefined)){
                            values[value].value = viewItemData[name];
                        }
                    });
                }
            },
            get: function(){
                var self = this,
                    value, values = this._values,
                    newValues = new DesignCostSetItem(this.id);

                for (value in values){
                    if (!(values[value] === null || values[value] === undefined)){
                        if (!(values[value].value === null || values[value].value === undefined)){
                            newValues[values[value]._defaultValuesNames[0]] = values[value].value;
                        }
                    }
                }

                return newValues;
            },
            enumerable: true,
            configurable: true
        },

        /**
         * Accessor property 'superior'
         * Sets reference to this parent object
         */
        superior: {
            set: function(superior){
                this._superior = superior;
            },
            get: function(){
                return this._superior;
            },
            enumerable: true,
            configurable: true
        }
    });



    /*******************************************
     *                                         *
     *      SubClasses:  VIEW VALUES           *
     *                                         *
     *      (ABSTRACT, AREA, FLOORS,           *
     *            INCLUDED, COST)              *
     *                                         *
     *******************************************/

    /**
     * Abstract Class: DESIGN_COST_VIEW_VALUE
     *
     * @param initValue
     * @constructor
     */
    function DesignCostViewValue(initValue){
        this._classID = DesignCost.VIEW_VALUE_CLASS_ID;
        this._initViewValue(initValue);
    }

    DesignCostViewValue.prototype = inherit(DesignCostView.prototype);

    extend(DesignCostViewValue.prototype, {
        constructor: DesignCostViewValue,

        _initViewValue: function(initValue){
            this._setID(initValue.id);
            this.setElBySelector(initValue.selector);
        }
    });

    Object.defineProperties(DesignCostViewValue.prototype, {
        superior: {
            set: function(superior){
                this._superior = superior;
            },
            get: function(){
                return this._superior;
            },
            numerable: true,
            configurable: true
        }
    });

    /**
     * Class: DESIGN_COST_VIEW_VALUE_AREA
     *
     * @param initValue
     * @constructor
     */
    function DesignCostViewValueArea(initValue){
        this._classID = DesignCost.VIEW_VALUE_AREA_CLASS_ID;
        this._defaultValuesNames = ['area'];
        this._initViewValue(initValue);
    }

    DesignCostViewValueArea.prototype = inherit(DesignCostViewValue.prototype);

    extend(DesignCostViewValueArea.prototype, {
        constructor: DesignCostViewValueArea
    });

    Object.defineProperties(DesignCostViewValueArea.prototype, {
        value: {
            set: function(val){
                this._checkType(val, 'val', ['number']);
                this.el[0].value = val;
            },
            get: function(){
                return this.el[0].value;
            },
            numerable: true,
            configurable: true
        }
    });

    /**
     * Class: DESIGN_COST_VIEW_VALUE_FLOORS
     *
     * @param initValue
     * @constructor
     */
    function DesignCostViewValueFloors(initValue){
        this._classID = DesignCost.VIEW_VALUE_FLOORS_CLASS_ID;
        this._defaultValuesNames = ['floors'];
        this._initViewValue(initValue);
    }

    DesignCostViewValueFloors.prototype = inherit(DesignCostViewValue.prototype);

    extend(DesignCostViewValueFloors.prototype, {
        constructor: DesignCostViewValueFloors
    });

    Object.defineProperties(DesignCostViewValueFloors.prototype, {
        value: {
            set: function(val){
                var i, len = this.el.length;
                this._checkType(val, 'val', ['number']);
                for (i = 0; i < len; i++){
                    if (this.el[i].value == val){
                        this.el[i].checked = true;
                    }
                }
            },
            get: function(){
                var i, len = this.el.length;
                for (i = 0; i < len; i++){
                    if (this.el[i].checked === true){
                        return this.el[i].value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        }
    });

    /**
     * Class: DESIGN_COST_VIEW_VALUE_COST
     *
     * @param initValue
     * @constructor
     */
    function DesignCostViewValueCost(initValue){
        this._classID = DesignCost.VIEW_VALUE_INCLUDED_CLASS_ID;
        this._defaultValuesNames = ['cost'];
        this._initViewValue(initValue);
    }

    DesignCostViewValueCost.prototype = inherit(DesignCostViewValue.prototype);

    extend(DesignCostViewValueCost.prototype, {
        constructor: DesignCostViewValueCost
    });

    Object.defineProperties(DesignCostViewValueCost.prototype, {
        value: {
            set: function(val){
                this._checkType(val, 'val', ['number']);
                this.el[0].innerHTML = this.convertNum2FinanceRU(val);
            },
            enumerable: true,
            configurable: true
        }
    });

    /**
     * Class: DESIGN_COST_VIEW_VALUE_INCLUDED
     *
     * @param initValue
     * @constructor
     */
    function DesignCostViewValueIncluded(initValue){
        this._classID = DesignCost.VIEW_VALUE_INCLUDED_CLASS_ID;
        this._defaultValuesNames = ['included'];
        this._initViewValue(initValue);
    }

    DesignCostViewValueIncluded.prototype = inherit(DesignCostViewValue.prototype);

    extend(DesignCostViewValueIncluded.prototype, {
        constructor: DesignCostViewValueIncluded
    });

    Object.defineProperties(DesignCostViewValueIncluded.prototype, {
        value: {
            set: function(val){
                this._checkType(val, 'val', ['boolean']);
                this.el[0].checked = val;
            },
            get: function(){
                return this.el[0].checked;
            },
            enumerable: true,
            configurable: true
        }
    });



    /*******************************************
     *                                         *
     *            Classes:  ROUTER             *
     *                                         *
     *******************************************/

    function DesignCostRouter(initValue){
        this._classID = DesignCost.ROUTER_CLASS_ID;
        this._defaultValuesNames = ['area', 'floors', 'cost', 'included'];
        this._initRouter(initValue);
    }

    DesignCostRouter.prototype = inherit(DesignCost.prototype);

    extend(DesignCostRouter.prototype, {
        constructor: DesignCostRouter,

        _initRouter: function(initValue){
            switch (this._checkIfStrNumObj(initValue, 'initValue')){
                case 'object':
                    if (initValue.hasOwnProperty('view')){
                        this._createViewFromJSON(initValue);
                    } else {
                        this._createViewFromObject(initValue);
                    }
                    break;

                case 'string':
                case 'number':
                    this._setID(initValue);
                    break;

                default :
                    break;
            }

            this.checkUrlForValues();
        },
        checkUrlForValues: function(){
            this.urlHasInitValues = location.search.length > 0;
        }
    });

    Object.defineProperties(DesignCostRouter.prototype, {
        values: {
            get: function(){
                return location.search.substr(1);
            },
            enumerable: true,
            configurable: true
        },
        url: {
            get: function(){
                return location.origin + location.pathname;
            },
            enumerable: true,
            configurable: true
        },
        urlHasInitValues: {
            set: function(val){
                this._urlHasInitValues = val;
            },
            get: function(){
                return this._urlHasInitValues;
            },
            enumerable: true,
            configurable: true
        }
    });

    var designCostModuleJSON = {
        controller: {
            id: DesignCost.CONTROLLER_ID
        },
        model: {
            id: DesignCost.MODEL_ID,
            area: 150,
            floors: 2,
            categories: [25, 50, 75, 100, 112, 125, 137, 150, 162, 175, 187, 200, 212, 225, 237, 250, 262, 275, 287, 300],
            included: true,
            subs: {
                architect: {
                    id: DesignCost.ARCHITECT_ID,
                    included: true,
                    subs: {
                        'architect-base': {
                            id: DesignCost.ARCHITECT_BASE_ID,
                            cost: [6300, 7200, 8100, 9000, 10700, 12400, 13750, 15100, 16500, 17900, 19250, 20600, 22000, 23400, 24750, 26100, 27500, 28900, 30250, 31600],
                            included: true
                        },
                        'architect-roof': {
                            id: DesignCost.ARCHITECT_ROOF_ID,
                            cost: [750, 800, 850, 900, 950, 1000, 1150, 1100, 1150, 1200, 1350, 1500, 1650, 1800, 2000, 2200, 2450, 2700, 2950, 3200],
                            included: true
                        },
                        'architect-electric': {
                            id: DesignCost.ARCHITECT_ELECTRIC_ID,
                            cost: [600, 800, 1000, 1200, 1350, 1500, 1650, 1800, 2000, 2200, 2350, 2500, 2650, 2800, 2900, 3000, 3150, 3300, 3450, 3600],
                            included: false
                        },
                        'architect-markers': {
                            id: DesignCost.ARCHITECT_MARKERS_ID,
                            cost: [700, 800, 900, 1000, 1100, 1200, 1350, 1500, 1650, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800],
                            included: false
                        },
                        'architect-openings': {
                            id: DesignCost.ARCHITECT_OPENINGS_ID,
                            cost: [700, 800, 900, 1000, 1100, 1200, 1350, 1500, 1650, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800],
                            included: false
                        },
                        'architect-furniture': {
                            id: DesignCost.ARCHITECT_FURNITURE_ID,
                            cost: [600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2250, 2500, 2600, 2700, 2850, 3000, 3100, 3200, 3350, 3500, 3750, 4000],
                            included: false
                        },
                        'architect-territory': {
                            id: DesignCost.ARCHITECT_TERRITORY_ID,
                            cost: 1500,
                            included: false
                        },
                        'architect-measurements': {
                            id: DesignCost.ARCHITECT_MEASUREMENTS_ID,
                            cost: 3000,
                            included: false
                        }
                    }
                },
                construct: {
                    id: DesignCost.CONSTRUCT_ID,
                    included: true,
                    subs: {
                        'construct-base': {
                            id: DesignCost.CONSTRUCT_BASE_ID,
                            cost: [3200, 3600, 4000, 4500, 5300, 6200, 6800, 7500, 8200, 9000, 9600, 10300, 11700, 12400, 13000, 13700, 14400, 15700, 20600, 16500],
                            included: true
                        },
                        'construct-beams': {
                            id: DesignCost.CONSTRUCT_BEAMS_ID,
                            cost: [750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1350, 1500, 1800, 2000, 2200, 2450, 2700, 3200, 3500, 3800],
                            included: true
                        },
                        'construction-rafters': {
                            id: DesignCost.CONSTRUCT_RAFTERS_ID,
                            cost: [1100, 1200, 1250, 1300, 1400, 1500, 1600, 1700, 1750, 1800, 2000, 2200, 2700, 3000, 3300, 3650, 4000, 4800, 5250, 5700],
                            included: true
                        },
                        'construction-foundation': {
                            id: DesignCost.CONSTRUCT_FOUNDATION_ID,
                            cost: [750, 800, 850, 900, 950, 1000, 1050, 1100, 1100, 1200, 1350, 1500, 1800, 2000, 2200, 2450, 2700, 3200, 3500, 3800],
                            included: true
                        },
                        'construction-framing': {
                            id: DesignCost.CONSTRUCT_FRAMING_ID,
                            cost: [3200, 3500, 3800, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 9000, 9500, 10000, 10500, 11000, 12000, 12600, 13200],
                            included: false
                        },
                        'construction-channels': {
                            id: DesignCost.CONSTRUCT_CHANNELS_ID,
                            cost: [2300, 2400, 2500, 2600, 2800, 3000, 3200, 3400, 3600, 4000, 4200, 4400, 5400, 6000, 6600, 7300, 8000, 9600, 10000, 10400],
                            included: false
                        }
                    }
                }
            }
        },
        view: {
            id: DesignCost.DESIGN_COST_ID,
            selector: '#ep-design-cost',
            values: {
                area: {
                    id: DesignCost.DESIGN_COST_ID + '-area',
                    type: DesignCost.AREA_ID,
                    selector: '[data-design-cost="design-cost-area"]'
                },
                cost: {
                    id: DesignCost.DESIGN_COST_ID + '-cost',
                    type: DesignCost.COST_ID,
                    selector: '[data-design-cost="design-cost-cost"]'
                },
                floors:{
                    id: DesignCost.DESIGN_COST_ID + '-floors',
                    type: DesignCost.FLOORS_ID,
                    selector: '[data-design-cost="design-cost-floors"]'
                }
            },
            subs: {
                architect: {
                    id: DesignCost.ARCHITECT_ID,
                    selector: '#ep-design-cost-architect',
                    values: {
                        cost: {
                            id: DesignCost.ARCHITECT_ID + '-cost',
                            type: DesignCost.COST_ID,
                            selector: '[data-design-cost="architect-cost"]'
                        },
                        included: {
                            id: DesignCost.ARCHITECT_ID + '-included',
                            type: DesignCost.INCLUDED_ID,
                            selector: '[data-design-cost="architect-included"]'
                        }
                    },
                    subs: {
                        "architect-base": {
                            id: DesignCost.ARCHITECT_BASE_ID,
                            selector: '#ep-design-cost-architect-base',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_BASE_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-base-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_BASE_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-base-included"]'
                                }
                            }
                        },
                        "architect-roof": {
                            id: DesignCost.ARCHITECT_ROOF_ID,
                            selector: '#ep-design-cost-architect-roof',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_ROOF_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-roof-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_ROOF_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-roof-included"]'
                                }
                            }
                        },
                        "architect-electric": {
                            id: DesignCost.ARCHITECT_ELECTRIC_ID,
                            selector: '#ep-design-cost-architect-electric',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_ELECTRIC_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-electric-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_ELECTRIC_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-electric-included"]'
                                }
                            }
                        },
                        "architect-markers": {
                            id: DesignCost.ARCHITECT_MARKERS_ID,
                            selector: '#ep-design-cost-architect-markers',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_MARKERS_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-markers-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_MARKERS_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-markers-included"]'
                                }
                            }
                        },
                        "architect-openings": {
                            id: DesignCost.ARCHITECT_OPENINGS_ID,
                            selector: '#ep-design-cost-architect-openings',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_OPENINGS_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-openings-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_OPENINGS_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-openings-included"]'
                                }
                            }
                        },
                        "architect-furniture": {
                            id: DesignCost.ARCHITECT_FURNITURE_ID,
                            selector: '#ep-design-cost-architect-furniture',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_FURNITURE_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-furniture-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_FURNITURE_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-furniture-included"]'
                                }
                            }
                        },
                        "architect-territory": {
                            id: DesignCost.ARCHITECT_TERRITORY_ID,
                            selector: '#ep-design-cost-architect-territory',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_TERRITORY_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-territory-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_TERRITORY_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-territory-included"]'
                                }
                            }
                        },
                        "architect-measurements": {
                            id: DesignCost.ARCHITECT_MEASUREMENTS_ID,
                            selector: '#ep-design-cost-architect-measurements',
                            values: {
                                cost: {
                                    id: DesignCost.ARCHITECT_MEASUREMENTS_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="architect-measurements-cost"]'
                                },
                                included: {
                                    id: DesignCost.ARCHITECT_MEASUREMENTS_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="architect-measurements-included"]'
                                }
                            }
                        }
                    }
                },
                construct: {
                    id: DesignCost.CONSTRUCT_ID,
                    selector: '#ep-design-cost-construct',
                    values: {
                        cost: {
                            id: DesignCost.CONSTRUCT_ID + '-cost',
                            type: DesignCost.COST_ID,
                            selector: '[data-design-cost="construct-cost"]'
                        },
                        included: {
                            id: DesignCost.CONSTRUCT_ID + '-included',
                            type: DesignCost.INCLUDED_ID,
                            selector: '[data-design-cost="construct-included"]'
                        }
                    },
                    subs: {
                        "construct-base": {
                            id: DesignCost.CONSTRUCT_BASE_ID,
                            selector: '#ep-design-cost-construct-base',
                            values: {
                                cost: {
                                    id: DesignCost.CONSTRUCT_BASE_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="construct-base-cost"]'
                                },
                                included: {
                                    id: DesignCost.CONSTRUCT_BASE_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="construct-base-included"]'
                                }
                            }
                        },
                        "construct-beams": {
                            id: DesignCost.CONSTRUCT_BEAMS_ID,
                            selector: '#ep-design-cost-construct-beams',
                            values: {
                                cost: {
                                    id: DesignCost.CONSTRUCT_BEAMS_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="construct-beams-cost"]'
                                },
                                included: {
                                    id: DesignCost.CONSTRUCT_BEAMS_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="construct-beams-included"]'
                                }
                            }
                        },
                        "construct-rafters": {
                            id: DesignCost.CONSTRUCT_RAFTERS_ID,
                            selector: '#ep-design-cost-construct-rafters',
                            values: {
                                cost: {
                                    id: DesignCost.CONSTRUCT_RAFTERS_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="construct-rafters-cost"]'
                                },
                                included: {
                                    id: DesignCost.CONSTRUCT_RAFTERS_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="construct-rafters-included"]'
                                }
                            }
                        },
                        "construct-foundation": {
                            id: DesignCost.CONSTRUCT_FOUNDATION_ID,
                            selector: '#ep-design-cost-construct-foundation',
                            values: {
                                cost: {
                                    id: DesignCost.CONSTRUCT_FOUNDATION_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="construct-foundation-cost"]'
                                },
                                included: {
                                    id: DesignCost.CONSTRUCT_FOUNDATION_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="construct-foundation-included"]'
                                }
                            }
                        },
                        "construct-framing": {
                            id: DesignCost.CONSTRUCT_FRAMING_ID,
                            selector: '#ep-design-cost-construct-framing',
                            values: {
                                cost: {
                                    id: DesignCost.CONSTRUCT_FRAMING_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="construct-framing-cost"]'
                                },
                                included: {
                                    id: DesignCost.CONSTRUCT_FRAMING_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="construct-framing-included"]'
                                }
                            }
                        },
                        "construct-channels": {
                            id: DesignCost.CONSTRUCT_CHANNELS_ID,
                            selector: '#ep-design-cost-construct-channels',
                            values: {
                                cost: {
                                    id: DesignCost.CONSTRUCT_CHANNELS_ID + '-cost',
                                    type: DesignCost.COST_ID,
                                    selector: '[data-design-cost="construct-channels-cost"]'
                                },
                                included: {
                                    id: DesignCost.CONSTRUCT_CHANNELS_ID + '-included',
                                    type: DesignCost.INCLUDED_ID,
                                    selector: '[data-design-cost="construct-channels-included"]'
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    var designCostController = new DesignCostController(designCostModuleJSON);

};

