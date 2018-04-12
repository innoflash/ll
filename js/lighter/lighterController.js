define(["app", "js/lighter/lighterView"], function (app, View) {
    var $ = jQuery;
    var $$ = Dom7;
    var name = '';

    var bindings = [];

    function init(query) {
        name = query.name;
        app.f7.closePanel(true);
        View.fillName(name);
        loadDates(query.id);
        console.log(query);
        View.render({
            bindings: bindings
        });
    }

    function loadDates(id) {
        databaseHandler.getDates(id, fillDates);
    }

    function fillDates(rows) {
        View.fillDates(rows);
        $('*#openDate').on('click', function () {
            var id = $(this).attr('date_id');
            var date = $(this).attr('date');

            console.log(id);
            app.mainView.router.loadPage('pages/date.html?id=' + id + '&name=' + name + '&date=' + date);
        });
    }

    return {
        init: init
    };
});