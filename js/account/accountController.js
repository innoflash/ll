define(["app", "js/account/accountView"], function (app, View) {
    var $ = jQuery;
    var $$ = Dom7;
    var user = {};
    var u_id = 0;

    var bindings = [
        {
            element: '#buyForFriend',
            event: 'click',
            handler: openBuyForFriend
        }, {
            element: '#topupAccount',
            event: 'click',
            handler: openTopUp
        }, {
            element: '#accountHistory',
            event: 'click',
            handler: viewLog
        }, {
            element: '#btnCancelTopup',
            event: 'click',
            handler: cancelTopup
        }, {
            element: '#topupNow',
            event: 'click',
            handler: topup
        }, {
            element: '#cancelShare',
            event: 'click',
            handler: closeShare
        }, {
            element: '#btnShareFriend',
            event: 'click',
            handler: shareBalance
        }, {
            element: '#moreOptions',
            event: 'click',
            handler: moreOptions
        }, {
            element: '#syncAccount',
            event: 'click',
            handler: syncAccount
        }
    ];

    function init() {
        app.f7.closePanel(true);
        checkPhone();
        View.render({
            bindings: bindings
        });
    }

    function syncAccount() {
        app.f7.showPreloader('Checking Life Lighters');
        $.ajax({
            url: life_lighter_config.apibaseurl + 'getLighters',
            method: 'POST',
            data: {
                phone: user.phone
            }
        }).success(function (data) {
            console.log(data);
            if (data.total == 0) {
                app.f7.alert('You do not have any Life Lighters you previously bought !!!');
            } else {
                insertData(data.data);
            }
        }).error(function () {
            app.f7.alert(life_lighter_mesg.servererror);
        }).always(function () {
            app.f7.hidePreloader();
        });
    }

    function insertDates(bool, data) {
        if (bool == true) {
            data.forEach(function (date) {
                databaseHandler.addDate(date);
            });
            databaseHandler.publishLifeLighter(u_id);
        } else {
            databaseHandler.publishLifeLighter(u_id);
            console.log('this lighter is already in the device');
            //app.f7.alert('Please note that you already have this Life Lighter in your phone');
        }
    }

    function insertData(data) {
        app.f7.showPreloader('Restoring your data');
        data.forEach(function (item) {
            $.ajax({
                url: life_lighter_config.apibaseurl + 'getLighter',
                method: 'POST',
                data: {
                    lighter_id: item.id
                }
            }).success(function (data) {
                lighter = data.lighter;
                dates = data.dates.data;
                u_id = item.id;
                databaseHandler.addLifeLighter(lighter, insertDates, dates);
            });
        });
        app.f7.alert('Sync is complete, restart the app for it to appear !!!');
        app.f7.hidePreloader();
    }

    function moreOptions() {
        var buttons1 = [
            {
                text: '#Actions',
                label: true
            },
            {
                text: 'Share with friend',
                bold: true,
                onClick: function () {
                    openBuyForFriend();
                }
            },
            {
                text: 'Topup Account',
                bold: true,
                onClick: function () {
                    openTopUp();
                }
            },
            {
                text: 'Account History',
                bold: true,
                onClick: function () {
                    viewLog();
                }
            }, {
                text: 'Sync Life Lighters',
                bold: true,
                onClick: function () {
                    syncAccount()
                }
            }
        ];
        var buttons2 = [
            {
                text: 'Cancel',
                color: 'red'
            }
        ];
        var groups = [buttons1, buttons2];
        app.f7.actions(groups);
    }

    function shareBalance() {
        var VF = [
            $('#friend_amount'),
            $('#friend_phone'),
            $('#my_password')
        ];

        if ($.fn.fieldsValid(VF, app)) {
            app.f7.showPreloader('Sharing balance now');
            $.ajax({
                url: life_lighter_config.apibaseurl + 'share',
                method: 'POST',
                data: {
                    phone: user.phone,
                    password: $('#my_password').val(),
                    friend_phone: $('#friend_phone').val(),
                    amount: $('#friend_amount').val()
                }
            }).success(function (data) {
                if (data.success == 0) {

                } else {
                    closeShare();
                    $('#friend_amount').val('');
                    $('#friend_phone').val('');
                    $('#my_password').val('');
                    checkPhone();
                }
                app.f7.alert(data.message);
            }).error(function (data) {
                app.f7.alert(life_lighter_mesg.servererror);
            }).always(function () {
                app.f7.hidePreloader();
            });
        }
    }

    function closeShare() {
        app.f7.closeModal('.popup-friend');
    }

    function cancelTopup() {
        app.f7.closeModal('.popup-topup');
    }

    function topup() {
        var VF = [
            $('#topup_code')
        ];

        if ($.fn.fieldsValid(VF, app)) {
            app.f7.showPreloader('Topping up account');
            $.ajax({
                url: life_lighter_config.apibaseurl + 'topup',
                method: 'POST',
                data: {
                    code: $('#topup_code').val(),
                    phone: user.phone
                }
            }).success(function (data) {
                app.f7.alert(data.message);
                if (data.success == 1) {
                    checkPhone();
                }
            }).error(function () {
                app.f7.alert(life_lighter_mesg.servererror);
            }).always(function () {
                app.f7.hidePreloader();
                app.f7.closeModal('.popup-topup');
            });
        }
    }

    function viewLog() {
        View.showStatus('CHECKING HISTORY ...');
        loadLog(life_lighter_config.apibaseurl + 'history');
    }

    function loadLog(url) {
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                phone: user.phone
            }
        }).success(function (data) {
            if (data.current_page == 1) {
                View.fillHistory(data);
            } else {
                View.appendHistory(data);
            }
            if (data.to < data.total) {
                $('#moreLogs').show();
                $('#moreLogs').unbind();
                $('#moreLogs').on('click', function (e) {
                    loadLog(data.next_page_url);
                });
            } else {
                $('#moreLogs').hide();
            }
        }).error(function () {
            View.showStatus('failed to load history');
        }).always(function () {

        });
    }

    function openTopUp() {
        app.f7.popup('.popup-topup');
    }

    function openBuyForFriend() {
        app.f7.keypad({
            input: '#friend_phone',
            valueMaxLength: 12,
            dotButton: false
        });
        app.f7.keypad({
            input: '#friend_amount',
            dotButton: true
        });
        app.f7.popup('.popup-friend');
    }

    function checkPhone() {
        console.log(Cookies.get(cookies.balance));
        user = Cookies.getJSON(cookies.user);
        if ($.fn.hasCookie(cookies.has_number) && Cookies.get(cookies.has_number)) {
            $.ajax({
                url: life_lighter_config.apibaseurl + 'balance',
                method: 'POST',
                data: {
                    phone: user.phone
                }
            }).success(function (data) {
                Cookies.set(cookies.balance, data);
                View.fillBalance(data, '');
            }).error(function (e) {
                app.f7.addNotification({
                    title: 'Life Lighter',
                    message: 'Failed to check your balance'
                });
                View.fillBalance(Cookies.get(cookies.balance), 'Last known balance: $');
            }).always(function () {

            });
        } else {
            app.f7.alert('Your account has no phone number set onto it, please goto "Edit Profile" and add it !');
            $('#buyForFriend').unbind();
            $('#topupAccount').unbind();
            $('#accountHistory').unbind();
        }
    }

    return {
        init: init
    };
});