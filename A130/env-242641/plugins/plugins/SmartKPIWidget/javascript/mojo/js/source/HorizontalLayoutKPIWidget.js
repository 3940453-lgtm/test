(function () {
    mstrmojo.requiresCls(
        "mstrmojo.Container",
        "mstrmojo._HasLayout",
        "mstrmojo.tooltip",
        "mstrmojo.plugins.SmartKPIWidget.KPISingleMetric",
        "mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon"
    );

    mstrmojo.plugins.SmartKPIWidget.HorizontalLayoutKPIWidget = mstrmojo.declare(
        mstrmojo.Container,

        [mstrmojo._HasLayout, mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon],

        /**
         * @lends mstrmojo.Container.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.SmartKPIWidget.HorizontalLayoutKPIWidget',

            cssClass: 'horizontal-kpi-container',

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
                var width = Math.floor(parseFloat(this.width)/singleKPICnt),
                    height = parseFloat(this.height),
                    cnt = parseFloat(this.width) - width * singleKPICnt;

                props.width = ((cnt > singleKPIIndex ? 1 : 0) + width) + 'px';
                props.height = height + 'px';

            }



        }


    );
}());
//# sourceURL=HorizontalLayoutKPIWidget.js:
