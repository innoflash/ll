define(['hbs!js/profile/profile'], function (profileTemplate) {
    var $$ = Dom7;
    var $ = jQuery;

    function render(params) {
        bindEvents(params.bindings);
    }

    function fillImage() {
        $('#service_image').attr('src', $.fn.getPic());
    }

    function fillProfile(data){
        $('#personal_details').html(profileTemplate(data));
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
        fillProfile: fillProfile
    };
});

