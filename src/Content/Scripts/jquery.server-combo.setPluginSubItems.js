/// <reference path="byId.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/*!
 * jQuery Server ComboBox 1.0 
 * (a plugin for ASP.NET MVC or any server side programming language)
 * 
 * Copyright (c) 2015 by 
 * Md. Alim Ul Karim, 
 * Software Engineer at Enosis Solutions,
 * CSE, North South University 
 * Bangladesh, Dhaka. 
 * me{at}alimkarim.com
 *
 * by Md. Alim Ul karim 
 * 
 * Date         : 04 Jul 2015
 * Modified Date: 09 Jul 2015
 */

; (function ($, window, document, undefined) {
    // Avoid Plugin.prototype conflicts
    console.log($.serverComboBox);
    $.fn.setPluginSubItems = function () {
        /// <summary>
        /// Sets 
        /// this.retrieveData.plugin = this;
        /// this.ajax.plugin = this;
        /// this.render.plugin = this;
        /// ...
        /// </summary>
        /// <returns type=""></returns>
        this.retrieveData.plugin = this;
        this.ajax.plugin = this;
        this.render.plugin = this;
        this.render.icons.plugin = this;
        this.triggerableEvents.plugin = this;
        this.pagination.plugin = this;
        this.processingCategory.plugin = this;
        this.search.plugin = this;
    }
})(jQuery, window, document);
