export var EventElement = class {
    
    /**
     * Represents a element in the DOM.
     * @constructor
     * @param {string} elementIdentification - the identifier of the DOM element
     * @param {string} type - event listener type
     * @param {function(Element, Promise, UKMOnePage, doAfter): void} doFunction - function that contains code specific to the context. Example: code to remove a DOM element
     * @param {string} url - url to be called after the event is triggered. It is used to identify where the call should be made
     * @param {string} ajaxMethod - GET, POST, PATCH, DELETE
     * @param {string[]} data - data will be fetched from the element defined as 'e' or the event element. The data most be defined as attributes of the DOM element
     * @param {function(): void} doBefore - This function will be executed before the event is triggered and it is called inside this class
     * @param {function(): void} doAfter - This function can be use after the event is triggered and can be called from outside this class. Can be used for CHAIN CALLS!
     * @return {void}
     * 
     */
    constructor(elementIdentification, type, doFunction, url, ajaxMethod, data, doAfter = null, doBefore = null) {
        this.elementIdentification = elementIdentification;
        this.type = type;
        this.doFunction = doFunction;
        this.url = url;
        this.ajaxMethod = ajaxMethod;
        this.data = data;
        this.doAfter = doAfter;
        this.doBefore = doBefore;
        
        // Call this when the event is triggered
        this.callback = null;
        this.ukmOnePage = null;
    }

    /**
     * Sets the callback function to be called on event trigger
     * @method
     * @param {function(Element, Array, doAfter)} callback - function that contains code to be executed on trigger. Example: execute ajax call
     * @return {void}
     */
    setCallback(callback) {
        this.callback = callback;
    }

    initEvent() {
        $(this.elementIdentification).on(this.type, (e) => {
            if(this.doBefore) this.doBefore();

            var data = {}

            for(var d of this.data) {
                data[d] = $(e.currentTarget).attr(d);
            }

            this.callback(e, data, this.doAfter);
        });
    }
}