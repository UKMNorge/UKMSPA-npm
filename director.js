var Director = class {

    constructor() {
        if(!window.$) {
            window.$ = jQuery;
        }

        this._onHistoryChangeState();
        this.eventlisteners = [];

        $(document).ready(() => {
            let page;
            let pageFromUrl = this._getPageFromUrl();
            let state = true;

            if(pageFromUrl && $('#'+pageFromUrl).attr('alone') == 'true') {
                page = pageFromUrl;
            }
            else {
                page = $($('.main-container.page')[0]).attr('id');
            }

            if(page) {
                this.openPage(page, state);
            }
        });
    }

    /**
     * Opens a page in a SPA way
     * @constructor
     * @param {string} id - site id, defined on a DOM Element. For example: <div id="pageMeldPaaArrangement">
     * @param {boolean} state - state
     * @param {boolean} scrollTop - scroll to the top of the page
     * 
     */
    openPage(id, state=true, scrollTop=false) {
        $('.main-container.page').css('margin-top', '-38px').addClass('hide');
        
        var page = $('.main-container.page#' + id);

        page.css('opacity', '.9').removeClass('hide').animate({
            'margin-top': '-44px',
            'margin-bottom': '+=10px',
            'opacity' : '1'
        }, 500, function() {
            
        });

        // Add attributes to header
        $('#headerMainText').html(page.attr('header-main-text'));
        $('#headerUnderText').html(page.attr('header-under-text'));

        if(state) {
            // Add current arguments
            var url = '';
            var urlParams = new URLSearchParams(window.location.search);
            
            urlParams.forEach((value, key) => {
                if(key != 'pageSPA') {
                    url = url + ('&' + key + '=' + value);
                }
            });

            this._addToUrl(id, url);
        }
        

        if(scrollTop) {
            var scroll = $(window).scrollTop();
            if(scroll > 150) {
                $("html, body").animate({ scrollTop: 50 }, 350);
            }
        }

        this._openPageTriggerEvent()
    }
    
    _openPageTriggerEvent(obj) {
        var obj = {
            id: this.getParam('pageSPA'),
        }

        if(this.eventlisteners['openPage']) {
            // Call callback from eventlistener
            for(var callback of this.eventlisteners['openPage']) {
                callback(obj);
            }
        }
    }

    // add param
    // update param
    addParam(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }

    // Returns null if the key is not available
    getParam(key) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(key);
    }

    removeParam(key) {

    }

    /**
     * Add event listeners. See the methods or documentation for event listeners supported
     * @constructor
     * @param {string} key - the key of the event listeners
     * @param {function(siteData): void} callback - callback function to be triggered on callback
     * 
     */
    addEventListener(key, callback) {
        if(!this.eventlisteners[key]) {
            this.eventlisteners[key] = [];
        }
        this.eventlisteners[key].push(callback);
    }

    _addToUrl(pageId, otherParams = '') {
        var state = { 'page_id': pageId, 'user_id': 5 };
        var title = '';
        var url = '?pageSPA=' + pageId + otherParams;        

        this._pushStateToHistory(state, title, url)
    }

    // Push state to window history
    _pushStateToHistory(state, title, url) {
        // If the browser has a window history and state
        if(window.history && window.history.state) {
            // Save window state
            var windowState = window.history.state;
            // If windowState is not null, windowState page_id and otherParams is the same as state
            // Trying to add the samme url, therefor return and don't add the samme url in history
            if(windowState && windowState.page_id == state.page_id && windowState.otherParams == state.otherParams) {
                return;
            }
        }
        history.pushState(state, title, url);
    }

    _getPageFromUrl() {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let params = Object.fromEntries(urlSearchParams.entries());
        return params['pageSPA'];
    }


    // When the state is changed. The user clicks back or forward buttons (slide left right on mobile platforms)
    _onHistoryChangeState() {
        window.onpopstate = history.onpushstate = (e) => {
            this.openPage(this._getPageFromUrl(), false, false);
        }

        $(window).on('popstate', (e) => {
            var state = e.originalEvent.state;
            if (state !== null) {
                this._openPageTriggerEvent()
            }
        });
    }

    _initPages() {
        
    }

}

module.exports = {
    Director
};
