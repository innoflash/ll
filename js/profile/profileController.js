define(["app", "js/profile/profileView"], function (app, View) {
    var $ = jQuery;
    var $$ = Dom7;
    var user = {};

    var bindings = [
        {
            element: '#btnChangePassword',
            event: 'click',
            handler: changePassword
        }
    ];

    function changePassword() {
        var VF = [
            $('#current_password'),
            $('#new_password'),
            $('#confirm_new_password')
        ];

        if ($.fn.hasCookie(cookies.has_number) && Cookies.get(cookies.has_number)) {
            if ($.fn.fieldsValid(VF, app)) {
                if ($('#new_password').val() === $('#confirm_new_password').val()) {
                    if ($('#new_password').val().length < 6) {
                        app.f7.alert('Password is too short, enter at least 6 characters for security reasons');
                    } else {
                        app.f7.showPreloader('Creating your account');
                        $.ajax({
                            url: life_lighter_config.apibaseurl + "changepassword",
                            data: {
                                current_password: $("#current_password").val(),
                                new_password: $("#new_password").val(),
                                phone: user.phone
                            },
                            method: 'POST'
                        }).success(function (data) {
                            console.log(data);
                            if (data.success == 1) {
                                $('#current_password').val('');
                                $('#new_password').val('');
                                $('#confirm_new_password').val('');
                            }
                            app.f7.alert(data.message);
                        }).error(function (data) {
                            app.f7.alert(life_lighter_mesg.servererror);
                        }).always(function () {
                            app.f7.hidePreloader();
                        });
                    }
                } else {
                    app.f7.alert('Passwords did not match, please retry !!!');
                }
            }
        } else {
            app.f7.alert('Be reminded that you need to set your phone number first');
        }

    }

    function init() {
        app.f7.closePanel(true);
        loadProfile();
        View.render({
            bindings: bindings
        });
    }

    function loadProfile() {
        user = Cookies.getJSON(cookies.user);
        View.fillProfile(user);
        if ($.fn.hasCookie(cookies.has_number) && Cookies.get(cookies.has_number)) {
            $('#mobile_phone_edit').prop('disabled', true);
        } else {
            $('#user_name').prop('disabled', true);
            $('#email_edit').prop('disabled', true);
        }

        $('#btnEditDetails').on('click', function () {
            $(this).unbind();

            var VF = [
                $('#mobile_phone_edit'),
                $('#user_name_edit')
            ];

            if ($.fn.fieldsValid(VF, app)) {
                user.phone = $('#mobile_phone_edit').val();
                user.email = $('#email_edit').val();
                user.name = $('#user_name_edit').val();
                app.f7.showPreloader('Updating profile');
                $.ajax({
                    url: life_lighter_config.apibaseurl + 'updateProfile',
                    method: 'POST',
                    data: user
                }).success(function (data) {
                    console.log(data);
                    if (data.success == 1) {
                        Cookies.set(cookies.has_number, true);
                        Cookies.remove(cookies.user);
                        Cookies.set(cookies.user, data.user);
                    }
                    app.f7.alert(data.message);
                }).error(function (e) {
                    app.f7.alert(life_lighter_mesg.servererror);
                }).always(function () {
                    app.f7.hidePreloader();
                });
            }
        });
    }

    return {
        init: init
    };
});