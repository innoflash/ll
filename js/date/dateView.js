define(['hbs!js/date/date'], function (dateTemplate) {
    var $$ = Dom7;
    var $ = jQuery;

    function render(params) {
        bindEvents(params.bindings);
    }

    function fillImage() {
        $('#service_image').attr('src', $.fn.getPic());
    }

    function fillTitle(date, name) {
        $('#page_title').text(date + ' ' + name);
    }

    function fillDate(data) {
        $('#theDate').html(dateTemplate(data))
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
        fillTitle: fillTitle,
        fillDate: fillDate
    };
});

