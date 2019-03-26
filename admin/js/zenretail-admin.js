(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	var dict = {
		"ZenRetail Url": {
			it: "Indirizzo di ZenRetail"
		},
		"Choose your ZenRetail url": {
			it: "Inserisci l'indirizzo di ZenRetail"
		},
		"Open": {
			it: "Apri"
		},
		"Include in homepage": {
			it: "Includi nella pagina principale"
		},
		"Featured": {
			it: "Vetrina"
		},
		"News": {
			it: "Novità"
		},
		"Brands": {
			it: "Marche"
		},
		"Save all changes": {
			it: "Salva le modifiche"
		},
		"Automatically add zenretail primary categories in this menu": {
			en: " Automatically add zenretail primary categories in this menu",
			it: " Aggiungi automaticamente le categorie primarie di zenretail a questo menu"
		}
	};

	$(window).load(function() {
		$('body').translate({lang: locale, t: dict});
	});

})( jQuery );
