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
            valueSelect: "",
            selectsFistOneByDefault: true,
            url: "",
            delay: 250,
            nextPageUrl: "?Page=@pageNumber",
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
                input: "jq-input",
                inputHover: "jq-combo-hover",
                comboHidden: "jq-combo-hidden",
                combo: "jq-combo",
                comboOpen: "jq-combo-open",
                comboHover: "jq-combo-hover",
                styleSetName: "default",
                listItem: "jq-list-item"
            },
            iconsIdPrefixes: {
                invalid: "invalid-mark-",
                valid: "valid-mark-",
                spinner: "validation-spinner-",
                error: "validation-error-"
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