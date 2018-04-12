/**
 * Created by Flash on 11/8/2017.
 */
$(document).ready(function () {

    $.fn.hasCookie = function (cookie_name) {
        if (Cookies.get(cookie_name) === undefined) {
            return false;
        } else {
            return true;
        }
    };

    $.fn.getCompiledTemplate = function (url, jsonData, container, callback) {
        $.get(url, function (source) {
            var template = Handlebars.compile(source);
            $(container).html(template(jsonData));
        })
            .done(callback)
            .fail(function () {
                    $.fn.setAlert("danger", container, his_word_mesg.loadfailed);
                }
                , 'html');
    };

    $.fn.getCompiledTemplateAndAppend = function (url, jsonData, container, callback) {
        $.get(url, function (source) {
            var template = Handlebars.compile(source);
            $(container).append(template(jsonData));
        })
            .done(callback)
            .fail(function () {
                    $.fn.setAlert("danger", container, his_word_mesg.loadfailed);
                }
                , 'html');
    };

    $.fn.getCompiledTemplateOnly = function (url) {
        $.get(url, function (source) {
            return Handlebars.compile(source);
            //$(container).html(template(jsonData));
        });
    };

    $.fn.setAlert = function (type, container, mesg) {
        // warning, info, success, danger
        container.html("<div class='alert alert-" + type + "'>" + mesg + "</div>");
    };

    $.fn.fieldsValid = function (validate_user_fields, app, type) {
        $string = new Array();
        $error_msg = '';
        var y = 0;
        for ($x = 0; $x < validate_user_fields.length; $x++) {
            if (validate_user_fields[$x].val().length == 0) {
                $string.push(validate_user_fields[$x]);
                $error_msg += validate_user_fields[$x].attr('placeholder') + " can`t be blank<br/>";
            }
        }
        if ($string.length == 0) {
            return true;
        } else {
            if (type === undefined) {
                app.f7.addNotification({
                    title: 'Life Lighter',
                    message: $error_msg
                });
            } else {
                app.f7.alert($error_msg);
            }
            return false;
        }
    };

    $.fn.getPic = function () {
        var parents_pics = [
            "img/bnm2.jpg",
            "img/p1.jpg",
            "img/p2.jpg",
            "img/p3.jpg",
            "img/p4.jpg",
            "img/p5.jpg",
            "img/p6.jpg",
            "img/m1.jpg",
            "img/prophet2.jpg",
            "img/m2.jpg",
            "img/m3.jpg",
            "img/m4.jpg",
            "img/m5.jpg"
        ];

        return parents_pics[Math.floor(Math.random() * (parents_pics.length + 1))];
    };
});
