define(['hbs!js/account/history', 'hbs!js/account/more_history'], function (historyTemplate, moreTemplate) {
    var $$ = Dom7;
    var $ = jQuery;

    function render(params) {
        bindEvents(params.bindings);
    }

    function fillHistory(data) {
        $('#accHistory').html(historyTemplate(data));
    }

    function appendHistory(data) {
        $('#theHistory').append(moreTemplate(data));
    }

    function showStatus(status) {
        $('#progress').text(status);
    }

    function fillBalance(balance, text) {
        $('#current_balance').text(text + ' ' + parseFloat(balance).toFixed(2));
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render,
        fillBalance: fillBalance,
        fillHistory: fillHistory,
        showStatus: showStatus,
        appendHistory: appendHistory
    };
});

