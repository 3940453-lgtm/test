(function () {
    mstrmojo.requiresCls(
        "mstrmojo.Container",
        "mstrmojo._HasLayout",
        "mstrmojo.tooltip",
        "mstrmojo.plugins.SmartKPIWidget.KPISingleMetric",
        "mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon"
    );

    mstrmojo.plugins.SmartKPIWidget.VerticalLayoutKPIWidget = mstrmojo.declare(
        mstrmojo.Container,

        [mstrmojo._HasLayout, mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon],

        /**
         * @lends mstrmojo.Container.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.SmartKPIWidget.VerticalLayoutKPIWidget',

            cssClass: 'vertical-kpi-container',

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

            postBuildRendering: function postBuildRendering() {

                this._super();

                this.domNode.style.display = '';

                this.createSingleKPIs();

            },

            updateSingleKPIProps: function updateSingleKPIProps(props, singleKPIModel, singleKPICnt, singleKPIIndex) {
                var width = parseFloat(this.width),
                    height = Math.floor(parseFloat(this.height)/singleKPICnt),
                    cnt = parseFloat(this.height) - height * singleKPICnt;

                props.width = width + 'px';
                props.height = ((cnt > singleKPIIndex ? 1 : 0) + height) + 'px';

            }

        }


    );
}());
//# sourceURL=VerticalLayoutKPIWidget.js:
