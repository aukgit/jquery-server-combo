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
var combineAttribute = function ($elem, attr, hostUrl) {
    var currentUrl = $elem.attr(attr);
    var combine = hostUrl + currentUrl;
    $elem.attr(attr, combine);
}
$.genericPage = function () {
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
    var $processForm = $.byId("process-form"),
        $select2 = $.byId("ProductID"),

        $jQComboBody = $.byId("jq-combo-body"),
        hostUrl = $.byId("host-url").val(), //  "//localhost:43236/"
        $select2Body = $.byId("select2-body");
    if ($jQComboBody.length > 0) {
        var $implement = $processForm.find(".jq-server-combo-implement");
        combineAttribute($implement, "data-url", hostUrl);
        combineAttribute($implement, "data-next-page-url", hostUrl);
        $processForm.serverComboBox();
    } else if ($select2Body.length === 1) {
        var url = hostUrl + "odata/Products1";
        var isInTestingMode = true;
        jQuery.ajax({
            method: "GET", // by default "GET"
            url: url,
            dataType: "JSON" //, // "Text" , "HTML", "xml", "script" 
        }).done(function (response) {
            if (isInTestingMode) {
                console.log(response);
            }
            var data = response["value"],
                len = data.length,
                idField = "ProductID",
                displayField = "ProductName",
                inputId = "ProductID",
                arrayList = new Array(len + 5);
            for (var i = 0; i < len; i++) {
                var row = data[i],
                    id = row[idField],
                    display = row[displayField],
                    arrayIndex = i + 1,
                    htmlId = "id='" + inputId + "-" + id + "'";
                arrayList[arrayIndex] = "<option " + htmlId + " value='" + id + "'>" + display + "</option>";
            }
            var ulContents = arrayList.join("");
            $select2.html(ulContents);
            $select2.select2();
        }).fail(function (jqXHR, textStatus, exceptionMessage) {
            console.log("Request failed: " + exceptionMessage);
        }).always(function () {
            console.log("complete");
        });

    }

}


$(function () {

    $.genericPage();
});
