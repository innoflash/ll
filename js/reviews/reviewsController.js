define(["app", "js/reviews/reviewsView"], function (app, View) {
    var $ = jQuery;
    var $$ = Dom7;

    var side = 0;

    var bindings = [
        {
            element: '#sendFeedback',
            event: 'click',
            handler: sendFeedback
        }, {
            element: '#reportProblem',
            event: 'click',
            handler: reportProblem
        }, {
            element: '#btnCancelReportbtnCancelReport',
            event: 'click',
            handler: cancelReport
        }, {
            element: '#btnSubmitReport',
            event: "click",
            handler: sendReview
        }, {
            element: '#moreOptions',
            event: 'click',
            handler: openOptions
        }
    ];

    function init() {
        app.f7.closePanel(true);
        View.fillImage();
        View.render({
            bindings: bindings
        });
    }

    function openOptions() {
        var buttons1 = [
            {
                text: 'Send Review',
                label: true
            },
            {
                text: 'Feedback',
                bold: true,
                onClick: function () {
                    sendFeedback();
                }
            },
            {
                text: 'Report',
                bold: true,
                onClick: function () {
                    reportProblem();
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

    function cancelReport() {
        app.f7.closeModal('.popup-report');
    }

    function reportProblem() {
        side = 0;
        View.fillTitle('Report');
        app.f7.popup('.popup-report');
    }

    function sendFeedback() {
        side = 1;
        View.fillTitle('Feedback');
        app.f7.popup('.popup-report');
    }

    function sendReview() {
        var user = Cookies.getJSON(cookies.user);
        console.log(user);
        var VF = [
            $('#message')
        ];

        if ($.fn.fieldsValid(VF, app)) {
            var data = {
                user_id: user.phone_id,
                side: side,
                message: $('#message').val()
            };
            app.f7.showPreloader('Sending review ');
            $.ajax({
                url: life_lighter_config.apibaseurl + 'review',
                method: 'POST',
                data: data
            }).success(function (data) {
                $('#message').val('');
                app.f7.alert(data.message);
            }).error(function (data) {
                app.f7.alert(life_lighter_mesg.servererror);
                console.log(data);
            }).always(function () {
                app.f7.closeModal('.popup-report');
                app.f7.hidePreloader();
            });
        }
    }

    return {
        init: init
    };
});