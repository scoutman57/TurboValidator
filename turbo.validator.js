/**
* TurboValidator 1.0 by Tierlabs
* Created by: Brian Seymour
* 
* License: GNU General Public License Version 2.0
* 
* Mandatory Dependencies:
* - jQuery
* 
* Recommended Dependencies:
* - Bootstrap
* 
* The purpose of this validator is to allow high speed server side
* validation with a low maintenance foot print and an intuitive interface.
* 
* TurboValidator design goals:
* - AJAX Enabled
* - Clean Validation Errors
* - Minimum Code Absolutely Necessary/Required (MCAN/R)
*/

(function (window) {

    window.TurboValidator = {
        // this method will bind the enter key to the form and a mouse click to the save button
        bind: function (button_id, form_id, url) {
            // start listening to key presses
            $('#' + form_id).keypress(function (event) {
                // if enter key is pressed, simulate a click to the save button
                if (event.which === 13) {
                    // click the save button
                    $('#' + button_id).click();
                }
            });

            // start listening for a save button click
            $('#' + button_id).click(function () {
                // send the form to the server
                TurboValidator.send(button_id, form_id, url);
            });
        },

        // this is the main method that will send the form to the server
        send: function (button_id, form_id, url, extra_data) {
            // the form needs to be a relative element so the errors position correctly
            $('#' + form_id).css('position', 'relative');

            // remove any existing errors and the success message, if applicable
            $('#' + form_id + ' > .tv-error').remove();
            $('#' + form_id + ' > .tv-success').remove();
            $('#' + form_id + ' > .tv-error-overlay').remove();

            // show a loading icon while the server works
            $('#' + form_id + ' > .turbo-validate').after(' <img class=\'tv-load\' src=\'http://cdn.tierlabs.com/global/icons/loading.gif\'/>');

            // check whether the user sent extra custom data with a custom script
            if (extra_data === undefined) {
                // no extra data was sent, make a blank array
                data = {};
            } else {
                // extra data was sent, baseline the array with the data
                data = extra_data;
            }

            // add text inputs, selects, and textareas to the array of data being transported to the server
            $(
                'form#' + form_id + ' :input[type=text],' +
                'form#' + form_id + ' select,' +
                'form#' + form_id + ' textarea'
            ).each(function () {
                // add the id of the field as a key and the value of the field as the value
                data[$(this).attr('id')] = $(this).val();
            });

            // add unchecked checkboxes to the array of data being transported to the server
            $(
                'form#' + form_id + ' :input[type=checkbox]'
            ).each(function () {
                // add the id of the checkbox as a key and 0 as the value
                data[$(this).attr('id')] = 0;
            });

            // add checked checkboxes to the array of data being transported to the server
            $(
                'form#' + form_id + ' :input[type=checkbox]:checked'
            ).each(function () {
                // add the id of the checkbox as a key and 1 as the value
                data[$(this).attr('id')] = 1;
            });

            // send a post of the data to the url specified
            $.post(url, data, function (json) {
                // check whether a Success element is present
                if (json.Success) {
                    // no errors, display success message
                    $('#' + form_id + ' > #' + button_id).after(' <span style=\'color: #00cc00;\' class=\'tv-success\'>' + json.Success + '</span>');
                } else {
                    // create a variable of user error messages
                    var messages = json.Messages;
                    
                    // loop through each error
                    $.each(json.Errors, function (key, value) {
                        // zero out the actual full error message
                        var final_error_value = '';
                        
                        // get offsets and heights to know where the error message should go
                        var offset = $('#' + form_id + ' > #' + key).position();
                        var height = $('#' + form_id + ' > #' + key).height();
                        
                        // slight adjustment
                        offset.top = (offset.top + height) + 5;
                        
                        // errors show up command separate. unseparate them
                        errors = value.split(",");
                        
                        // check whether it's a checked value, if so, it gets a different offset
                        if (value === 'checked') {
                            var noninput = true;
                            offset.top = offset.top - 21;
                        }
                        
                        // loop through each individual error for the field
                        $.each(errors, function (key, value) {
                            // string the errors together
                            final_error_value += messages[value] + ', ';
                        });
                        
                        // set the final error value
                        final_error_value = final_error_value.substring(0, final_error_value.length - 2);
                        
                        // check if it's a checked value or not
                        if (!noninput) {
                            // checked value
                            $('#' + form_id).append('<div class=\'tv-error-overlay\' style=\'border-radius: 2px; padding: 0px 4px; position: absolute; left: ' + offset.left + 'px; top: ' + offset.top + 'px; font-size: 12px; background: #ff0000; color: #ffffff; height: 12px; line-height: 12px; font-weight: bold; overflow: hidden;\'>' + final_error_value + '</div>');
                        } else {
                            // unchecked value
                            $('#' + form_id).append('<div class=\'tv-error-overlay\' style=\'border-radius: 2px; padding: 0px 4px; position: absolute; right: 0px; top: ' + offset.top + 'px; font-size: 12px; background: #ff0000; color: #ffffff; height: 12px; line-height: 12px; font-weight: bold; overflow: hidden;\'>' + final_error_value + '</div>');
                        }
                    });
                    
                    // hide all errors
                    $('#' + form_id + ' > .tv-error-overlay').hide();
                    
                    // elegantly display the errors slowly
                    $('#' + form_id + ' > .tv-error-overlay').fadeIn('slow');
                }
                
                // remove the loading icon if present
                $('#' + form_id + ' > .tv-load').remove();
            }, 'json');
        }
    };
    
})(window);
