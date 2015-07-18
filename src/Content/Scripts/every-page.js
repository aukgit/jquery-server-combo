/// <reference path="bootstrap-datetimepicker.js" />
/// <reference path="bootstrap.js" />
/// <reference path="every-page.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/// <reference path="jquery-2.1.4.js" />
/// <reference path="jquery.unobtrusive-ajax.min.js" />
/// <reference path="jquery.server-combo.js" />
/// <reference path="jquery.validate.min.js" />
/// <reference path="moment.js" />
/// <reference path="byId.js" />
/*!
 * Written by Alim Ul Karim
 * http://alimkarim.com
 * me{at}alimkarim.com
*/

$.genericPage = function() {
    function transactionStatusHide() {
        var $transactionStatus = $(".transaction-status");
        if ($transactionStatus.length > 0) {
            $transactionStatus.delay(1500).fadeOut(2500);
        }
    }
    var $tooltipItems = $('.tooltip-show');
    if ($tooltipItems.length > 0) {
        $tooltipItems.tooltip();
    }
    var $seoHideItems = $(".seo-hide");
    if ($seoHideItems.length > 0) {
        $seoHideItems.hide();
    }
    transactionStatusHide();

    $("div.datetimepicker-start").datetimepicker({
        pickDate: true, //en/disables the date picker
        pickTime: true, //en/disables the time picker
        useMinutes: true, //en/disables the minutes picker
        useSeconds: true, //en/disables the seconds picker
        useCurrent: true, //when true, picker will set the value to the current date/time     
        minuteStepping: 1, //set the minute stepping
        defaultDate: "", //sets a default date, accepts js dates, strings and moment objects
        disabledDates: [], //an array of dates that cannot be selected
        enabledDates: [], //an array of dates that can be selected
        sideBySide: true //show the date and time picker side by side

    });

    $("div.datepicker-start").datetimepicker({
        pickDate: true, //en/disables the date picker
        pickTime: false, //en/disables the time picker
        useMinutes: false, //en/disables the minutes picker
        useSeconds: false, //en/disables the seconds picker
        useCurrent: true, //when true, picker will set the value to the current date/time     
        minuteStepping: 1, //set the minute stepping
        defaultDate: "", //sets a default date, accepts js dates, strings and moment objects
        disabledDates: [], //an array of dates that cannot be selected
        enabledDates: [], //an array of dates that can be selected

        sideBySide: true //show the date and time picker side by side

    });

    // start processing here for this plugin.
    var $urlInput = $.byId("get-url");
    var $processForm = $.byId("process-form");

    var $inputs = $processForm.find("input");
    $inputs.attr('data-url', $urlInput.val());
    var $formRows = $processForm.find(".form-row");

    $formRows.attr("data-is-validate", "true");
    $processForm.serverValidate();

    var $jQComboBody = $.byId("jq-combo-body"),
        $select2Body = $.byId("select2-body");
    if ($jQComboBody.length > 0) {
        $processForm.serverComboBox();
    } else if ($select2Body.length === 1) {
        var url = "//localhost:43236/odata/Products1";
        var jsonData = { data: "value" };
        var isInTestingMode = true;
        jQuery.ajax({
            method: "POST", // by default "GET"
            url: url,
            data: jsonData, // PlainObject or String or Array
            dataType: "JSON" //, // "Text" , "HTML", "xml", "script" 
            //processData: true, // false , By default, data passed in to the data option as an object (technically, anything other than a string) will be processed and transformed into a query string, fitting to the default content-type "application/x-www-form-urlencoded". If you want to send a DOMDocument, or other non-processed data, set this option to false.
            //cache:true | false //by default true
            //contents : undefined, // An object of string/regular-expression pairs that determine how jQuery will parse the response, given its content type
            //crossDomain: false ,  by default false
            //async: true | false , // by default true,
            //beforeSend: function( xhr ) {
            //  xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
            //}
        }).done(function (response) {
            if (isInTestingMode) {
                console.log(response);
            }
        }).fail(function (jqXHR, textStatus, exceptionMessage) {
            console.log("Request failed: " + exceptionMessage);
        }).always(function () {
            console.log("complete");
        });
        $("#ProductID").select2({
            
        });
    }
  
}


$(function () {

    $.genericPage();
});
