(function () {
    mstrmojo.requiresCls(
        "mstrmojo.Container",
        "mstrmojo._HasLayout",
        "mstrmojo.tooltip",
        "mstrmojo.plugins.SmartKPIWidget.KPISingleMetric",
        "mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon"
    );

    mstrmojo.plugins.SmartKPIWidget.StackedKPIWidget = mstrmojo.declare(
        mstrmojo.Container,

        [mstrmojo._HasLayout, mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon],

        /**
         * @lends mstrmojo.Container.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.SmartKPIWidget.StackedKPIWidget',

            cssClass: 'stacked-kpi-container',

            enableAutoPlay: true,

            autoPlayInterval: 3000,

            layoutConfig: {
                w: {
                    containerNode: '100%'
                },
                xt: true
            },

            markupString: '<div class="{@cssClass}" style="{@cssText}" >' +
            '</div>',

            markupSlots: {
                containerNode: function () {
                    return this.domNode;
                }
            },

            markupMethods: {
                onvisibleChange: mstrmojo.Widget.visibleMarkupMethod,
                onenabledChange: mstrmojo.Widget.enabledMarkupMethod
            },

            postBuildRendering: function postBuildRendering() {

                this._super();

                this.createSingleKPIs();


                if (this.singleKPIModels.length > 1) {
                    $('.stacked-kpi-container').not('.slick-initialized').slick({
                        autoplay: this.enableAutoPlay,
                        autoplaySpeed: this.autoPlayInterval,
                        arrows: false,
                        dots: !window.mstrApp.isExporting
                    });
                }


            }
        }
    );
}());
//# sourceURL=StackedKPIWidget.js:
