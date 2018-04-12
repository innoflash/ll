define(["app", "js/date/dateView"], function (app, View) {
    var $ = jQuery;
    var $$ = Dom7;
    var theDate = '';

    var bindings = [];

    function init(query) {
        console.log(query);
        app.f7.closePanel(true);
        theDate = query.date + " " + query.name
        View.fillTitle(query.date, query.name);
        loadDate(query.id);
        View.render({
            bindings: bindings
        });
    }

    function loadDate(id) {
        databaseHandler.getDate(id, fillDate);
        app.f7.messages('.messages', {
            autoLayout: true
        });
    }

    function fillDate(resultSet) {
        var data = resultSet.rows[0];
        View.fillDate(data);
        $('#shareDate').on('click', function () {
            $(this).unbind();
            var message = data.title + '\n' + theDate + '\nBy ' + data.author + '\n' + data.main_verse + '\n' + data.main_reading + '\n\n' + data.body + '\n\nPrayer: \n' + data.prayer + '\n\nDeclarations: \n' + data.declaration + '\n\nFurther Reading: \n' + data.further_reading;
            var options = {
                message: message, // not supported on some apps (Facebook, Instagram)
                subject: data.title, // fi. for email
                url: 'https://www.lifelighter.org',
                chooserTitle: 'Share with' // Android only, you can override the default share sheet title
            }

            var onSuccess = function (result) {

            };

            var onError = function (msg) {
                console.log("Sharing failed with message: " + msg);
                app.f7.alert("Sharing failed with message: " + msg);
            }

            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
        });
        $('#readAloud').on('click', function () {
            $(this).unbind();
            var texts = [];
            var prgrphs = data.body.split('\n');
            texts.push(theDate);
            texts.push(data.title);
            texts.push('By' + data.author);
            texts.push('Main reading from ' + data.main_verse);
            texts.push('It says ' + data.main_reading);
            texts.push('It says ');
            texts.concat(prgrphs);
            texts.push('Prayer ' + data.prayer);
            texts.push('Declarations : ' + data.declaration);
            texts.push('Thank you, stay blessed');

            readIt(texts, 0, texts.length - 1);
        });
    }

    function readIt(texts, start, finish) {
        if (start < finish) {
            TTS.speak(texts[start], function () {
                var new_start = start + 1;
                readIt(texts[start], new_start, finish);
                console.log('just read :', value);
            }, function (reason) {
                console.log(reason);
            });
        }

    }

    return {
        init: init
    };
});