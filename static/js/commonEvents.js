/* global ResponsiveBootstrapToolkit jQuery window wideSearchInput search */

jQuery('#subheader-search')
    .on('focus', wideSearchInput);

jQuery('#subheader-search')
    .on('focusout', narrowSearchInput);

jQuery('#subheader-search')
    .on('keyup', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            search();
        }
    });

(function ($, viewport) {
    // Bootstrap 4 Divs
    const bootstrapDivs = {
        xs: $('<div class="device-xs d-block d-sm-none"></div>'),
        sm: $('<div class="device-sm d-none d-sm-block d-md-none"></div>'),
        md: $('<div class="device-md d-none d-md-block d-lg-none"></div>'),
        lg: $('<div class="device-lg d-none d-lg-block d-xl-none"></div>'),
        xl: $('<div class="device-xl d-none d-xl-block butts"></div>'),
    };
    viewport.use('bs4', bootstrapDivs);

    // on resize
    $(window)
        .resize(
            viewport.changed(() => {
                console.log('Current breakpoint: ', viewport.current());
            })
        );
}(jQuery, ResponsiveBootstrapToolkit));
