(function () {

    mstrmojo.requiresCls(
        "mstrmojo.hash"
    );

    var  $HASH = mstrmojo.hash;

	mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon = mstrmojo.provide(
        'mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon',

        /**
         * @lends mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon'
         */
        {
            _mixinName: 'mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon',

            render: function render() {
                this.cssText = '';
                this._super();
            },

            updateSingleKPIProps: function updateSingleKPIProps(props, singleKPIModel) {
            	var width = this.width,
                    height = this.height;
            	props.width = parseInt(width) + 'px';
                props.height = parseInt(height) + 'px';

            },

            createSingleKPIs: function createSingleKPIs() {
                var singleKPIModels = this.singleKPIModels,
                	singleKPICnt = singleKPIModels.length,
                    containerNode = this.containerNode,
                    div,
                    children = [],
                    child,
                    props,
                    me = this,
                    i;

                singleKPIModels.forEach(function(singleKPIModel, index) {
                    div = document.createElement('div');
                    containerNode.appendChild(div);

                    props = $HASH.copy(singleKPIModel, {
                        placeholder: div,
                        invertThresholdColor: me.invertThresholdColor
                    });

                    me.updateSingleKPIProps(props, singleKPIModel, singleKPICnt, index);

                    child = new mstrmojo.plugins.SmartKPIWidget.KPISingleMetric(props);
                    child.render();
                    children.push(child);
                });

                this.children = children;
            }
        }
    );
}());
//# sourceURL=mstrmojo.plugins.SmartKPIWidget._DisplayModeCommon.js