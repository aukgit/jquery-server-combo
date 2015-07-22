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
    $.fn.serverComboBox.render = {
        // all methods are create or get method, means create if not exist in efficient manner or else send from cache.
        // only get methods don't create anything only returns the object.
        plugin: null,
        $inputWrapper: null,
        $input: null,
        $list: null,
        $listOfItems: null,
        $select: null,
        select: function (plugin, $implement) {
            /// <summary>
            /// Create select for this combobox.
            /// </summary>
            /// <param name="plugin"></param>
            /// <param name="$implement"></param>
            /// <returns type=""></returns>
            var elementName = "$select",
               $elem = this[elementName];

            if (plugin.isEmpty($elem)) {
                var css = plugin.getCssClasses(),
                    hiddenClass = css.hiddenClass,
                    attrId = plugin.getID(),
                    attrName = plugin.getName();
                var $selectHtml = $("<select />", {
                    id: attrId,
                    name: attrName,
                    'class': hiddenClass
                });
                $selectHtml.prependTo($implement);
                $elem = $selectHtml;
                this[elementName] = $elem;
            }
            return $elem;
        },
        icons: {
            plugin: null,
            $caretWrapper: null,
            $searchWrapper: null,
            $spinnerWrapper: null,
            $errorWrapper: null,
            $validWrapper: null,
            $invalidWrapper: null,
            $iconsListWrapper: null,
            allIconsIdList: [], // set from createAllIcons method. [ids.errorIcon,ids.invalidIcon, ids.validIcon, ids.spinnerIcon,ids.searchIcon, ids.caretIcon]
            listId: null,
            showOnlyIcons: function (iconIds) {
                /// <summary>
                /// Only given array of iconIds will be visible others will be hidden
                /// </summary>
                /// <param name="iconIds">array type or single string, if single id given as string then only that one will be displayed.</param>
                /// <returns type=""></returns>
                if (iconIds) {
                    var hiddenListIds = [],
                        allIconIds = this.allIconsIdList,
                        i, id, plugin = this.plugin;
                    if (Array.isArray(iconIds)) {
                        // multiple ids
                        for (i = 0; i < allIconIds.length; i++) {
                            id = allIconIds[i];
                            if (iconIds.indexOf(id) === -1) {
                                // don't display that icon
                                hiddenListIds.push(id);
                            }
                        }
                        // show
                        for (i = 0; i < iconIds.length; i++) {
                            id = iconIds[i];
                            this.showIcon(plugin, id);
                        }
                        // hide
                        for (i = 0; i < hiddenListIds.length; i++) {
                            id = hiddenListIds[i];
                            this.hideIcon(plugin, id);
                        }
                    } else if (typeof iconIds === "string") {
                        // single id
                        for (i = 0; i < allIconIds.length; i++) {
                            id = allIconIds[i];
                            if (iconIds === id) {
                                // don't display that icon
                                this.showIcon(plugin, id);
                            } else {
                                this.hideIcon(plugin, id);
                            }
                        }
                    }

                }
            },
            showIcon: function (plugin, iconId) {
                var $icon = this.getOrCreateIcon(plugin, iconId),
                    css = plugin.getCssClasses(),
                    hiddenClass = css.hiddenClass;
                plugin.classAddRemove($icon, null, hiddenClass);
                plugin.animateOn($icon);
            },
            hideIcon: function (plugin, iconId) {
                var $icon = this.getOrCreateIcon(plugin, iconId),
                    css = plugin.getCssClasses(),
                    hiddenClass = css.hiddenClass;
                plugin.classAddRemove($icon, hiddenClass);
                plugin.animateOff($icon);
            },
            createAllIcons: function (plugin) {
                var ids = plugin.getIdPrefixes(),
                    iconIds = [
                        ids.errorIcon,
                        ids.invalidIcon,
                        ids.validIcon,
                        ids.spinnerIcon,
                        ids.searchIcon,
                        ids.caretIcon
                    ];
                this.allIconsIdList = iconIds;
                for (var i = 0; i < iconIds.length; i++) {
                    var iconId = iconIds[i];
                    this.getOrCreateIcon(plugin, iconId);
                }
            },
            getOrCreateIcon: function (plugin, iconId) {
                /// <summary>
                /// Create and get icon by this method
                /// </summary>
                /// <param name="plugin"></param>
                /// <param name="iconId"></param>
                /// <returns type=""></returns>
                var ids = plugin.getIdPrefixes(),
                    settings = plugin.getSettings(),
                    cssClasses = plugin.getCssClasses(),
                    icons = settings.icons,
                    msgs = settings.messages,
                    message = "",
                    css = "",
                    elementName = "",
                    hiddenClass = " " + cssClasses.hiddenClass,
                    $elem = null;


                if (iconId === ids.caretIcon) {
                    // caret icon
                    elementName = "$caretWrapper";
                    css = icons.caret;
                    hiddenClass = "";
                } else if (iconId === ids.searchIcon) {
                    // caret icon
                    elementName = "$searchWrapper";
                    css = icons.search;
                    message = msgs.searchIcon;
                    hiddenClass = "";
                } else if (iconId === ids.errorIcon) {
                    // caret icon
                    elementName = "$errorWrapper";
                    css = icons.error;
                    message = msgs.errorIcon;
                } else if (iconId === ids.spinnerIcon) {
                    // caret icon
                    elementName = "$spinnerWrapper";
                    css = icons.spinner;
                    message = msgs.spinnerIcon;
                } else if (iconId === ids.validIcon) {
                    // caret icon
                    elementName = "$validWrapper";
                    css = icons.valid;
                    message = msgs.validIcon;
                } else if (iconId === ids.invalidIcon) {
                    // caret icon
                    elementName = "$invalidWrapper";
                    css = icons.invalid;
                    message = msgs.invalidIcon;
                }
                $elem = this[elementName];
                if ($elem) {
                    // if already exist.
                    return $elem;
                } else {
                    // create
                    var $inputWrapper = plugin.render.$inputWrapper,
                        $list = this.getOrCreateListWrapper(plugin, $inputWrapper),
                        id = plugin.getID(), // input id
                        wrapperId = ids.iconWrapper, // jq-combo-icons-wrapper-
                        appropriateClass = iconId.substr(0, iconId.length - 1), // jq-combo-icon-caret
                        finalIconId = iconId + id, // jq-combo-icon-caret-inputId
                        onlyIcon = appropriateClass.replace("jq-combo-icon-", ""), // caret
                        iconWrapperId = wrapperId + onlyIcon + "-" + id;
                    // create
                    var $iconWrapper = $("<li></li>", {
                        id: iconWrapperId,
                        'class': icons.iconWrapper + hiddenClass,
                        'data-prop': id,
                        'data-icon-wrapper': onlyIcon
                    }),
                       $icon = $("<i></i>", {
                           id: finalIconId,
                           'class': css,
                           'data-prop': id,
                           'data-icon': onlyIcon,
                           title: message,
                           'data-original-title': message
                       });
                    $icon.appendTo($iconWrapper);
                    $iconWrapper.prependTo($list);
                    if (message) {
                        // if message exist
                        var bodyTooltipContainerId = this.createTooltipContainerAndGetId(plugin);
                        $icon.tooltip({
                            animated: "fade",
                            placement: "top",
                            container: "#" + bodyTooltipContainerId
                        }).data("bs.tooltip")
                          .tip()
                          .addClass(appropriateClass);
                    }
                    $elem = $iconWrapper;
                    this[elementName] = $elem;
                }
                return $elem;
            },
            createTooltipContainerAndGetId: function (plugin) {
                /// <summary>
                ///  create the tooltip container at body level for once
                ///  and then send the id.
                /// </summary>
                /// <returns type=""></returns>
                var id = "jq-combo-tooltip-container",
                    $elem = $.byId(id);
                if ($elem.length === 0) {
                    var $div = $("<div></div>", {
                        'id': id,
                        'class': plugin.getCssClasses().styleSetName + " jq-server-combo"
                    });
                    $div.appendTo($("body"));
                }
                return id;
            },
            getListId: function (plugin) {
                if (!this.listId) {
                    var ids = plugin.getIdPrefixes(),
                        id = plugin.getID(),
                        listWrapperId = ids.iconList,
                        finalId = listWrapperId + id;
                    this.listId = finalId;
                    return finalId;
                }
                return this.listId;
            },
            getOrCreateListWrapper: function (plugin, $inputWrapper) {
                var elementName = "$iconsListWrapper",
                    $elem = this[elementName];
                //objectType = "icon";
                if (!$elem) {
                    var settings = plugin.getSettings(),
                         css = settings.icons.iconList,
                         finalId = this.getListId(plugin),
                         //additionalCss = ids.iconWrapper + "positioning",
                         $wrapper = $("<ul></ul>", {
                             id: finalId,
                             'class': css
                         });
                    //plugin.render._wrapper($inputWrapper, objectType, $wrapper, 2, additionalCss);
                    $wrapper.appendTo($inputWrapper);

                    this[elementName] = $wrapper;
                    $elem = $wrapper;
                }
                return $elem;
            }
        },
        inputWrapper: function (plugin, $implement) {
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
            var elementName = "$inputWrapper",
                wraperType = "input";
            if (!this[elementName]) {
                this._wrapper($implement, wraperType); //level 2
                var $wrapper = this.getWrapper(wraperType, 2);
                this[elementName] = $wrapper;
            }
            return this[elementName];
        },
        input: function (plugin, $div, $implement) {
            /// <summary>
            /// Get input from cache or else create it and then return.
            /// also sets plugin.$input = returned input 
            /// </summary>
            /// <param name="plugin"></param>
            /// <param name="$div"></param>
            /// <param name="$implement"></param>
            /// <returns type=""></returns>
            var cssClass = plugin.getCssClasses(),
                settings = plugin.getSettings(),
                ids = plugin.getIdPrefixes(),
                id = plugin.getID(),
                finalId = ids.input + id,
                events = plugin.getEvents(),
                css = cssClass.input + " " + settings.additionalCSS,
                $elem = null;

            var elementName = "$input";

            $elem = this[elementName];

            if (!$elem) {
                // if empty then create
                var placeHolder = "", placeHolderValue = "", isPlaceHolder = false;
                if (settings.placeHolderDisable === false) {
                    placeHolder = settings.placeHolder;
                    placeHolderValue = settings.placeHolderValue;
                    isPlaceHolder = true;
                }
                var $inputHtml = $("<input/>", {
                    id: finalId,
                    'class': css,
                    type: "text",
                    placeholder: placeHolder,
                    'data-placeholder-val': placeHolderValue,
                    'data-is-placeholder': isPlaceHolder
                });
                // create input wrapper and caret wrapper and caret
                // using the _wrapper function
                // by default it returns the top wrapper with level 2.
                var $inputWrapper = this.inputWrapper(plugin, $implement);
                $inputHtml.prependTo($inputWrapper);
                $elem = $inputHtml;
                if (plugin.isDebugging) {
                    console.log($elem);
                }
                this[elementName] = $elem;
                events.inputCreated(plugin, $div, $implement, $elem);
                //plugin[elementName] = this[elementName];
            }
            return this[elementName];
        },
        clearList: function () {
            /// <summary>
            /// Clear the $list (unordered list by the given data) items
            /// </summary>
            /// <param name="plugin"></param>
            /// <returns type=""></returns>
            var $list = this.$list;
            $list.empty();
        },
        getList: function () {
            return this.$list;
        },
        getWrapper: function (type, level) {
            /// <summary>
            /// Returns a wrapper if exist by that type and level.
            /// </summary>
            /// <param name="type"></param>
            /// <param name="level"></param>
            /// <returns type=""></returns>
            var plugin = this.plugin,
               ids = plugin.getIdPrefixes(),
               id = plugin.getID(),
               typeObject = type + "-"; // "input-"
            var wrapperIds = new Array(5);

            wrapperIds[1] = ids.wrapper1 + typeObject + id;
            wrapperIds[2] = ids.wrapper2 + typeObject + id;
            wrapperIds[3] = ids.wrapper3 + typeObject + id;
            wrapperIds[4] = ids.wrapper4 + typeObject + id;

            return $.byId(wrapperIds[level]);
        },
        // Create wrapper and inject into implement.
        _wrapper: function ($appendingObject, objectTypeName, $wrappingObject, level, additionalCssClass) {
            /// <summary>
            /// Creates and returns the final wrapper object.
            /// Wrap the onject with wrapper and inject into the implement.
            /// </summary>
            /// <param name="$appendingObject">Object where everything will be added to , not necessarily $appendingObject</param>
            /// <param name="objectTypeName"></param>
            /// <param name="$wrappingObject"></param>
            /// <param name="level">By default level: 2</param>
            /// <returns type=""></returns>
            var plugin = this.plugin,
                cssClass = plugin.getCssClasses(),
                ids = plugin.getIdPrefixes(),
                id = plugin.getID(),
                typeObject = objectTypeName + "-"; // "input-"
            var wrapper1 = ids.wrapper1 + typeObject + id,
                wrapper2 = ids.wrapper2 + typeObject + id,
                wrapper3 = ids.wrapper3 + typeObject + id,
                wrapper4 = ids.wrapper4 + typeObject + id;

            if (plugin.isEmpty(level)) {
                level = 2;
            }


            if (!additionalCssClass) {
                additionalCssClass = "";
            } else {
                additionalCssClass = " " + additionalCssClass;
            }

            var $divWrapper1 = $("<div></div>", {
                id: wrapper1,
                'class': cssClass.wrapper1 + additionalCssClass
            }),
                $divWrapper2 = $("<div></div>", {
                    id: wrapper2,
                    'class': cssClass.wrapper2
                }),
                $divWrapper3 = $("<div></div>", {
                    id: wrapper3,
                    'class': cssClass.wrapper3
                }),
                $divWrapper4 = $("<div></div>", {
                    id: wrapper4,
                    'class': cssClass.wrapper4
                });


            if (level === 4) {
                if ($wrappingObject) {
                    $wrappingObject.appendTo($divWrapper4);
                }
                $divWrapper4.appendTo($divWrapper3);
                $divWrapper3.appendTo($divWrapper2);
                $divWrapper2.appendTo($divWrapper1);
                $divWrapper1.appendTo($appendingObject);
            } else if (level === 3) {
                if ($wrappingObject) {
                    $wrappingObject.appendTo($divWrapper3);
                }
                $divWrapper3.appendTo($divWrapper2);
                $divWrapper2.appendTo($divWrapper1);
                $divWrapper1.appendTo($appendingObject);
            } else if (level === 2) {
                if ($wrappingObject) {
                    $wrappingObject.appendTo($divWrapper2);
                }
                $divWrapper2.appendTo($divWrapper1);
                $divWrapper1.appendTo($appendingObject);
            } else if (level === 1) {
                if ($wrappingObject) {
                    $wrappingObject.appendTo($divWrapper1);
                }
                $divWrapper1.appendTo($appendingObject);
            }
            return $divWrapper1;
        },
        list: function (plugin, $div, $implement) {
            /// <summary>
            /// Renders and gets the $list (unordered list by the given data)
            /// Calls from retriveData json's get method.
            /// </summary>
            /// <returns type="">$input box</returns>
            var cssClass = plugin.getCssClasses(),
                ids = plugin.getIdPrefixes(),
                id = plugin.getID(),
                finalId = ids.list + id,
                events = plugin.getEvents(),
                wrapperClass = cssClass.listDisplayWrapper,
                typeObject = "list";

            var elementName = "$list",
                $elem = this[elementName];

            if (plugin.isEmpty($elem)) {
                // if empty then create
                var $listHtml = $("<ul></ul>", {
                    id: finalId,
                    'class': cssClass.list + " " // hide
                });
                // creates the wrapper and injects into the $implement.
                this._wrapper($implement, typeObject, $listHtml, 3, wrapperClass);

                this[elementName] = $.byId(finalId);
                $elem = this[elementName];

                if (plugin.isDebugging) {
                    console.log($elem);
                }
                events.listCreated(plugin, $div, $implement, $elem);
                //plugin[elementName] = $elem;
            }

            // clear the list

            // process data

            return $elem;
        },
        listItems: function (plugin, data) {
            /// <summary>
            /// Renders the list items under $list(underscored list)
            /// clears the list if no data exist.
            /// Binds list items with triggerableEvents
            /// </summary>
            /// <param name="$list">$list(underscored list)</param>
            /// <param name="data">json data</param>
            /// <returns type="">none</returns>
            this.clearList();
            if (plugin.isEmpty(data)) {
                return;
            }
            var cssClass = plugin.getCssClasses(),
                settings = plugin.getSettings(),
                events = plugin.getEvents(),
                render = this,
                triEvents = plugin.triggerableEvents,
                len = data.length,
                inputId = plugin.getID(),
                idField = settings.valueField,
                displayField = settings.displayField,
                arrayList = new Array(len + 5),
                itemCss = cssClass.listItem,
                isClassExist = !plugin.isEmpty(itemCss),
                //$inputWrapper = plugin.render.$inputWrapper,
                //$input = plugin.render.$input,
                $list = this.getList();

            // direct calling function.
            console.log("Async Loop started : " + len);
            var callback = function () {
                var ulContents = arrayList.join("");
                $list.html(ulContents);

                var $listItems = $list.find("li");
                $listItems.on("click", function (evt) {
                    var t0 = performance.now();
                    //(plugin, $list, $listOfItems, $item, settings, $inputWrapper, $input, evnt)
                    triEvents.listItemClicked($(this), evt);
                    var t1 = performance.now();
                    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
                });
                render.$listOfItems = $listItems;
                console.log("Complete rendering.");
            };

            setTimeout(function () {
                for (var i = 0; i < len; i++) {
                    console.log("loop : " + i);
                    var row = data[i],
                        id = row[idField],
                        display = row[displayField],
                        arrayIndex = i + 1,
                        htmlId = "id='" + inputId + "-" + id + "'";
                    if (isClassExist === true) {
                        arrayList[arrayIndex] = "<li " + htmlId + " class='" + itemCss + "' data-id='" + id + "'>" + display + "</li>";
                    } else {
                        // no class
                        arrayList[arrayIndex] = "<li " + htmlId + " data-id='" + id + "'>" + display + "</li>";
                    }
                }
                callback();
            }, 0);

        }
    }
})(jQuery, window, document);
