import { SPAInteraction } from './SPAInteraction.js'; 


/* Abstract class */
export var UKMOnePage = class {

    /**
     * Represents the UKMOnePage functionality.
     * @constructor
     * @param {string} ajaxUrl - ajax main url e.g api here -> ...ukm.no/api/getSomething...
     * @param {EventElement []} eventElements - Event elements that contains information about the event and steps to be taken afterwards
     * @param interactionObjekt - Et objekt som representer interaction og har metoder: 
     *  showMessage(title, message, type), openDialog(title, msg, buttons) og hideLoading()
     */
    constructor(ajaxUrl, eventElements, interactionObjekt) {
        // Denne klassen kan ikke konstrueres fordi denne klassen er abstrakt klasse
        if (this.constructor === UKMOnePage) {
            throw new TypeError('Abstract class "UKMOnePage" cannot be instantiated directly.'); 
        }

        this.ajaxUrl = ajaxUrl;
        this.eventElements = eventElements;
        
        this.spaInteraction = new SPAInteraction(interactionObjekt)
        this._eventListener();
    }

    /**
     * Add event elements 
     * @constructor
     * @param {EventElement []} eventElements - Event elements that contains information about the event and steps to be taken afterwards
     */
    addEventElements(eventElements) {
        this.eventElements = this.eventElements.concat(eventElements);
        this._eventListener(eventElements);
    }

    removeElementFromDOM(el) {
        return this.spaInteraction.removeElementFromDOM(el);
    }

    removeElementFromDOMSlideUp(el) {
        return this.spaInteraction.removeElementFromDOMSlideUp(el);

    }

    appendHTML(el, html) {
        return this.spaInteraction.appendHTML(el, html);
    }

    fadeElementDOM(el) {
        return this.spaInteraction.fadeElementDOM(el)
    }
    
    async _runAjaxCall(url, method, data) {
        return this.spaInteraction.runAjaxCall(url, method, data);
    }

    _eventListener(eventElements) {
        for(var ev of (eventElements ? eventElements : this.eventElements)) {
            var _this = this;
            var callback = async function(e, data, doAfter) {
                // Remember: 'this' refers to the class where the function is called and not this class here!
                var response = _this._runAjaxCall(this.url, this.ajaxMethod, data);
                this.doFunction(e, response, _this, doAfter);
            }
            ev.setCallback(callback);
            ev.initEvent();
        }
    }
}
