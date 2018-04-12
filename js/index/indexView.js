define(['hbs!js/index/blank', 'hbs!js/index/lighters'], function (blankTemplate, lightersTemplate) {
    var $$ = Dom7;
    var $ = jQuery;

    function render(params) {
        bindEvents(params.bindings);
    }

    function fillName(name) {
        $('#username').text(name);
    }

    function showEmpty() {
        $('#lifelighters').html(blankTemplate);
    }

    function fillLighters(data) {
        $('#lifelighters').html(lightersTemplate(data));
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render,
        fillName: fillName,
        showEmpty: showEmpty,
        fillLighters: fillLighters
    };
});

