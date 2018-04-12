define(["app", "js/store/storeView"], function (app, View) {
    var $ = jQuery;
    var $$ = Dom7;
    var lifelighter = {};
    var user = {};

    var bindings = [];

    function init() {
        app.f7.closePanel(true);
        loadLifeLighters();
        View.render({
            bindings: bindings
        });
    }

    function loadLifeLighters() {
        user = Cookies.getJSON(cookies.user);
        $.ajax({
            url: life_lighter_config.apibaseurl + 'lifelighters',
            method: 'POST',
            data: {}
        }).success(function (data) {
            console.log(data);
            View.fillStore(data);
            $('*#buyButton').on('click', function () {
                var lighter_id = $(this).attr('lighter_id');
                lifelighter = data.data.filter(function (e) {
                    return (e.id == lighter_id);
                });
                lifelighter = lifelighter[0];
                checkExist(lifelighter);

            });
        }).error(function (e) {
            View.showStatus('failed to load Life Lighters')
        }).always(function () {

        });
    }

    function checkExist(lighter) {
        app.f7.showPreloader('Checking history');
        $.ajax({
            url: life_lighter_config.apibaseurl + 'checkExist',
            method: 'POST',
            data: {
                lighter_id: lighter.id,
                phone: user.phone
            }
        }).success(function (data) {
            if (data.success == 1) {
                dwellOnBalance();
            } else {
                app.f7.alert(data.message);
            }
        }).error(function (error) {
            console.log(error);
            app.f7.alert(life_lighter_mesg.servererror);
        }).always(function () {
            app.f7.hidePreloader();
        });

    }

    function dwellOnBalance() {
        app.f7.showPreloader('Checking balance');
        $.ajax({
            url: life_lighter_config.apibaseurl + 'checkbalance',
            method: 'POST',
            data: {
                phone: user.phone
            }
        }).success(function (data) {
            if (data.success == 0) {
                app.f7.alert(data.message);
            } else {
                getDates();
            }
        }).error(function () {
            app.f7.alert(life_lighter_mesg.servererror);
        }).always(function () {
            app.f7.hidePreloader();
        });
    }

    function getDates() {
        app.f7.showPreloader('Downloading ...');
        $.ajax({
            url: life_lighter_config.apibaseurl + 'getmonth',
            method: 'POST',
            data: {
                id: lifelighter.id
            }
        }).success(function (data) {
            /*   */
            databaseHandler.addLifeLighter(lifelighter, insertDates, data);
        }).error(function (data) {
            app.f7.alert('A network error ocured whilst downloading your Life lighter');
        }).always(function () {
            app.f7.hidePreloader();
        });
    }

    function insertDates(bool, data) {
        if (bool == true) {
            data.data.forEach(function (date) {
                databaseHandler.addDate(date);
            });
            finishPurchase();
        } else {
            app.f7.alert('Please note that you already have this Life Lighter in your phone');
        }
    }

    function finishPurchase() {
        app.f7.showPreloader('Finishing up');
        $.ajax({
            url: life_lighter_config.apibaseurl + 'finish',
            method: 'POST',
            data: {
                phone: user.phone,
                name: lifelighter.name,
                lighter_id: lifelighter.id
            }
        }).success(function (data) {
            if (data.success == 1) {
                //publish life lighter
                databaseHandler.publishLifeLighter(lifelighter.id);
            }
            app.f7.alert(data.message);
        }).error(function () {
            databaseHandler.deleteLifeLighter(lifelighter.id);
            app.f7.alert('An error occurred whilst finishing your purchase');
        }).always(function () {
            app.f7.hidePreloader();
        });
    }

    return {
        init: init
    };
});