(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.D3BubbleChartNew) {
        mstrmojo.plugins.D3BubbleChartNew = {};
    }

    // Import the necessary library.
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

	var CUSTOM_DZ_SUFFIX = mstrmojo.vi.models.CustomVisDropZones.CUSTOM_DZ_SUFFIX;
    /**
     * <p>Simple drop zone model for visualization using D3 library</p>
     * <p>Defined the drop zones displayed in drop zone panel.</p>
     * @class mstrmojo.plugins.D3BubbleChart.D3BubbleChartDropZones
     * @extends mstrmojo.vi.models.CustomVisDropZones
     */
    // Declare the visualization drop zones model object
    mstrmojo.plugins.D3BubbleChartNew.D3BubbleChartNewDropZones = mstrmojo.declare(
        // Declare that this code extends CustomVisDropZones
        mstrmojo.vi.models.CustomVisDropZones,

        null,

        {
            // Define the JavaScript class that renders your visualization drop zones.
            scriptClass: 'mstrmojo.plugins.D3BubbleChartNew.D3BubbleChartNewDropZones',

            getCustomDropZones: function getCustomDropZones() {
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;

                return [{
                    name: 'Package',
                    title: mstrmojo.desc(13828, 'Drag attributes here'),
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                    disabled: false
                }, {
                    name: 'Class',
                    title: mstrmojo.desc(13828, 'Drag attributes here'),
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                    disabled: this.getDropZoneObjectsByIndex(0).length === 0 && // Group zone is enabled only if color zone is not empty
                        this.getDropZoneObjectsByIndex(1).length === 0 // And itself is not empty.
                }, {
                    name: 'Size',
                    maxCapacity: 1,
                    isSizeBy: true,
                    useAbsolute: true,
                    title: mstrmojo.desc(13827, 'Drag metrics here'),
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                }, {
                    name: 'Colorby',
                    isColorBy: true,
                    maxCapacity: 2,
                    title: mstrmojo.desc(13828, 'Drag attributes here'),
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE_OR_METRIC
                }, {
                    name: 'Tooltip',
                    isAdditionalInfo: true,
                    title: mstrmojo.desc(13258, 'Drag objects here'),
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE_AND_METRIC
                }];
            },

            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
                var me = this;

                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        switch (zone.n) {
                            case 'Class':
                                return !me.isObjectInZone(object, 'Package'); // Can't have same unit in Package zone.
                        }

                        return true;
                    })
                };
            },

            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {
                var me = this,
                    actions = [];

                switch (this.getDropZoneName(zone)) {
                    case 'Package':
                        // If added to Color, remove it from Group.
                        mstrmojo.array.forEach(droppedObjects, function (object) {
                            // Is this object in group zone?
                            if (me.isObjectInZone(object, 'Class')) {
                                me.getRemoveDropZoneObjectsActions(actions, 'Class', object);
                            }
                        });

                        break;
                    case 'Size':
                        // If added to Size, also add the unit to Tooltip.
                        this.getAddDropZoneObjectsActions(actions, 'Tooltip', droppedObjects, idx, extras);
                        break;
                    case 'Colorby':
                        // If added to Colorby, also add the unit to Tooltip.
                        this.getAddDropZoneObjectsActions(actions, 'Tooltip', droppedObjects, idx, extras);
                        break;
                }

                return actions;
            },
			getDefaultTooltipOrder: function getDefaultTooltipOrder() {

                 return [["Class", "Package", "Tooltip" + CUSTOM_DZ_SUFFIX.ATTRIBUTE ],["Colorby", "Size", "Tooltip" + CUSTOM_DZ_SUFFIX.METRIC]];

},

            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) {
                var actions = [];

                switch (this.getDropZoneName(zone)) {
                    case 'Size':
                        // If removed from Size, also remove it from Tooltip.
                        this.getRemoveDropZoneObjectsActions(actions, 'Tooltip', objects);

                        break;
                    case 'Colorby':
                        // If removed from Colorby, also remove it from Tooltip.
                        this.getRemoveDropZoneObjectsActions(actions, 'Tooltip', objects);

                        break;
                }

                return actions;
            },

            getDefaultThresholdColorsAndBands: function () {
                return {
                    colors: ['#FADDD6', '#EDC1D3', '#BB8FC3', '#7A53AB', '#484C97'],
                    bands: [0.2, 0.4, 0.6, 0.8]
                };

            }
        }
    );
}());
//@ sourceURL=D3BubbleChartDropZones.js
