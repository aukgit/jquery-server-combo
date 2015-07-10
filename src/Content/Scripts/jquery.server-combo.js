/// <reference path="byId.js" />
/// <reference path="bootstrap.js" />
/// <reference path="jquery-2.1.4.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/// <reference path="jquery.validate.min.js" />
/// <reference path="jquery.validate.unobtrusive.js" />
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

    "use strict";
    if (typeof jQuery === 'undefined') {
        throw new Error('serverComboBox requires jQuery');
    }
    if (typeof jQuery.validator === "undefined") {
        throw new Error('serverComboBox requires jQuery validation plugin & jquery.validate.unobtrusive plugin.');
    }
    var pluginName = "serverComboBox",
        $selfContainer,
        $divContainers,
        isInit = false,
        additionalFields,
        KEYS = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46
        },
        defaults = {
            crossDomain: true,
            // send request while on request is already being processing.
            multipleRequests: true,
            checkValidationBeforeSendingRequest: true,
            dontSendSameRequestTwice: true,
            disableInputOnValidation: true,
            focusPersistIfNotValid: true,
            hideOnValidation: false,
            placeHolder: "",
            placeHolderValue: "",
            placeHolderDisable: false,
            isDynamicLoad: true,
            isTag: false,
            isLiveSearch: false,
            isOdata: false,
            isOdataPagefromServer: true,
            isMultipleSelect: true,
            isSelectFirstIndexByDefault: true,
            submitMethod: "Get",
            isRequired: true,
            oDataRelationsList: [],
            isPaginationEnable: false,
            pageSize: 30,
            totalItemsCountOnServer: 0,
            currentPage: 1,
            maxDisplayItems: 10,
            displayField: "display",
            searchingField: "display",
            valueField: "id",
            valueSelected: "",
            selectsFistOneByDefault: true,
            url: "",
            searchingUrl: "?search=@searchingKeyword",
            searchingVariable: "@searchingKeyword",
            delay: 250,
            nextPageUrl: "?Page=@pageNumber",
            pagingVariableName: "@pageNumber",
            selfUI: false,
            isOptimized: true,
            additionalCSS: "",
            singleItemClass: "",
            isDependableCombo: true,
            dependablePropertyName: "",
            inputValidationRegularExpression: "",
            elementCreatingId: "",
            elementName: "",
            isCustomHtml: true,
            searchType: {
                startsWith: true,
                contains: false,
                equal: false,
                notEqual: false,
                custom: ""
            },
            messages: {
                requesting: "Requesting data..."
            },
            selectors: {
                label: ".jq-server-combo-label",
                comboImplement: ".jq-server-combo-implement",
                divContainer: ".form-combo",
                additionalFields: [
                    "[name=__RequestVerificationToken]"
                ]
            },
            attributes: {
                url: "data-url",
                isValidate: "data-is-validate",
                submitMethod: "data-submit-method",
                propertyFieldName: "data-name"
            },
            icons: {
                invalid: "validation-icon-invalid fa fa-times",
                valid: "validation-icon-valid fa fa-check",
                spinner: "validation-icon-spinner fa fa-refresh fa-spin-custom",
                error: "validation-icon-error fa fa-exclamation-circle"
            },
            cssClass: {
                input: "jq-combo-input form-control",
                inputHover: "jq-combo-hover",
                comboHidden: "jq-combo-hidden",
                combo: "jq-combo",
                comboClick: "jq-combo-click",
                comboOpen: "jq-combo-open",
                comboHover: "jq-combo-hover-over",
                styleSetName: "default-style",
                listItem: "jq-combo-list-item",
                requestSending: "jq-combo-requesting-to-server",
                wrapper1: "first-wrapper-container",
                wrapper2: "second-wrapper-container",
                wrapper3: "third-wrapper-container",
                wrapper4: "forth-wrapper-container"
            },

            iconsIdPrefixes: {
                invalid: "invalid-mark-",
                valid: "valid-mark-",
                spinner: "validation-spinner-",
                error: "validation-error-",
                input: "jq-input-",
                wrapper1: "first-wrapper-",
                wrapper2: "second-wrapper-",
                wrapper3: "third-wrapper-",
                wrapper4: "forth-wrapper-"
            },
            response: {
                message: "Field is valid.",
                isValid: true,
                isError: false,
                errorCode: null,
                errorMessage: null
            },
            events: {
                iconCreated: function ($div, $input, $iconContainer) { },
                inputCreated: function (plugin, $div, $implementDiv, $input) { },
                sameRequestTwice: function ($div, $input, url, previousText) { },
                beforeSendingRequest: function ($div, $input, url) { },
                responseReceived: function ($div, $input, response) { },
                responseProcessed: function ($div, $input, response) { },
                invalidBefore: function ($div, $input, response) { },
                invalidAfter: function ($div, $input, response) { },
                validBefore: function ($div, $input, response) { },
                validAfter: function ($div, $input, response) { },
                onError: function ($div, $input, jqXHR, textStatus, exceptionMessage, url) { }
            }
        };

    // The actual plugin constructor
    function plugin($divElement, $implementDiv, options) {
        /// <summary>
        /// Process the div element and 
        /// </summary>
        /// <param name="element"></param>
        /// <returns type=""></returns>
        //$divElement.hide();
        this.settings = options;
        this.$implementDiv = $implementDiv;
        this.$element = $divElement;
        this._name = pluginName;
        this.init($divElement, $implementDiv);
    }

    function processAdditionalFields($elementContainer, additionalFieldsNamesArray) {
        var addFields = [];
        var selectors = additionalFieldsNamesArray;
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            var $element = $elementContainer.find(selector);
            if ($element.length > 0) {
                var nameOfElement = $element.attr("name");
                var valueOfElement = $element.attr("value");
                var pushingElement = {
                    name: nameOfElement,
                    value: valueOfElement
                };
                addFields.push(pushingElement);
            }
        }
        return addFields;
    }

    function getSingleSettingItem($div, attribute, settingElement) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="$div">$implement div with settings</param>
        /// <param name="attribute"></param>
        /// <param name="settingElement"></param>
        /// <returns type=""></returns>
        var value = $div.attr(attribute);
        if (value !== undefined && value !== null) {
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false;
            }
            return value;
        } else {
            return settingElement;
        }
    }

    function getSettingfromDiv($div, settings) {
        /// <summary>
        /// Pass settings and it's got overwritten by $div attributes
        /// </summary>
        /// <param name="$div">$implement div with settings</param>
        /// <returns type="setting">returns settings</returns>
        var crossMatch = [
            { setting: "crossDomain", attr: "data-cross-domain" },
            { setting: "placeHolder", attr: "data-placeholder" },
            { setting: "placeHolderValue", attr: "data-placeholder-value" },
            { setting: "placeHolderDisable", attr: "data-placeholder-disable" },
            { setting: "isDynamicLoad", attr: "data-dynamic-load" },
            { setting: "url", attr: "data-url" },
            { setting: "nextPageUrl", attr: "data-next-page-url" },
            { setting: "selfUI", attr: "data-original-self-ui" },
            { setting: "maxDisplayItems", attr: "data-max-search-item-display" },
            { setting: "isOdata", attr: "data-odata" },
            { setting: "isOdataPagefromServer", attr: "data-odata-is-paged-from-server" },
            { setting: "delay", attr: "data-is-keypress-delay" },
            { setting: "additionalCSS", attr: "data-additional-css" },
            { setting: "isLiveSearch", attr: "data-live-search" },
            { setting: "isDependableCombo", attr: "data-dependable" },
            { setting: "dependablePropertyName", attr: "data-dependable-prop-name" },
            { setting: "inputValidationRegularExpression", attr: "data-regularexpression-valid" },
            { setting: "valueSelected", attr: "data-selected-value" },
            { setting: "isMultipleSelect", attr: "data-is-multiple" },
            { setting: "isRequired", attr: "data-is-required" },
            { setting: "elementCreatingId", attr: "data-id" },
            { setting: "displayField", attr: "data-display-field" },
            { setting: "searchingField", attr: "data-searching-field" },
            { setting: "valueField", attr: "data-value-field" },
            { setting: "isDependableCombo", attr: "data-dependable" },
            { setting: "elementName", attr: "data-name" },
            { setting: "isPaginationEnable", attr: "data-pagination" },
            { setting: "totalItemsCountOnServer", attr: "data-total-items-count" },
            { setting: "currentPage", attr: "data-current-page" },
            { setting: "pageSize", attr: "data-page-size" },
            { setting: "isCustomHtml", attr: "data-custom-html-format" },
            { setting: "isOptimized", attr: "data-optimized" },
            { setting: "isTag", attr: "data-tag" },
            { setting: "isSelectFirstIndexByDefault", attr: "data-is-select-first-item" },
            { setting: "isTag", attr: "data-tag" },
            { setting: "submitMethod", attr: "data-submit-method" }

        ];
        for (var i = 0; i < crossMatch.length; i++) {
            var config = crossMatch[i];
            settings[config.setting] = getSingleSettingItem($div, config.attr, settings[config.setting]);
        }
        settings.messages.requesting = getSingleSettingItem($div, "data-requesting-label", settings.messages.requesting);

        return settings;
    }

    // Avoid Plugin.prototype conflicts
    $.extend(plugin.prototype, {
        data: null,
        currentPageData: null,
        selectedData: null,
        $input: null,
        $implementDiv: null,
        $element: null,
        isDebugging: true,
        processingCategory: {
            plugin: null,
            currentCategory: 1,
            regularUrl: 1,
            regularPagedUrl: 2,
            OdataUrl: 3,
            OdataPagedUrl: 4,

            get: function() {
                return this.currentCategory;
            },
            set: function(category) {
                this.currentCategory = category;
            },
            isRegular: function() {
                return this.get() === this.regularUrl;
            },
            isRegularPaged: function() {
                return this.get() === this.regularPagedUrl;
            },
            isOdata: function() {
                return this.get() === this.OdataUrl;
            },
            isOdataPaged: function() {
                return this.get() === this.OdataPagedUrl;
            },
            init: function() {
                var plugin = this.plguin,
                    settings = plugin.getSettings();

                var isRegularUrl = !settings.isPaginationEnable && !settings.isOdata,
                    isRegularPaged = settings.isPaginationEnable && !settings.isOdata,
                    isOdataOnly = !settings.isPaginationEnable && settings.isOdata,
                    isOdataPaged = settings.isPaginationEnable && settings.isOdata;
                if (isRegularUrl === true) {
                    this.set(this.regularUrl);
                } else if (isRegularPaged === true) {
                    this.set(this.regularPagedUrl);
                } else if (isOdataOnly === true) {
                    this.set(this.OdataUrl);
                } else if (isOdataPaged === true) {
                    this.set(this.OdataPagedUrl);
                }
            }
        },
        isEmpty: function (variable) {
            return variable === null || variable === undefined || variable.length === 0;
        },

        init: function ($divElement, $implementDiv) {
            if (this.isProcessingRequired()) {
                var css = this.getCssClasses(),
                    render = this.render;

                // sets this plugin to it's sub items.
                this.setPluginSubItems();
                // sets the processing category
                this.processingCategory.init();

                this.processDiv($divElement, $implementDiv);

                // add classes
                this.classAddRemove($divElement, css.styleSetName);
                this.classAddRemove($implementDiv, css.styleSetName);
                this.classAddRemove($divElement, "jq-server-combo");
                this.classAddRemove($implementDiv, "jq-server-combo-implement");
                this.classAddRemove($implementDiv, "implement");

                $divElement.attr("data-style", css.styleSetName);



                // render elements and retrieve elements in plugin object
                render.input(this, $divElement, $implementDiv);



                var $inputWrapper = render.$inputWrapper,
                    $input = render.$input;

                // trigger events
                this.setTriggerableEvents($divElement, $implementDiv, $inputWrapper, $input);

                this.setDefaultInvalidSettings();

                this.test();

            }
        },

        setDefaultInvalidSettings: function () {
            /// <summary>
            /// Set default values to settings if not set correctly.
            /// </summary>
            /// <returns type=""></returns>
            var settings = this.getSettings();
            if (isNaN(settings.currentPage)) {
                settings.currentPage = 1;
            }
        },
        setPluginSubItems: function () {
            /// <summary>
            /// Sets 
            /// this.retrieveData.plguin = this;
            /// this.ajax.plguin = this;
            /// this.render.plguin = this;
            /// ...
            /// </summary>
            /// <returns type=""></returns>
            this.retrieveData.plguin = this;
            this.ajax.plguin = this;
            this.render.plguin = this;
            this.triggerableEvents.plguin = this;
            this.pagination.plguin = this;
            this.processingCategory.plguin = this;
        },
        getSettings: function () {
            return this.settings;
        },
        isProcessingRequired: function () {
            /// <summary>
            /// is any processing required to instantiate this plugin
            /// </summary>
            /// <returns type="">T/F</returns>
            var settings = this.getSettings();
            return settings.isDynamicLoad;
        },
        isMultipleRequestAllowed: function () {
            return this.getSettings().multipleRequests;
        },
        isDisableInputOnValidation: function () {
            return this.getSettings().disableInputOnValidation;
        },
        isInputValidationRequirestoSendRequest: function () {
            return this.getSettings().checkValidationBeforeSendingRequest;
        },
        dontSendSameRequestTwice: function () {
            return this.getSettings().dontSendSameRequestTwice;
        },
        getAttributes: function () {
            return this.getSettings().attributes;
        },
        getID: function () {
            /// <summary>
            /// Returns element id.
            /// </summary>
            /// <returns type="">Returns element id.</returns>
            return this.getSettings().elementCreatingId;
        },
        getName: function () {
            /// <summary>
            /// Returns element name/combo name for form input.
            /// </summary>
            /// <returns type="">Returns element name/combo name for form input.</returns>
            return this.getSettings().elementName;
        },
        getValue: function () {
            /// <summary>
            /// Returns element combo value from settings.
            /// </summary>
            /// <returns type="">Returns element combo value from settings</returns>
            return this.getSettings().valueSelected;
        },
        setValue: function (val) {
            /// <summary>
            /// Set element value in settings and in the object.
            /// inComplete
            /// </summary>
            this.settings.valueSelected = val;
        },
        getEvents: function () {
            return this.getSettings().events;
        },
        getIcons: function () {
            return this.getSettings().icons;
        },
        getIdPrefixes: function () {
            return this.getSettings().iconsIdPrefixes;
        },
        getSelectors: function () {
            return this.getSettings().selectors;
        },
        getCssClasses: function () {
            /// <summary>
            /// Returns all classes list.
            /// </summary>
            /// <returns type=""></returns>
            return this.getSettings().cssClass;
        },
        getMessages: function () {
            return this.getSettings().messages;
        },
        getInputOrCreate: function () {
            if (this.isEmpty(this.$input)) {
                // create input if necessary
            }
            return this.$input;
        },

        processDiv: function ($div, $implementDiv) {
            //var $self = $selfContainer;
            //var url = this.retrieveData.getUrl();
            // this.test();
            // Task :
            // retrieve data.
            // then render UI
            //this.retrieveData.get(url);
            if (settings.selfUI === false) {

            }
        },
        test: function () {
            //this.showSpinner($input);
            this.pagination.getUrl();
        },
        setCurrentTextForNexttimeChecking: function ($input) {
            $input.attr("data-previous-submit", $input.val());
        },
        isPreviousRequestIsSame: function ($div, $input, url) {
            /// <summary>
            /// Returns true/false based if it is the same request twice.
            /// Also called the event sameRequestTwice 
            /// </summary>
            /// <param name="$input"></param>
            /// <returns type="boolean">Returns true/false</returns>
            var previous = $input.attr("data-previous-submit"),
                returnStatement = previous === $input.val(),
                settings = this.getSettings(),
                events = settings.events;
            if (this.isDebugging) {
                console.log("Request is same : " + returnStatement);
            }

            if (returnStatement) {
                if (!this.isEmpty(events.sameRequestTwice)) {
                    events.sameRequestTwice($div, $input, url, previous);
                }
            }
            return returnStatement;
        },
        createInput: function () {

        },
        inputProcessWithBlurEvent: function ($div, $input, url) {
            var self = this,
                settings = this.getSettings(),
                isIconsVisible = true;
            //$input.on("blur", function (evt) {
            //    self.blurEvent(evt, $div, self, $input, url);
            //    isIconsVisible = true;
            //});
            //$input.on("keypress", function () {
            //    if (isIconsVisible === true) {
            //        $div.removeAttr("data-icon-added");
            //        self.hideInvalidIcon($input);
            //        self.hideSpinner($input);
            //        self.hideErrorIcon($input);
            //        self.hideErrorIcon($input);
            //        self.hideValidIcon($input);
            //        isIconsVisible = false;
            //    }
            //});
        },
        blurEvent: function (event, $div, self, $input, url) {
            //var isRequstValid = !self.isInProcessingMode($div) || self.isMultipleRequestAllowed();
            //// if we are allowing to send multiple request while one is already being processing in the server.
            //if (isRequstValid) {
            //    var $inputNew = $input;///$(this);
            //    var isDuplicateRequestAllowed = self.dontSendSameRequestTwice() && !self.isPreviousRequestIsSame($div, $inputNew, url);
            //    isRequstValid = isDuplicateRequestAllowed || !self.dontSendSameRequestTwice();
            //    // check if same request is allowed to send twice.
            //    if (isRequstValid) {

            //        // if validation request before sending request.
            //        var validationRequires = self.isInputValidationRequirestoSendRequest();

            //        // is input needed to be valid before send the request.
            //        isRequstValid = (validationRequires && $inputNew.valid()) || !validationRequires;

            //        if (isRequstValid) {
            //            var fields = self.concatAdditionalFields($inputNew);

            //            self.sendRequest($div, $inputNew, url, fields);
            //        }
            //        if (self.getSettings().focusPersistIfNotValid) {
            //            self.focusIfnotValid($inputNew);
            //        }
            //    }
            //}
        },
        concatAdditionalFields: function ($input) {
            var addFields = additionalFields.slice();
            var fields = {
                name: $input.attr("name"),
                value: $input.val()
            };
            addFields.push(fields);
            return addFields;
        },
        getSubmitMethod: function ($input) {
            /// <summary>
            /// Returns submit method is it post or get
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>
            return this.getSettings().submitMethod;
        },
        markAsProcessing: function ($div, isProcessing) {
            /// <summary>
            /// Set mark as processing true or false.
            /// </summary>
            /// <param name="$div"></param>
            /// <param name="isProcessing"></param>
            /// <returns type=""></returns>
            if (this.isDebugging) {
                console.log("Making: " + isProcessing);
            }
            $div.attr("data-is-processing", isProcessing);
        },
        isInProcessingMode: function ($div) {
            /// <summary>
            /// returns if in processing
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>
            var attr = $div.attr("data-is-processing");
            if (this.isDebugging) {
                console.log("is Processing: " + attr);
            }
            return attr === "true";
        },
        animateOn: function ($object) {
            $object.fadeIn("slow");
        },
        animateOff: function ($object) {
            $object.hide();
        },
        classAddRemove: function ($element, add, remove) {
            /// <summary>
            /// Every class addition or remove should be done by this method.
            /// </summary>
            /// <param name="$implement"></param>
            /// <param name="add"></param>
            /// <param name="remove"></param>
            /// <returns type=""></returns> 
            if (!this.isEmpty(add)) {
                $element.addClass(add);
            }
            if (!this.isEmpty(remove)) {
                $element.removeClass(remove);
            }
        },


        /**
         * Calls all the events bindings
         */
        setTriggerableEvents: function ($div, $implement, $inputWrapper, $input) {
            /// <summary>
            /// Calls all the events binding.
            /// </summary>
            /// <param name="$div"></param>
            /// <param name="$implement"></param>
            /// <param name="$inputWrapper"></param>
            /// <param name="$input"></param>
            /// <returns type=""></returns>
            var triggerableEvents = this.triggerableEvents,
                self = this,
                render = this.render,
                $caretWrapper = render.$caretWrapper;

            $implement.hover(
                function (e) {
                    // in
                    triggerableEvents.implementHoverIn(self, $div, $implement, $inputWrapper, $input);
                },
                function (e) {
                    // out
                    triggerableEvents.implementHoverOut(self, $div, $implement, $inputWrapper, $input);
                }
            );
            $caretWrapper.hover(
                function (e) {
                    // in
                    triggerableEvents.caretHoverIn(self, $div, $implement, $inputWrapper, $input, $caretWrapper, render);
                },
                function (e) {
                    // out
                    triggerableEvents.caretHoverOut(self, $div, $implement, $inputWrapper, $input, $caretWrapper, render);
                }
            ).click(function () {
                triggerableEvents.caretClick(self, $div, $implement, $inputWrapper, $input, $caretWrapper, render);

            });

        },
        triggerableEvents: {
            plugin: null,
            divHoverIn: function (plugin, $div, $implement, $inputWrapper, $input) {

            },
            divHoverOut: function (plugin, $div, $implement, $inputWrapper, $input) {

            },
            implementHoverIn: function (plugin, $div, $implement, $inputWrapper, $input) {
                var css = plugin.getCssClasses();
                plugin.classAddRemove($div, css.comboHover);
            },
            implementHoverOut: function (plugin, $div, $implement, $inputWrapper, $input) {
                var css = plugin.getCssClasses();
                plugin.classAddRemove($div, null, css.comboHover);
            },
            caretClick: function (plugin, $div, $implement, $inputWrapper, $input, $caretWrapper, render) {
                var css = plugin.getCssClasses();
                plugin.classAddRemove($caretWrapper, null, css.comboHover);
            },
            caretHoverIn: function (plugin, $div, $implement, $inputWrapper, $input, $caretWrapper, render) {
                var css = plugin.getCssClasses();
                plugin.classAddRemove($caretWrapper, css.comboHover);
            },
            caretHoverOut: function (plugin, $div, $implement, $inputWrapper, $input, $caretWrapper, render) {
                var css = plugin.getCssClasses();
                plugin.classAddRemove($caretWrapper, null, css.comboHover);
            }
        },

        render: {
            plugin: null,
            $inputWrapper: null,
            $input: null,
            $caretWrapper: null,
            inputWrapper: function (plugin, $div, $implement, idPrefixes, id, cssClass) {
                /// <summary>
                /// Render and get wrappers for input, along with caret wrapper and so on.
                /// this.$caretWrapper, this.$inputWrapper populated.
                /// </summary>
                /// <param name="plugin"></param>
                /// <param name="$div"></param>
                /// <param name="$implement"></param>
                /// <param name="idPrefixes">Id prefix object from the settings</param>
                /// <param name="id">Send the id of the input</param>
                /// <returns type=""></returns>
                var elementName = "$inputWrapper";

                if (plugin.isEmpty(this[elementName])) {
                    var wrapper1 = idPrefixes.wrapper1 + id,
                        wrapper2 = idPrefixes.wrapper2 + id,
                        dropDownIconId = "dropdown-icon-" + id,
                        dropDownIconWrapperId = "dropdown-wrapper-icon-" + id,

                        $divWrapper1 = $("<div></div>", {
                            id: wrapper1,
                            'class': cssClass.wrapper1
                        }),
                        $divWrapper2 = $("<div></div>", {
                            id: wrapper2,
                            'class': cssClass.wrapper2
                        }),
                        $iconWrapper = $("<span></span>", {
                            id: dropDownIconWrapperId,
                            'class': "dropdown-wrapper-icon"
                        }),
                        $icon = $("<i></i>", {
                            id: dropDownIconId,
                            'class': "dropdown-icon fa fa-caret-down"
                        });
                    $icon.appendTo($iconWrapper);
                    $iconWrapper.appendTo($divWrapper2);
                    $divWrapper2.appendTo($divWrapper1);
                    $divWrapper1.appendTo($implement);
                    this.$caretWrapper = $.byId(dropDownIconWrapperId);
                    this[elementName] = $.byId(wrapper2);
                }
                return this[elementName];
            },
            input: function (plugin, $div, $implement) {
                /// <summary>
                /// Get input from cache or else create it and then return.
                /// also sets plugin.$input = returned input
                /// </summary>
                /// <returns type="">$input box</returns>
                var cssClass = plugin.getCssClasses(),
                    settings = plugin.getSettings(),
                    ids = plugin.getIdPrefixes(),
                    id = plugin.getID(),
                    finalId = ids.input + id,
                    events = plugin.getEvents();

                var elementName = "$input";

                if (plugin.isEmpty(this[elementName])) {
                    // if empty then create
                    var placeHolder = "", placeHolderValue = "", isPlaceHolder = false;
                    if (settings.placeHolderDisable === false) {
                        placeHolder = settings.placeHolder;
                        placeHolderValue = settings.placeHolderValue;
                        isPlaceHolder = true;
                    }
                    var $inputHtml = $("<input/>", {
                        id: finalId,
                        'class': cssClass.input,
                        type: "text",
                        placeholder: placeHolder,
                        'data-placeholder-val': placeHolderValue,
                        'data-is-placeholder': isPlaceHolder
                    });
                    var $inputWrapper = this.inputWrapper(plugin, $div, $implement, ids, id, cssClass);

                    $inputHtml.prependTo($inputWrapper);

                    this[elementName] = $.byId(finalId);
                    if (plugin.isDebugging) {
                        console.log(this.$input);
                    }
                    events.inputCreated(plugin, $div, $implement, this[elementName]);
                    plugin[elementName] = this[elementName];
                }

                return this[elementName];
            }
        },
        ajax: {
            // only the data from the given url.
            plguin: null,
            ajaxRequest: null,
            abortPrevious: function () {
                /// <summary>
                /// Abort previous ajax request and hide all the icons
                /// </summary>
                /// <returns type=""></returns>
                if (!this.plguin.isEmpty(this.ajaxRequest)) {
                    this.ajaxRequest.abort();
                }
            },
            addClassWhileSending: function () {
                /// <summary>
                /// add class while sending or processing the ajax request.
                /// </summary>
                var plugin = this.plguin,
                    $implement = plugin.$implementDiv,
                    $div = plugin.$element,
                    settings = plugin.getSettings(),
                    classes = settings.cssClass;
                //add
                plugin.classAddRemove($div, classes.requestSending);
                plugin.classAddRemove($implement, classes.requestSending);
            },
            removeClassAfterSendingRequest: function () {
                /// <summary>
                /// remove class after sending or processing the ajax request.
                /// </summary>
                var plugin = this.plguin,
                    $implement = plugin.$implementDiv,
                    $div = plugin.$element,
                    settings = plugin.getSettings(),
                    classes = settings.cssClass;
                // remove
                plugin.classAddRemove($div, null, classes.requestSending);
                plugin.classAddRemove($implement, null, classes.requestSending);
            },
            beforeSend: function ($implement, $input, url, sendingFields) {

            },
            sendRequest: function ($div, $implement, url, sendingFields) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="$div"></param>
                /// <param name="$implement"></param>
                /// <param name="url"></param>
                /// <param name="sendingFields"></param>
                /// <returns type=""></returns>
                var plugin = this.plguin,
                    method = plugin.getSubmitMethod(),
                    settings = plugin.getSettings(),
                    events = settings.events,
                    isCrossDomain = settings.crossDomain;
                if (!this.isEmpty(events.beforeSendingRequest)) {
                    //events.beforeSendingRequest($div, $input, url, sendingFields);
                }

                // Abort previous ajax request and hide all the icons
                this.abortPrevious();

                this.addClassWhileSending();

                plugin.markAsProcessing($div, true);
                //plugin.setCurrentTextForNexttimeChecking($div);
                this.ajaxRequest = jQuery.ajax({
                    method: method, // by default "GET"
                    url: url,
                    data: sendingFields, // PlainObject or String or Array
                    crossDomain: isCrossDomain,
                    dataType: "JSON" //, // "Text" , "HTML", "xml", "script" 
                });

                this.ajaxRequest.done(this.dataReceived);

                this.ajaxRequest.fail(function (jqXHR, textStatus, exceptionMessage) {
                    this.removeClassAfterSendingRequest();
                    plugin.markAsProcessing($div, false);

                    //self.hideSpinner($input);
                    self.errorProcess($div, $input, jqXHR, textStatus, exceptionMessage, url);
                    console.log("Request failed: " + exceptionMessage + ". Url : " + url);
                });
            },
            dataReceived: function (response) {
                var plugin = this.plguin,
                    $div = this.$element,
                    $implement = this.$implementDiv,
                    method = plugin.getSubmitMethod(),
                    isInTestingMode = plugin.isDebugging,
                    events = plugin.getSettings().events;
                this.removeClassAfterSendingRequest();
                plugin.markAsProcessing($div, false);
                if (isInTestingMode) {
                    console.log(response);
                }

            },
            errorProcess: function ($div, $input, jqXHR, textStatus, exceptionMessage, url) {
                var code = jqXHR.status,
                    settings = this.getSettings(),
                    events = settings.events,
                    msg = "";

                if (code === 0) {
                    code = 404;
                    textStatus = "Requested url doesn't lead to a valid request.";
                }
                msg = "Code " + code + " : " + textStatus;

                //console.log(jqXHR);
                //console.log(textStatus);
                //icons show/hide
                this.showErrorIcon($input, msg);
                if (settings.focusPersistIfNotValid) {
                    this.focusIfnotValid($input, true);
                }
                if (!this.isEmpty(events.onError)) {
                    events.onError($div, $input, jqXHR, textStatus, exceptionMessage, url);
                }
            }
        },

        //contains url methods and pagination.
        pagination: {
            setPage: function (pageNumber) {

            },
            getUrlRegularPaged: function (plugin, settings) {
                var currentPage = settings.currentPage,
                    nextUrl = settings.nextPageUrl,
                    nextPageVariable = settings.pagingVariableName;
                var newNextPageUrl = nextUrl.replace(nextPageVariable, currentPage);
                if (plugin.isDebugging) {
                    console.log("Paged url:");
                    console.log(newNextPageUrl);
                }
                return newNextPageUrl;
            },
            getUrlODataPaged: function (plugin, settings) {
                var currentPage = settings.currentPage,
                    searchingElements = [],
                    top = "$top=" + settings.pageSize,
                    skipNumber = (currentPage - 1) * settings.pageSize,
                    skip = "$skip=" + skipNumber,
                    count = "$inlinecount=allpages",
                    select = "$select=" + settings.displayField + "," + settings.valueField + "," + settings.searchingField,
                    isPagination = settings.isPaginationEnable;

                if (isPagination) {
                    searchingElements.push(top);
                    if (skipNumber > 0) {
                        searchingElements.push(skip);
                    }
                }

                searchingElements.push(count);
                if (settings.isOptimized) {
                    searchingElements.push(select);
                }

                var queryString = searchingElements.join("&");


                var newNextPageUrl = settings.url;
                if (newNextPageUrl[newNextPageUrl.length - 1] !== '?') {
                    newNextPageUrl += '?';
                }

                newNextPageUrl += queryString;


                if (plugin.isDebugging) {
                    console.log("Paged url:");
                    console.log(newNextPageUrl);
                }
                return newNextPageUrl;
            },
            getUrl: function () {
                /// <summary>
                /// Gets the right url based on odata or paged or anything.
                /// </summary>
                /// <returns type="">Returns the right url based on odata or paged or anything based on settings.</returns>
                var plugin = this.plguin,
                    settings = plugin.getSettings(),
                    category = plugin.processingCategory;

                var isRegularUrl = category.isRegular(),
                    isRegularPaged = category.isRegularPaged(),
                    isOdataOnly = category.isOdata(),
                    isOdataPaged = category.isOdataPaged();


                if (isRegularUrl) {
                    // retrieve data from direct url.
                    return settings.url;
                } else if (isOdataOnly) {
                    // retrieve data from direct url.
                    return this.getUrlODataPaged(plugin, settings);
                } else if (isRegularPaged) {
                    return this.getUrlRegularPaged(plugin, settings);
                } else if (isOdataPaged) {
                    return this.getUrlODataPaged(plugin, settings);
                    //} else if (isOdataPagedServer) {
                    //    return this.getUrlODataPagedServer(plugin, settings);
                }

                return null;
            }
        },

        retrieveData: {
            // route and configure url and then get the data from the url.
            plguin: null,

            getRegularData: function (url) {
                var plguin = this.plguin,
                    ajax = plugin.ajax;
                //ajax.sendRequest()
            },
            get: function (url) {
                /// <summary>
                /// Retrieve data as per necessary.
                /// Decide weather if :
                /// it is odata then get data by pagination.
                /// it is also paged data from non odata source also retrieve it.
                /// Or anything else..
                /// Route point of getting the data.
                /// </summary>
                /// <param name="url"></param>
                /// <returns type=""></returns>
                var plguin = this.plguin;

                //console.log(plguin);
                //console.log(this);
                //console.log(url);
                //console.log(plguin.getSettings());
            }
        }


    });

    $.fn.serverComboBox = function (options) {
        /// <summary>
        /// expecting a container which contains divs
        /// of .form-combo and inside there is a input with
        /// a .validator-container>.validator
        /// </summary>
        /// <param name="options"></param>
        /// <returns type=""></returns>
        var $elementContainer = this,
            settingsTemporary = $.extend({}, defaults, options),
            selectors = settingsTemporary.selectors,
            additionalFieldsSelectorArray = selectors.additionalFields;

        $selfContainer = this;
        if (isInit !== true) {
            $divContainers = $elementContainer.find(selectors.divContainer);
            additionalFields = processAdditionalFields($elementContainer, additionalFieldsSelectorArray);
            isInit = true;
        }

        var $containers = $divContainers;

        for (var i = 0; i < $containers.length; i++) {
            var $divElement = $($containers[i]),
                settingTemporary2 = $.extend({}, defaults, options),
                $implementDiv = $divElement.find(selectors.comboImplement),
            settings = getSettingfromDiv($implementDiv, settingTemporary2);
            //console.log(settings);
            //console.log($divElement);
            new plugin($divElement, $implementDiv, settings);
        }
    };

})(jQuery, window, document);
