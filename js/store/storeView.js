define(['hbs!js/store/store'], function (storeTemplate) {
    var $$ = Dom7;
    var $ = jQuery;

    function render(params) {
        bindEvents(params.bindings);
    }

    function fillStore(data) {
        $('#storeItems').html(storeTemplate(data));
    }

    function showStatus(text) {
        $('#status').text(text);
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render,
        fillStore: fillStore,
        showStatus: showStatus
    };
});

