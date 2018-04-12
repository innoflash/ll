define(['hbs!js/lighter/dates'], function (datesTemplate) {
    var $$ = Dom7;
    var $ = jQuery;

    function render(params) {
        bindEvents(params.bindings);
    }

    function fillImage() {
        $('#service_image').attr('src', $.fn.getPic());
    }

    function fillName(name) {
        $('#pageTitle').text(name);
    }

    function fillDates(data) {
        $('#dates_list').html(datesTemplate(data));
    }

    /*    function fillSavedProfiles(data) {
            $$('#savedProfiles').html(savedTemplate(data));
        }*/
    function bindEvents(bindings) {
        for (var i in bindings) {
            $$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render,
        fillImage: fillImage,
        fillName: fillName,
        fillDates: fillDates
    };
});

