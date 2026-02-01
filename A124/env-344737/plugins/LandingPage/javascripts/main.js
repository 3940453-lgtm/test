// main.js

(function () {

    isElementInArray = function (array, item) {
        var i = array.length;
        while (i--) {
            if (array[i] === item) return true;
        }
        return false;
    }


    var fixSafariTabLinks = function () {
        // Only execute the code on desktop Safari
        if (!isMobile.any() && !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {

            // In Safari, after downloading the mstrc file, clicking other buttons does not work
            // This is a quick fix for that

            // For all 'a' tags that would open a new tab, give them a new click handler
            $('a[target="_blank"]').click(function () {
                // The click should open a new window
                var newWindow = window.open();
                // Set the opener to null to prevent reverse tabnapping
                // IMPORTANT to prevent vulnerabilities
                newWindow.opener = null;
                // and set the location of the new tab to what's defined in the HTML
                newWindow.location = $(this).attr('href');

                return false;
            });
        }
    }

    var disabledTooltipForCardButtonAndMobileButton = function (id, platform) {
        var val = 'Only available for ' + platform

        $(id).parent().tooltip('remove');
        $(id + '-mobile').parent().tooltip('remove');
        $(id).parent().tooltip({ tooltip: val, delay: 50, position: 'top' });
        $(id + '-mobile').parent().tooltip({ tooltip: val, delay: 50, position: 'top' });

    }

    var onScroll = function () {

        // Hide nav tooltips when you scroll
        $('#vNav .tooltipped').trigger('mouseleave');

        var parPosition = [];
        $('.par').each(function () {
            parPosition.push($(this).offset().top);
        });

        // Since Solutions is so much smaller than the other two sections,
        // show it as being in that section until it is off the screen
        var scrollPosition = $(document).scrollTop();
        if (scrollPosition <= parPosition[0]) {
            index = 0;
            $('.vNav ul li, .vNav ul li a, .vNav ul li a div').removeClass('active');
            $('.vNav ul li a:eq(' + index + ')').addClass('active').parent().addClass('active').find('div').addClass('active');
            return;
        }


        var position = scrollPosition + $(window).height(),
            index = 0;
        for (var i = parPosition.length - 1; i >= 0; i--) {
            if (position >= parPosition[i]) {
                index = i;
                break;
            }
        }

        $('.vNav ul li, .vNav ul li a, .vNav ul li a div').removeClass('active');
        $('.vNav ul li a:eq(' + index + ')').addClass('active').parent().addClass('active').find('div').addClass('active');
    }

    function copyToClipboard(element, value) {
        clipboard.writeText(value || $(element).text());
    }

    var isDesktop = function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
            return false;
        }
        return true;
    }
    var isMobile = {
        Android: function () {
            return /Android/i.test(navigator.userAgent);
        },
        BlackBerry: function () {
            return /BlackBerry/i.test(navigator.userAgent);
        },
        iOS: function () {
            return /iPhone|iPad|iPod/i.test(navigator.userAgent);
        },
        androidPhone: function () {
            if (this.Android()) {
                return /Mobile/i.test(navigator.userAgent);
            }
            return false;
        },
        androidTablet: function () {
            if (this.Android()) {
                return !this.androidPhone();
            }
            return false;
        },
        iPhone: function () {
            return /iPhone/i.test(navigator.userAgent);
        },
        iPad: function () {
            return /iPad/i.test(navigator.userAgent);
        },
        Windows: function () {
            return /IEMobile/i.test(navigator.userAgent);
        },
        Tablet: function () {
            return this.iPad() || this.androidTablet();
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
        }
    };

    function createMSTRCFile(json) {
        var p_baseserver = json.mstrWeb.split("/MicroStrategy")[0];
        //console.log(p_baseserver);
        var p_environmentName = p_baseserver.split(".")[0].split("/")[2];
        var p_dossierServerURL = json.dossierUrl
        var p_authenticationMode = 1;

        var mstrc = {
            environmentName: p_environmentName,
            dossierServerURL: p_dossierServerURL,
            authenticationMode: p_authenticationMode
        };

        result = JSON.stringify(mstrc, null, 4);
        return result;
    }

    function setConf(json, lnk) {
        var link_mobile = $(lnk + '-mobile');
        var link = $(lnk);

        if (!window.Blob) {
            link.on('click', function () {

                window.alert('Please upgrade your browser and try again.');

            });
            link_mobile.on('click', function () {


                window.alert('Please upgrade your browser and try again.');

            });
            return;
        }
        var mstrc = createMSTRCFile(json),
            data = new Blob([mstrc], {
                type: 'text/plain'
            }),
            textfile = window.URL.createObjectURL(data),
            filename = json.mstrWeb.split('.')[0].split('/')[2] + '.mstrc';

        if (window.navigator.msSaveBlob) { // IE10 supports Blob, but not a[download]
            link.on('click', function () {
                window.navigator.msSaveBlob(data, filename);
            });
            link_mobile.on('click', function () {
                window.navigator.msSaveBlob(data, filename);
            });
        } else {
            // name the download file accordingly
            link.attr('download', filename);
            link_mobile.attr('download', filename);
            link.attr('href', textfile);
            link_mobile.attr('href', textfile);
        }
    };

    function getFormObj(formId) {
        var formObj = {};
        var inputs = $(formId).serializeArray();
        $.each(inputs, function (i, input) {
            formObj[input.name] = input.value;
        });
        return formObj;
    }

    $(document).ready(function () {

        // Fix defect DE80308
        // When we load the page, make sure Safari knows to open links as new tabs, even after downloading mstrc blob
        fixSafariTabLinks();

        // we need to use js for these tooltips because they are dynamic
        var vals = ['Click to Copy', 'Copied to clipboard']

        $('#connections .tooltipped').tooltip({ tooltip: vals[0] });
        $('#connections .tooltipped')
            .click(function (e) {
                $(e.target).mouseout().delay(500).tooltip('remove');
                $(e.target).tooltip({
                    tooltip: '<div class="valign-wrapper"><div class="svg icon-green-checkmark"></div><span>' + vals[1] + '</span></div>',
                    html: true
                });
                $(e.target).mouseover()
                    .mouseout(function (etwo) {
                        $(e.target).tooltip('remove');
                        $(e.target).tooltip({ tooltip: vals[0] });
                        $(e.target).off('mouseover').off('mouseout');
                    });
            });


        // Initialize Materialize components
        $('.button-collapse').sideNav();

        // Make Reveal animate up and display when mouseenter
        $(document).on('mouseenter.hover-reveal', '.hover-reveal', function (e) {
            $(e.target).closest('.card').css('overflow', 'hidden');
            // $(this).find('.card-content>span').attr('style', 'color: rgba(0,0,0,0) !important');
            $(this).find('.card-reveal').css('opacity', '0');
            $(this).find('.card-reveal').css({ display: 'block' })
                .velocity("stop", false)
                .velocity({ opacity: 1 },
                {
                    duration: 150,
                    queue: false,
                    easing: 'easeInOutQuad'
                });
        });

        // Make Reveal animate down and display none when mouseleave
        $(document).on('mouseleave.hover-reveal', '.hover-reveal', function (e) {
            $(this).find('.card-reveal').velocity(
                { opacity: 0 }, {
                    duration: 300,
                    queue: false,
                    easing: 'easeInOutQuad',
                    complete: function () { $(this).css({ display: 'none' }); }
                }
            );
            // $(this).find('.card-content>span').attr('style', '');
        });

        $('.hover-reveal').on('click', '.hover-reveal .card-reveal:hidden', function(e) {
            // Unreveal all visible cards
            $('.card-reveal:visible').velocity(
                { opacity: 0 }, {
                    duration: 300,
                    queue: false,
                    easing: 'easeInOutQuad',
                    complete: function () { $(this).css({ display: 'none' }); }
                }
            );

            // Reveal the right card
            $(e.target).closest('.card').css('overflow', 'hidden');
            // $(this).find('.card-content>span').attr('style', 'color: rgba(0,0,0,0) !important');
            $(this).find('.card-reveal').css('opacity', '0');
            $(this).find('.card-reveal').css({ display: 'block' })
                .velocity("stop", false)
                .velocity({ opacity: 1 },
                {
                    duration: 150,
                    queue: false,
                    easing: 'easeInOutQuad'
                });
        });

        $('#header-sign-out, #header-sign-out-mobile').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                url: "mstrWeb?evt=3019&amp;src=mstrWeb.3019"
            }).done(function () {
                location.reload();
            });
        });

        $('#connections .connections-connections a').on('click', function (e) {
            copyToClipboard(e.target, null);
        });

        // Wire up the side navigation
        $('#vNav a').click(function () {
            var self = this;
            $($(self).attr('href')).velocity('scroll', {
                duration: 500, easing: 'ease-in-out', begin: function () {
                    $(document).off('scroll');
                    $('#vNav').find('.tooltipped').mouseout();
                },
                complete: function () {
                    $(document).scroll(onScroll);
                    $('#vNav').find('.tooltipped:hover').mouseover();
                }
            });
        });
        $('.vNav ul li a').click(function () {
            $('.vNav ul li a').removeClass('active').parent().removeClass('active').find('div').removeClass('active');
            $(this).addClass('active').parent().addClass('active').find('div').addClass('active');
        });
        $(document).scroll(onScroll);
        onScroll();

        // Fill in the links
        $.getJSON("../plugins/LandingPage/config.json", function (json) {
            // Here, the JSON config data is used to populate links
            // The appropriate buttons are also enabled/disabled depending on the platform the page is being viewed on

            // Header
            $('#header-documentation').attr('href', json.documentationUrl);
            $('#header-documentation-mobile').attr('href', json.documentationUrl);

            // Solutions Panel

            $('#solutions-panel-create').attr('href',
                json.createNewDossierApp === 'MicroStrategyLibrary'
                    ? json.dossierUrl
                        + '/app/'
                        + json.MainProjectId
                        + '/'
                        + json.dossierBlankTemplateId
                        + '/edit?isNew=true'
                    : 'mstrWeb?Project='
                        + json.MainProject
                            // .toUpperCase()  // Removed to fix DE80521
                            .replace(/\s+/g, '+')
                        + '&Port=0?evt=3187&src=mstrWeb.3187'
            );
            $('#solutions-panel-share').attr('href',
                'mstrServerAdmin?evt=3112&src=mstrServerAdmin.3112&Server='
                + json.PlatformInstanceHostname01
                + '&Port=0&'
            );
            $('#solutions-panel-manage').attr('href',
                json.ClassicConsole.toLowerCase() === 'true'
                    ? 'https://provision'
                        + (json.Environment.toLowerCase() === 'prod'
                            ? ''
                            : '-'
                            + json.Environment)
                        + '.customer.cloud.microstrategy.com'
                    : json.Environment.toLowerCase() === 'prod'
                        ? 'https://cloudplatform.microstrategy.com'
                        : 'https://console-dev.customer.cloud.microstrategy.com'
            );

            // Resources Panel

            $('#resources-cards-web-settings-mobile').attr('href', json.webAdmin);
            $('#resources-cards-web-settings').attr('href', json.webAdmin);
            $('#resources-cards-web-launch-mobile').attr('href', json.mstrWeb);
            $('#resources-cards-web-launch').attr('href', json.mstrWeb);

            $('#resources-cards-mobile-settings-mobile').attr('href',
                isMobile.any()
                    ? isMobile.iPad()
                        ? json.iPadMstr
                        : isMobile.iPhone()
                            ? json.iPhoneMstr
                            : isMobile.androidTablet()
                                ? json.androidMstrTablet
                                : json.androidMstrPhone
                    : 'javascript:void(0)')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
                .css('cursor', isMobile.any()
                    ? ''
                    : 'default')
            // .parent().toggle(isMobile.any());
            $('#resources-cards-mobile-settings').attr('href',
                isMobile.iPad()
                    ? json.iPadMstr
                    : isMobile.iPhone()
                        ? json.iPhoneMstr
                        : isMobile.androidTablet()
                            ? json.androidMstrTablet
                            : json.androidMstrPhone)
                .addClass(isMobile.any()
                    ? ''
                    : 'disabled')
                .children('i')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
            // .first().parent().parent().parent().toggle(isMobile.any());
            $('#resources-cards-mobile-file_download-mobile').attr('href',
                isMobile.any()
                    ? isMobile.iPad()
                        ? json.iPadMstrDownload
                        : isMobile.iPhone()
                            ? json.iPhoneMstrDownload
                            : json.androidMstrDownload
                    : 'javascript:void(0)')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
                .css('cursor', isMobile.any()
                    ? ''
                    : 'default')
            // .parent().toggle(isMobile.any());
            $('#resources-cards-mobile-file_download').attr('href',
                isMobile.iPad()
                    ? json.iPadMstrDownload
                    : isMobile.iPhone()
                        ? json.iPhoneMstrDownload
                        : json.androidMstrDownload)
                .addClass(isMobile.any()
                    ? ''
                    : 'disabled')
                .children('i')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
            // .first().parent().parent().parent().toggle(isMobile.any());
            $('#resources-cards-mobile-launch-mobile').attr('href', json.mstrMobile)
            // .addClass(!isMobile.any()
            //     ? ''
            //     : 'grey-text')
            // .removeClass(!isMobile.any()
            //     ? ''
            //     : 'blue-text')
            // .css('cursor', !isMobile.any()
            //     ? 'auto'
            //     : 'default')
            // .parent().toggle(!isMobile.any());
            $('#resources-cards-mobile-launch').attr('href', json.mstrMobile)
            // .addClass(!isMobile.any()
            //     ? ''
            //     : 'disabled')
            // .children('i')
            // .addClass(!isMobile.any()
            //     ? ''
            //     : 'grey-text')
            // .removeClass(!isMobile.any()
            //     ? ''
            //     : 'blue-text').first().parent().parent().parent()
            // .toggle(!isMobile.any());

            if (!isMobile.any()) {
                disabledTooltipForCardButtonAndMobileButton('#resources-cards-mobile-settings', 'mobile devices');
                disabledTooltipForCardButtonAndMobileButton('#resources-cards-mobile-file_download', 'mobile devices');
            }

            $('#resources-cards-workstation-apple-mobile').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrWkstnMacDownload)
                .addClass(isMobile.any()
                    ? 'grey-text'
                    : '')
                .removeClass(isMobile.any()
                    ? 'blue-text'
                    : '')
                .css('cursor', isMobile.any()
                    ? 'default'
                    : '')
            // .parent()
            // .toggle(
            // // !isMobile.any() &&
            // navigator.platform.toUpperCase().indexOf('MAC') >= 0);
            $('#resources-cards-workstation-apple').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrWkstnMacDownload)
                .addClass(isMobile.any()
                    ? 'disabled'
                    : '')
            // .parent().parent()
            // .toggle(
            // // !isMobile.any() &&
            // navigator.platform.toUpperCase().indexOf('MAC') >= 0);
            $('#resources-cards-workstation-windows-mobile').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrWkstnDownload)
                .addClass(isMobile.any()
                    ? 'grey-text'
                    : '')
                .removeClass(isMobile.any()
                    ? 'blue-text'
                    : '')
                .css('cursor', isMobile.any()
                    ? 'default'
                    : '')
            // .parent()
            // .toggle(
            // // !isMobile.any() &&
            // !(navigator.platform.toUpperCase().indexOf('MAC') >= 0));
            $('#resources-cards-workstation-windows').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrWkstnDownload)
                .addClass(isMobile.any()
                    ? 'disabled'
                    : '')
            // .parent().parent()
            // .toggle(
            // // !isMobile.any() &&
            // !(navigator.platform.toUpperCase().indexOf('MAC') >= 0));

            setConf(json, '#resources-cards-workstation-settings'); // The workstation config button downloads a file. The code was reused from the previous landing page

            if (isMobile.any()) {
                // Disable configure buttons for workstation
                $('#resources-cards-workstation-settings')
                    .off('click')
                    .attr('href', 'javascript:void(0)')
                    .removeAttr('download')
                    .addClass('disabled')
                    .children('i')
                    .addClass('grey-text')
                    .removeClass('blue-text');
                $('#resources-cards-workstation-settings-mobile')
                    .off('click')
                    .attr('href', 'javascript:void(0)')
                    .removeAttr('download')
                    .addClass('grey-text')
                    .removeClass('blue-text')
                    .css('cursor', 'default');
            }

            if (isMobile.any()) {
                disabledTooltipForCardButtonAndMobileButton('#resources-cards-workstation-apple', 'desktop');
                disabledTooltipForCardButtonAndMobileButton('#resources-cards-workstation-windows', 'desktop');
                disabledTooltipForCardButtonAndMobileButton('#resources-cards-workstation-settings', 'desktop');
            }

            // $('#resources-cards-workstation-settings-mobile')
            // .parent().toggle(!isMobile.any());
            // $('#resources-cards-workstation-settings')
            // .parent().parent().toggle(!isMobile.any());

            // The following two statements are for learn more buttons that might have links in the future
            // but do not currently. As such, I felt it was more in line with the requirements to not include them
            // as they were not included in the original prototype. However, the code is here if they are needed
            // The other buttons in the workstation card all have commented out code to support these learn more buttons

            // $('#resources-cards-workstation-launch-mobile').attr('href', 'https://community.microstrategy.com/s/article/Workstation-Homepage')
            //     .parent()
            //     .toggle(isMobile.any());
            // $('#resources-cards-workstation-launch').attr('href', 'https://community.microstrategy.com/s/article/Workstation-Homepage').parent().parent()
            //     .toggle(isMobile.any());

            $('#resources-cards-desktop-apple-mobile').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrDesktopMacDownload)
                .addClass(isMobile.any()
                    ? 'grey-text'
                    : '')
                .removeClass(isMobile.any()
                    ? 'blue-text'
                    : '')
                .css('cursor', isMobile.any()
                    ? 'default'
                    : '')
                .parent()
                .toggle(!isMobile.any())
            $('#resources-cards-desktop-apple').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrDesktopMacDownload)
                .addClass(isMobile.any()
                    ? 'disabled'
                    : '')
                .parent().parent()
                .toggle(!isMobile.any())
            $('#resources-cards-desktop-windows-mobile').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrDesktopDownload)
                .addClass(isMobile.any()
                    ? 'grey-text'
                    : '')
                .removeClass(isMobile.any()
                    ? 'blue-text'
                    : '')
                .css('cursor', isMobile.any()
                    ? 'default'
                    : '')
                .parent()
                .toggle(!isMobile.any())
            $('#resources-cards-desktop-windows').attr('href',
                isMobile.any()
                    ? 'javascript:void(0)'
                    : json.mstrDesktopDownload)
                .addClass(isMobile.any()
                    ? 'disabled'
                    : '')
                .parent().parent()
                .toggle(!isMobile.any())

            // if (isMobile.any()) {
            //     disabledTooltipForCardButtonAndMobileButton('#resources-cards-desktop-apple', 'desktop');
            //     disabledTooltipForCardButtonAndMobileButton('#resources-cards-desktop-windows', 'desktop');
            //     disabledTooltipForCardButtonAndMobileButton('#resources-cards-desktop-settings', 'desktop');
            // }

            setConf(json, '#resources-cards-desktop-settings');
            $('#resources-cards-desktop-settings-mobile')
                .parent().toggle(!isMobile.any());
            $('#resources-cards-desktop-settings')
                .parent().parent().toggle(!isMobile.any());

            if (isMobile.any()) {
                // Disable configure buttons for workstation
                $('#resources-cards-desktop-settings')
                    .off('click')
                    .attr('href', 'javascript:void(0)')
                    .removeAttr('download')
                    .addClass('disabled')
                    .children('i')
                    .addClass('grey-text')
                    .removeClass('blue-text');
                $('#resources-cards-desktop-settings-mobile')
                    .off('click')
                    .attr('href', 'javascript:void(0)')
                    .removeAttr('download')
                    .addClass('grey-text')
                    .removeClass('blue-text')
                    .css('cursor', 'default');
            }

            $('#resources-cards-desktop-launch-mobile').attr('href', json.mstrDesktop) //'https://microstrategy.com/us/desktop')
                .parent()
                .toggle(isMobile.any());
            $('#resources-cards-desktop-launch').attr('href', json.mstrDesktop /*'https://microstrategy.com/us/desktop'*/).parent().parent()
                .toggle(isMobile.any());


            $('#resources-cards-library-settings-mobile').attr('href', json.dossierUrlAdmin);
            $('#resources-cards-library-settings').attr('href', json.dossierUrlAdmin);
            $('#resources-cards-library-launch-mobile').attr('href', json.dossierUrl);
            $('#resources-cards-library-launch').attr('href', json.dossierUrl);

            $('#resources-cards-mobile-admin-settings-mobile').attr('href', json.mobileAdmin);
            $('#resources-cards-mobile-admin-settings').attr('href', json.mobileAdmin);

            $('#resources-cards-dossier-settings-mobile').attr('href',
                isMobile.any()
                    ? json.dossierAppUrl
                    : 'javascript:void(0)')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
                .css('cursor', isMobile.any()
                    ? ''
                    : 'default')
            // .parent().toggle(isMobile.any());
            $('#resources-cards-dossier-settings').attr('href', json.dossierAppUrl)
                .addClass(isMobile.any()
                    ? ''
                    : 'disabled')
                .children('i')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
            // .first()
            // .parent().parent().parent()
            // .toggle(isMobile.any());
            $('#resources-cards-dossier-file_download-mobile').attr('href',
                isMobile.any()
                    ? (isMobile.iPad() //|| isMobile.iPhone()
                        ? json.dossierAppiOSDownload
                        : (isMobile.iPhone()
                            ? json.libraryAppiPhoneDownload
                            : json.dossierAppAndroidDownload))
                    : 'javascript:void(0)')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
                .css('cursor', isMobile.any()
                    ? '' :
                    'default')
            // .parent().toggle(isMobile.any());
            $('#resources-cards-dossier-file_download').attr('href',
                (isMobile.iPad() //|| isMobile.iPhone()
                    ? json.dossierAppiOSDownload
                    : (isMobile.iPhone()
                        ? json.libraryAppiPhoneDownload
                        : json.dossierAppAndroidDownload)))
                .addClass(isMobile.any()
                        ? ''
                        : 'disabled')
                .children('i')
                .addClass(isMobile.any()
                    ? ''
                    : 'grey-text')
                .removeClass(isMobile.any()
                    ? ''
                    : 'blue-text')
            // .first()
            // .parent().parent().parent()
            // .toggle(isMobile.any());

            if (!isMobile.any()) {
                disabledTooltipForCardButtonAndMobileButton('#resources-cards-dossier-settings', 'mobile devices');
                disabledTooltipForCardButtonAndMobileButton('#resources-cards-dossier-file_download', 'mobile devices');
            }

            // The following two statements are for learn more buttons that might have links in the future
            // but do not currently. As such, I felt it was more in line with the requirements to not include them
            // as they were not included in the original prototype. However, the code is here if they are needed
            // The other buttons in the dossier card all have commented out code to support these learn more buttons

            // $('#resources-cards-dossier-launch-mobile').attr('href', 'https://www.microstrategy.com/us/platform/whats-new') // TODO remove link
            //     .addClass(!isMobile.any()
            //         ? ''
            //         : 'grey-text')
            //     .removeClass(!isMobile.any()
            //         ? ''
            //         : 'blue-text')
            //     .css('cursor', !isMobile.any()
            //         ? 'auto' :
            //         'default')
            //     .parent().toggle(!isMobile.any());
            // $('#resources-cards-dossier-launch').attr('href', 'https://www.microstrategy.com/us/platform/whats-new') // TODO remove link
            //     .addClass(!isMobile.any()
            //         ? ''
            //         : 'disabled')
            //     .children('i')
            //     .addClass(!isMobile.any()
            //         ? ''
            //         : 'grey-text')
            //     .removeClass(!isMobile.any()
            //         ? ''
            //         : 'blue-text').first()
            //     .parent().parent().parent()
            //     .toggle(!isMobile.any());

            $('#resources-cards-remote-desktop-gateway').toggle(json.serverOS.toLowerCase() !== 'windows');
            if (json.serverOS.toLowerCase() !== 'windows') {
                $('#resources-cards-remote-gateway-launch-mobile').attr('href',
                    json.Guacamole === 'True'
                        ? (json.utilityBox.indexOf('https://') === -1
                            ? 'https://'
                            : '')
                        + json.utilityBox.replace('-rdp', '')
                        + '/rdp' : 'javascript:void(0)')
                    .addClass(json.Guacamole === 'True'
                        ? ''
                        : 'grey-text')
                    .removeClass(json.Guacamole === 'True'
                        ? ''
                        : 'blue-text')
                    .css('cursor', json.Guacamole === 'True'
                        ? ''
                        : 'default');
                $('#resources-cards-remote-gateway-launch').attr('href',
                    (json.utilityBox.indexOf('https://') === -1
                        ? 'https://'
                        : '')
                    + json.utilityBox.replace('-rdp', '')
                    + '/rdp')
                    .addClass(json.Guacamole === 'True'
                        ? ''
                        : 'disabled')
                    .children('i')
                    .addClass(json.Guacamole === 'True'
                        ? ''
                        : 'grey-text')
                    .removeClass(json.Guacamole === 'True'
                        ? ''
                        : 'blue-text');
            }

            $('#resources-cards-hyperintelligence-file_download-mobile').attr('href', json.hyperDownloadUrl);
            $('#resources-cards-hyperintelligence-file_download').attr('href', json.hyperDownloadUrl);
            $('#resources-cards-hyperintelligence-launch-mobile').attr('href', json.hyperMarketingUrl);
            $('#resources-cards-hyperintelligence-launch').attr('href', json.hyperMarketingUrl);
            $('#resources-cards-hyperintelligence-help-mobile').attr('href', json.hyperHelpUrl);
            $('#resources-cards-hyperintelligence-help').attr('href', json.hyperHelpUrl);

            // Essential Connections

            $('#developer-machine-name').text(json.utilityBox.replace('https://', '') + (json.RDP_PORT ? ':' + json.RDP_PORT : ''))
                .parents('.col.s6').first().toggle(json.envType.indexOf('_developer') !== -1);
                $('#rds-endpoint').text(json.RDSEndpoint + ":" + json.RDSPort);
            $.each(json.serverBoxIP, function (i, v) {
                var hostname = 'PlatformInstanceHostname0' + (i + 1);
                $('#intelligence-server-address').append('<div><a class="tooltipped" data-delay="50" data-position="top" href="javascript:void(0)">' + v + '</a><span> (' + json[hostname] + ')</span></div>');
            });
            $('#intelligence-server-address a').on('click', function (e) {
                copyToClipboard(e.target, null);
            });            
            $('#restful-api').text(json.dossierUrl + '/api-docs/');
            if (json.serverOS.toLowerCase() == 'linux') {
                $('#rdp-address').parents('.col.s6').first().toggle(false);
                $.each(json.serverBoxIP.map(function (e) { return e + ':5901'; }), function (i, v) {
                    var hostname = 'PlatformInstanceHostname0' + (i + 1);
                    $('#vnc-address').append('<div><a class="tooltipped" data-delay="50" data-position="top" href="javascript:void(0)">' + v + '</a><span> (' + json[hostname] + ')</span></div>');
                });

            } else if (json.serverOS.toLowerCase() == 'windows') {
                $('#vnc-address').parents('.col.s6').first().toggle(false);
                $.each(json.serverBoxIP.map(function (e) { return e + ':3391'; }), function (i, v) {
                    var hostname = 'PlatformInstanceHostname0' + (i + 1);
                    $('#rdp-address').append('<div><a class="tooltipped" data-delay="50" data-position="top" href="javascript:void(0)">' + v + '</a><span> (' + json[hostname] + ')</span></div>');
                });
            }

            // If on windows, only show RDP address if there is a developer box
            // otherwise, the iserver is isolated from the world and cannot be accessed easily
            if (json.serverOS.toLowerCase() === 'windows') {
                $('#rdp-address').parent().toggle(json.envType.indexOf('_developer') !== -1);
            }

            $('#vnc-address a').on('click', function (e) {
                copyToClipboard(e.target, null);
            });
            $('#rdp-address a').on('click', function (e) {
                copyToClipboard(e.target, null);
            });
            $('#tomcat-sdk').text(json.tomcatSDK + ':8080').parents('.col.s6').first().toggle(json.Addins[0] === 'sdk');
            if (json.DataServerInstanceIP) {
                $('#data-server-address').append('<div><a class="tooltipped" data-delay="50" data-position="top" href="javascript:void(0)">' + json.DataServerInstanceIP + '</a><span> (' + json.DataServerHostname + ')</span></div>');
            } else {
                $('#data-server-address').parents('.col.s6').first().toggle(false);
            }
            $('#data-server-address a').on('click', function (e) {
                copyToClipboard(e.target, null);
            });
            // Since we had to dynamically add the <a> tags to ISA / VNC, we have to give them localized tooltips
            var vals = ['Click to Copy', 'Copied to clipboard']


            $('#intelligence-server-address .tooltipped').tooltip({ tooltip: vals[0] });
            $('#vnc-address .tooltipped').tooltip({ tooltip: vals[0] });
            $('#rdp-address .tooltipped').tooltip({ tooltip: vals[0] });
            $('#data-server-address .tooltipped').tooltip({ tooltip: vals[0] });
            $('#intelligence-server-address .tooltipped')
                .click(function (e) {
                    $(e.target).mouseout().delay(500).tooltip('remove');
                    $(e.target).tooltip({
                        tooltip: '<div class="valign-wrapper"><div class="svg icon-green-checkmark"></div><span>' + vals[1] + '</span></div>',
                        html: true
                    });
                    $(e.target).mouseover()
                        .mouseout(function (etwo) {
                            $(e.target).tooltip('remove');
                            $(e.target).tooltip({ tooltip: vals[0] });
                            $(e.target).off('mouseover').off('mouseout');
                        });
                });
            $('#vnc-address .tooltipped')
                .click(function (e) {
                    $(e.target).mouseout().delay(500).tooltip('remove');
                    $(e.target).tooltip({
                        tooltip: '<div class="valign-wrapper"><div class="svg icon-green-checkmark"></div><span>' + vals[1] + '</span></div>',
                        html: true
                    });
                    $(e.target).mouseover()
                        .mouseout(function (etwo) {
                            $(e.target).tooltip('remove');
                            $(e.target).tooltip({ tooltip: vals[0] });
                            $(e.target).off('mouseover').off('mouseout');
                        });
                });
            $('#rdp-address .tooltipped')
                .click(function (e) {
                    $(e.target).mouseout().delay(500).tooltip('remove');
                    $(e.target).tooltip({
                        tooltip: '<div class="valign-wrapper"><div class="svg icon-green-checkmark"></div><span>' + vals[1] + '</span></div>',
                        html: true
                    });
                    $(e.target).mouseover()
                        .mouseout(function (etwo) {
                            $(e.target).tooltip('remove');
                            $(e.target).tooltip({ tooltip: vals[0] });
                            $(e.target).off('mouseover').off('mouseout');
                        });
                });
            $('#data-server-address .tooltipped')
                .click(function (e) {
                    $(e.target).mouseout().delay(500).tooltip('remove');
                    $(e.target).tooltip({
                        tooltip: '<div class="valign-wrapper"><div class="svg icon-green-checkmark"></div><span>' + vals[1] + '</span></div>',
                        html: true
                    });
                    $(e.target).mouseover()
                        .mouseout(function (etwo) {
                            $(e.target).tooltip('remove');
                            $(e.target).tooltip({ tooltip: vals[0] });
                            $(e.target).off('mouseover').off('mouseout');
                        });
                });

            // Security Cards
            if(json.IncludeUsher) {
                $('#security-cards-network-manager-launch-mobile').attr('href', json.networkMgr);
                $('#security-cards-network-manager-launch').attr('href', json.networkMgr);

                $('#security-cards-communicator-file_download-mobile').attr('href',
                    isMobile.iPad()
                        ? json.iPadProDownload
                        : isMobile.iPhone()
                            ? json.iPhoneProDownload
                            : 'javascript:void(0)')
                    .addClass(isMobile.iOS()
                        ? ''
                        : 'grey-text')
                    .removeClass(isMobile.iOS()
                        ? ''
                        : 'blue-text')
                    .css('cursor', isMobile.iOS()
                        ? ''
                        : 'default');
                $('#security-cards-communicator-file_download').attr('href',
                    isMobile.iPad()
                        ? json.iPadProDownload
                        : isMobile.iPhone()
                            ? json.iPhoneProDownload
                            : 'javascript:void(0)')
                    .addClass(isMobile.iOS()
                        ? ''
                        : 'disabled')
                    .children('i')
                    .addClass(isMobile.iOS()
                        ? ''
                        : 'grey-text')
                    .removeClass(isMobile.any()
                        ? ''
                        : 'blue-text')
                $('#security-cards-communicator-launch-mobile').attr('href', json.usherMobile);
                $('#security-cards-communicator-launch').attr('href', json.usherMobile);

                if (!isMobile.iOS()) {
                    disabledTooltipForCardButtonAndMobileButton('#security-cards-communicator-file_download', 'iOS devices');
                }

                $('#security-cards-badge-launch-mobile').attr('href', json.usherMobile);
                $('#security-cards-badge-launch').attr('href', json.usherMobile);

                $('#security-cards-badge-file_download-mobile').attr('href',
                    isMobile.any()
                        ? (isMobile.iOS()
                            ? json.badgeIOS
                            : json.badgeAndroid)
                        : 'javascript:void(0)')
                    .addClass(isMobile.any()
                        ? ''
                        : 'grey-text')
                    .removeClass(isMobile.any()
                        ? ''
                        : 'blue-text')
                    .css('cursor', isMobile.any()
                        ? '' :
                        'default');
                $('#security-cards-badge-file_download').attr('href',
                    (isMobile.iOS()
                        ? json.badgeIOS
                        : json.badgeAndroid))
                    .addClass(isMobile.any()
                            ? ''
                            : 'disabled')
                    .children('i')
                    .addClass(isMobile.any()
                        ? ''
                        : 'grey-text')
                    .removeClass(isMobile.any()
                        ? ''
                        : 'blue-text')
                if (!isMobile.any()) {
                    disabledTooltipForCardButtonAndMobileButton('#security-cards-badge-file_download', 'mobile devices');
                }
            } else {
                $("#security").remove();
                $("#security-vnav").remove();
            }
        });
    });
})();
