define(["app", "js/index/indexView"], function (app, View) {

    var $ = jQuery;
    var $$ = Dom7;
    var user = {};

    /**
     * Bindings array. Bind DOM event to some handler function in controller
     * @type {*[]}
     */
    var bindings = [
        {
            element: '#btnFbSignin',
            event: 'click',
            handler: fbAuthentication
        }, {
            element: '#btnPhoneSignIn',
            event: 'click',
            handler: phoneAuth
        }, {
            element: '#btnForgotPassword',
            event: 'click',
            handler: openForgotPassword
        }, {
            element: '#btnSignup',
            event: 'click',
            handler: loadSignupPopup
        }, {
            element: '#btnCancelSignUp',
            event: 'click',
            handler: closeSignUpModal
        }, {
            element: '#btnCancelForgotPassword',
            event: 'click',
            handler: closeForgotPassword
        }, {
            element: '#btnResetPassword',
            event: 'click',
            handler: resetPassword
        }, {
            element: '#btnCreateAccount',
            event: 'click',
            handler: createAccount
        }, {
            element: '#btnMoreLogOff',
            event: 'click',
            handler: logout
        }, {
            element: '#linkHome',
            event: 'click',
            handler: loadHome
        }, {
            element: '#inviteOthers',
            event: 'click',
            handler: inviteOthers
        }
    ];

    function init() {
        didTutorial();
        pageResets();

        View.render({
            bindings: bindings
        });
    }

    function inviteOthers() {
        var options = {
            message: life_lighter_mesg.invite_others, // not supported on some apps (Facebook, Instagram)
            subject: 'Life Lighter', // fi. for email
            url: 'https://www.lifelighter.org',
            chooserTitle: 'Share with' // Android only, you can override the default share sheet title
        }

        var onSuccess = function (result) {
         /*   console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)

            app.f7.alert("Shared to app: " + result.app);
            app.f7.alert("Share completed? " + result.completed);*/
        }

        var onError = function (msg) {
            console.log("Sharing failed with message: " + msg);
            app.f7.alert("Sharing failed with message: " + msg);
        }

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }

    function loadSignupPopup() {
        //app.f7.closeModal('.popup-login');

        $$('.popup-signup').on('popup:opened', function () {
        });

        app.f7.popup('.popup-signup');
    }

    function loadHome() {
        app.f7.closePanel(true);
        app.mainView.router.loadPage("index.html");
    }

    function pageResets() {

    }

    function createAccount() {
        var validationFields = [
            $('#first_name'),
            $('#last_name'),
            $('#account_mobile'),
            $('#account_password'),
            $('#confirm_password')
        ];
        var validFields = $(this).fieldsValid(validationFields, app, '');
        if (validFields) {
            if ($('#account_password').val() === $('#confirm_password').val()) {
                if ($('#account_password').val().length < 6) {
                    app.f7.alert('Password is too short, enter at least 6 characters for security reasons');
                } else {
                    user = {
                        name: $('#first_name').val() + ' ' + $('#last_name').val(),
                        phone: $('#account_mobile').val(),
                        email: $('#account_email').val(),
                        password: $('#account_password').val(),
                        auth_side: 'Direct'
                    };
                    app.f7.showPreloader('Creating your account');
                    $.ajax({
                        url: life_lighter_config.apibaseurl + "register",
                        data: user,
                        method: 'POST'
                    }).success(function (data) {
                        console.log(data);
                        if (data.success == 0) {
                            app.f7.alert(data.message);
                        } else {
                            app.f7.closeModal('.popup-login');
                            closeForgotPassword();
                            closeSignUpModal();
                            console.log(data.user);
                            saveUser(data.user);
                        }
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
    }

    function closeSignUpModal() {
        app.f7.closeModal('.popup-signup');
    }

    function closeForgotPassword() {
        app.f7.closeModal('.popup-forgot-password');
        app.f7.closeModal('.popup-login');
    }

    function openForgotPassword() {
        app.f7.popup('.popup-forgot-password');
    }

    function resetPassword() {
     app.f7.closeModal('.popup-login');
        var validationFields = [
            $('#reset_mobile')
        ];
        var validFields = $.fn.fieldsValid(validationFields, app);
        if (validFields) {
            app.f7.showPreloader('Resetting password');
            $.ajax({
                url: life_lighter_config.apibaseurl + 'forgot_password',
                method: 'POST',
                data: {
                    phone: $('#reset_mobile').val()
                }
            }).error(function (e) {
                app.f7.alert(life_lighter_mesg.servererror);
            }).success(function (data) {
                if (data.success == 0) {
                    app.f7.alert(data.message);
                } else {
                    app.f7.closeModal('.popup-forgot-password');
                    app.f7.alert(data.message);
                }
            }).always(function () {
                app.f7.hidePreloader();
            });
        }
    }

    function phoneAuth() {
        var VF = [
            $('#phone'),
            $('#password')
        ];
        if ($.fn.fieldsValid(VF, app)) {
            console.log('valid fields')
            app.f7.showPreloader('Logging you in now');
            $.ajax({
                url: life_lighter_config.apibaseurl + 'login',
                method: 'POST',
                data: {
                    phone: $('#phone').val(),
                    password: $('#password').val()
                }
            }).error(function (error) {
                app.f7.alert(life_lighter_mesg.servererror);
                console.log(error);
            }).success(function (data) {
                console.log(data);
                if (data.success == 0) {
                    app.f7.alert(data.message);
                } else {
                    app.f7.closeModal('.popup-login');
                    closeForgotPassword();
                    closeSignUpModal();
                    console.log(data.user);
                    saveUser(data.user);
                }
            }).always(function () {
                app.f7.hidePreloader();
            });
        }
    }

    function fbAuthentication() {
        app.f7.showPreloader('Logging in using Facebook');
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                getFacebookProfile(response.authResponse.accessToken);
            } else {
                FB.login(function (response) {
                    // this is a new token from a new login
                    if (response.authResponse) {
                        getFacebookProfile(response.authResponse.accessToken);
                    } else {
                        // user did not authorize or something went wrong
                        app.f7.hidePreloader();
                        app.f7.alert("Unable to login with FB, please try again");
                        return;
                    }
                }, {scope: 'email, publish_actions'}); // publish_actions for the Graph API when not using FB.ui
                /* }, {scope: 'public_profile, email, publish_actions, user_friends'}); */
            }
        });
    }

    function didTutorial() {
        databaseHandler.createDatabase(database.name, database.version, database.displayName);
        var did = $.fn.hasCookie(cookies.did_tutorial);
        if (did) {
            checkSignIn();
        } else {
            prepareTutorial();
        }
    }

    function checkSignIn() {
        var authenticated = $.fn.hasCookie(cookies.authenticated);
        if (authenticated && $.fn.hasCookie(cookies.user)) {
            preparePage();
        } else {
            app.f7.keypad({
                input: '#phone',
                valueMaxLength: 12,
                dotButton: false
            });
            app.f7.keypad({
                input: '#account_mobile',
                valueMaxLength: 12,
                dotButton: false
            });
            app.f7.keypad({
                input: '#reset_mobile',
                valueMaxLength: 12,
                dotButton: false
            });
            initFacebook();
            app.f7.popup('.popup-login');
        }
    }

    function preparePage() {
        if ($.fn.hasCookie(cookies.user)) {
            user = JSON.parse(Cookies.get(cookies.user));
            console.log(user.name);
            View.fillName(user.name);

            //load life ligthers from memory
            databaseHandler.getLifeLighters(populateLighters);
        } else {
            console.log('no cookie');
        }
    }

    function populateLighters(rows) {
        if (rows.length == 0) {
            View.showEmpty();
        } else {
            View.fillLighters(rows);
            $('*#readButton').on('click', function () {
                var lighter_id = $(this).attr('lighter_id');
                var lighter_name = $(this).attr('lighter_name');
                app.mainView.router.loadPage('pages/lighter.html?id=' + lighter_id + '&name=' + lighter_name);
            });
        }
    }

    function saveUser(user) {
        Cookies.set(cookies.authenticated, true);
        Cookies.set(cookies.user, user);
        Cookies.set(cookies.has_number, true);
        app.f7.alert('Hello ' + user.name + ', welcome !!!');
        preparePage();
    }

    function prepareTutorial() {
        var welcomescreen_slides = [
            {
                id: 'slide0',
                title: '', // optional
                picture: '<div class="tutorialicon" style="display: block; margin: 0 auto; padding: 7px;"><img src="img/logo.png" class="img-responsive" style="width: 100%; margin: 5px;"/> </div>',
                text: 'Unlocking Your Abundant Life'
            },
            {
                id: 'slide1',
                title: '<b>Authors :<a href="#" class="button">PROPHET EMMANUEL MAKANDIWA</a><a href="#" class="button">PROPHETESS RUTH MAKANDIWA</a>', // optional
                picture: '<div class="tutorialicon"><img src="img/pnm.png" class="img-responsive" style="width: 100%; margin: 5px;"></div>',
                text: ''
            },
            {
                id: 'slide2',
                title: '<a href="#" ><h1>UFIC</h1></a>', // optional
                picture: '<div class="tutorialicon"><h5 class="button">VISION</h5>' +
                '<p><small>Building a God Society of all People of all Nations</small></p>' +
                '<h5 class="button" ">MISSION</h5>' +
                '<p><small>To unite the body of Jesus Christ: that is the Church, through reaching out to the lost, poor, less priviledged members of the society, widows, orphans and the broken hearted, ultimately impacting revelation knowledge of Jesus Christ and fellowship with God The Father, God The Son and God The Holy Spirit</small></p>' +
                '<h5 class="button">VALUES</h5>' +
                '<p><small>Selflessness<br/>Charity<br/>Team Work<br/>Integrity<br/>Commitment<br/>Transparency</small></p></div>',
                text: ''
            },
            {
                id: 'slide3',
                title: '<h2>A PRODUCT OF</h2>',
                picture: '<div class="tutorialicon"><img src="img/icon.png" class="img-responsive" style="width: 100%; margin: 5px;"></div>',
                text: '<a id="tutorial-close-btn" class="button button-medium active" href="#">Continue</a>'
            }
        ];
        var options = {
            'bgcolor': '#57112A',
            'fontcolor': '#fff',
            'closeButton': false
        };
        var welcomescreen = app.f7.welcomescreen(welcomescreen_slides, options);
        welcomescreen.open();

        $(document).on('click', '#tutorial-close-btn', function () {
            $('.welcomescreen-container').hide(100, function () {
                console.log('screen closed');
                Cookies.set(cookies.did_tutorial, true);
                checkSignIn();
            });
        });
    }

    function logout() {
        Cookies.remove(cookies.user);
        Cookies.remove(cookies.authenticated);
        initFacebook();
        app.f7.popup('.popup-login');
    }

    // FB for external oauth ==========================================================>
    var initFacebook = function () {
        window.fbAsyncInit = function () {
            FB.init({
                appId: life_lighter_config.facebook_appid,
                xfbml: false, // don't parse DOM for social media stuff
                version: 'v2.8'
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

    var getFacebookProfile = function (token) {

        // at this point we should be logged in
        try {
            var user = {};

            FB.api('/me', {
                locale: 'en_US',
                fields: 'id,first_name,last_name,email,picture'
            }, function (response) {

                user.auth_side = "Facebook";
                user.phone_id = response.id;
                user.email = response.email;
                user.thumbnail_url = response.picture.data.url;
                user.name = response.first_name + " " + response.last_name;

                Cookies.set(cookies.authenticated, true);
                Cookies.set(cookies.user, user);

                FB.api('/me?fields=picture.width(256)', function (response2) {

                    /*   $.ajax({
                           url: r8emconfig.apibaseurl + "api/users/externallogin",
                           method: "POST",
                           data: user,
                dataType: 'jsonp'
                           statusCode: {
                               200: function (response) {
                                   if (response.token !== undefined) {
                                       app.f7.hidePreloader();
                                       app.f7.closeModal('.popup-login');
                                //       loadMoreFlyoutData();
                                   }
                               },
                               400: function (xhr) {
                                   app.f7.alert($.parseJSON(xhr.responseText).errors[0].message);
                               },
                               401: function (xhr) {
                                   app.f7.alert("Incorrect email or password");
                               },
                               500: function (xhr) {
                                   app.f7.alert(life_lighter_mesg.servererror);
                               }
                           }
                       }).error(function (data) {
                           app.f7.alert(life_lighter_mesg.servererror);
                       });*/
                });
            });
        } catch (e) {
            app.f7.alert("Unable to login with FB, please try again");
        }
    };

    return {
        init: init
    };
});
