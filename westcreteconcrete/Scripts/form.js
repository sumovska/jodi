/** On document ready */
$(document).ready(function () {
    $('.form-contact').on('submit', function () {
        var form = $(this);
        if ($(this).validate()) {
            var formData = {
                'name': $('[name=name]').val(),
                'phone': $('[name=phone]').val(),
                'email': $('[name=email]').val(),
                'subject': $('[name=subject]').val(),
                'message': $('[name=message]').val()
            };

            form.addClass('form-contact-sending');

            // process the form
            $.ajax({
                type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url: $(this).attr('action'), // the url where we want to POST
                data: formData, // our data object
                dataType: 'json', // what type of data do we expect back from the server
                encode: true
            }).always(function (data) {
                form.addClass('form-contact-sent');
            });
        }
        return false;
    });
});

/**
 *    Validate form plugin
 *    @returns true or false
 */

(function ($) {

    /** Errors array */
    var errors = {
        blank: 'Enter required fields', // This field can't be blank
        captcha: 'Please check the Captcha'
    };

    $.fn.validate = function () {
        var _this = $(this), valid = true;

        /** Adding error */
        $.fn.addError = function () {
            var current = $(this);
            current.addClass('error');
        };


        /** Show message error */
        $.fn.showMessage = function (text) {
            _this.find('.form-error').remove();
            $('<span class="form-error"/>').html(text).appendTo(_this);
        };

        /** Removing error */
        $.fn.removeError = function () {
            var current = $(this);
            current.removeClass('error');
            _this.find('.form-error').remove();
        };

        /** Required validation */
        $(':input.required:not(:disabled)', _this).each(function () {
            var current = $(this);
            if (current.val().trim().length < 1) {
                current.addError();
                valid = false;
            } else {
                current.removeError();
            }
        });
        if (!valid) {
            _this.showMessage(errors.blank);
        }

        if (valid) {
            if (grecaptcha.getResponse().length == 0) {
                valid = false;
            }
            if (!valid) {
                _this.showMessage(errors.captcha);
            }
        }

        /** Focusing on errorous field */
        $(':input.error').eq(0).focus();

        return valid;
    };
}(jQuery));