var SPAInteraction = class {

    /**
     * Represents the UKMOnePage functionality.
     * @constructor
     * @param interactionObjekt - Et objekt som representer interaction og har metoder: 
     *  showMessage(title, message, type), openDialog(title, msg, buttons) og hideLoading()
     */
    constructor(interactionObjekt, baseURL = '/api/') {
       this.baseURL = baseURL;
       this.interactionObjekt = interactionObjekt;
       // Sjekk om $ er definert, ellers bruk jQuery
       this.$ = $ ? $ : jQuery;
    }

    // Interaction
    _showElementDOM(el) {
        // ...
    }

    removeElementFromDOM(el) {
        this.$(el).fadeOut();
    }

    removeElementFromDOMSlideUp(el) {
        this.$(el).animate(
            {'min-height' : 0, 'max-height' : 0, height : 0, padding : 0, margin : 0}, 400, () => {
            this.removeElementFromDOM(el);
        });
    }

    appendHTML(el, html) {
        this.$(el.append(html));
    }

    fadeElementDOM(el) {
        this.$(el).css('opacity', '.5');
    }    

    showMessage(title, message, type) { // -1 -> 'error', 0 -> 'normal', 1 -> 'warning'
        if(this.interactionObjekt) {
            this.interactionObjekt.showMessage(title, message, type);
        }
        else{
            console.warn('interactionObjekt has not been found!');
        }
    }
    
    showDialog(title, msg, buttons, onCloseCallback) {
        if(this.interactionObjekt) {
            this.interactionObjekt.openDialog(title, msg, buttons, onCloseCallback);
        }
        else {
            console.warn('interactionObjekt has not been found!');
        }
    }
    
    // Server communication
    async runAjaxCall(url, method, data, event = null) {
        var getData = [];    

        if(method == 'GET' && Object.keys(data).length > 0) {
            for(let key in data) {
                getData.push(data[key]);
            }
        }
        
        // event is the event where the call has been triggered.
        // if the element is button then a loader will be added
        var button = event ? (this.$(event.target).parent().parent().find('button')[0]) : null;
        if(button) {
            this.$(button).find('.spinner-border').detach();
            this.$(button).append('<div class="spinner-border" role="status"><span class="sr-only"></span></div>');
        }

        return new Promise((resolve, reject) => {  
            var _this = this;    
            this.$.ajax({
                url: this.baseURL + url,
                method: method,
                data: method == 'GET' ? {} : data,
                success: (res) => {
                    this.$(button).find('.spinner-border').detach();
                    resolve(res);
                }
            }).fail((res) => {
                // The call has returned an error, remove the spinner
                this.$(button).find('.spinner-border').detach();

                if(res.statusCode().status == 500) {
                    if(res.responseJSON.errorMessage) {
                        this.interactionObjekt.showMessage('Prosessen kan ikke utføres!', res.responseJSON.errorMessage, -1);
                    }
                }
                else if(res.statusCode().status == 400) {
                    // this.interactionObjekt.showMessage('Det er noe som mangler!', res.responseJSON.errorMessage, 0);
                }

                this.interactionObjekt.hideLoading();
                
                reject(res);
            });
        });
    }
}



module.exports = {
    SPAInteraction
}
