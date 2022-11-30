# UKM SPA (Single Page Aplication)

Less mer om SPA: https://developer.mozilla.org/en-US/docs/Glossary/SPA


![alt text](https://github.com/UKMNorge/ukm-onepage-js/blob/main/docs/diagram-ukm-one-page.png?raw=true)


`UKMOnePage` representerer rammeverket og kan ikke initialiseres, derfor må en klasse som utvider det må opprettes.


`ProjectOnePage` - representerer en mer spesifikk implementasjon av rammeverket som passer for et prosjekt eller en side

## EventElement
representerer et DOM element som har et event og attributter som passer for det elementet.

```js
deltaOnePage.addEventElements([
   new EventElement('.card-body-arrangement.meldpaa', 'click', ()=>{ console.log("callback"); }, 'get_innslag_types', 'GET', ['pl_id'])        
]);
```


## Director
Director klasse brukes for å navigere gjennom sider som er definert i DOM som sider for å oppnå SPA metodologien.

```html
<div id="pageTestHello">
	<h1>Page content here...</h1>
</div>
```

```js
Director.openPage("pageTestHello");
```

### Event listeners
`openPage` - Når en ny side åpnes gjennom Director ved call på openPage() metode eller tilbake knapp


### Notater
Director kan brukes for å legge til attributter på URL og hente dem når det trengs.


## SPAInteraction

Brukes til å skape interaksjon i brukergrensesnittet, sende meldinger og mest viktig kjøre API kall.

HUSK: for å konstuere en ny instanse av SPAInteraction må et objekt sendes. Dette objekte må implementere disse metodene:
* showMessage(title, message, type)
* openDialog(title, msg, buttons)
* hideLoading()

Eksempel av objektet:

```js
export var interactionVue = new Vue({
    methods : {
        openDialog : function(title, msg, buttons = null, onCloseCallback) {
            // Implementering
        },
        showMessage : function(title, msg, type = 0) {
            // Implementering
        },
        hideLoading : function() {
            // Implementering
        }
    }
})
```

#### Kjører AJAX kall, metode GET
```js
var innslag = await this.spaInteraction.runAjaxCall('get_innslag/'+this.innslag_id, 'GET', {});

```

#### Dialog med callback
```js
var buttons = [{
	name : 'Slett',
	class : "aaa",
	callback : async ()=> {
	    // Slett noe
	}
}];

this.spaInteraction.showDialog('Vil du melde av?', 'Vil du virkelig slette dette?', buttons);
```
