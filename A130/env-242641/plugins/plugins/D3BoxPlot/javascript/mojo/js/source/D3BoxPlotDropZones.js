(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.D3BoxPlot) {
        mstrmojo.plugins.D3BoxPlot = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    var ZONE_ATTRIBUTES = 'Attributes',
        ZONE_METRIC = 'Metric',
        ZONE_OUTLIER = 'Display Outliers';
    ZONE_OUTLIER_OMIT = 'Omit Outliers';

    mstrmojo.plugins.D3BoxPlot.D3BoxPlotDropZones = mstrmojo.declare(
        //Declare that this code extends CustomVisDropZones
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            // Define the JavaScript class that renders your visualization drop zones.
            scriptClass: 'mstrmojo.plugins.D3BoxPlot.D3BoxPlotDropZones',
            getCustomDropZones: function getCustomDropZones() {

                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;

                // Fill the zones’ definition here.
                return [{
                    name: ZONE_ATTRIBUTES,
                    title: mstrmojo.desc(13828, 'Drag attributes here'),
                    maxCapacity: 2,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                }, {
                    name: ZONE_METRIC,
                    title: 'Drag metric here for quartile calculations',
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                }, {
                    name: ZONE_OUTLIER,
                    title: 'Drag metric here to toggle outlier display',
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
                    disabled: this.getDropZoneObjectsByIndex(3).length === 1
                }, {
                    name: ZONE_OUTLIER_OMIT,
                    title: 'Drag metric here to omit outliers from calculations',
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
                    disabled: this.getDropZoneObjectsByIndex(2).length === 1
                }];
            },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
                var me = this;
                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        switch (zone.n) {
                            case ZONE_OUTLIER:
                                return me.isObjectInZone(object, ZONE_METRIC);  //ensure same metric is in outlier and metric zone

                            case ZONE_OUTLIER_OMIT:
                                return me.isObjectInZone(object, ZONE_METRIC);  //ensure same metric is in outlier and metric zone
                        }
                        return true;
                    })
                };
            }, getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, Objects) {
            var me = this;
            var actions = [];
            switch (this.getDropZoneName(zone)) {
                case ZONE_METRIC:
                    this.getRemoveDropZoneObjectsActions(actions, 'Display Outliers', Objects);
                    this.getRemoveDropZoneObjectsActions(actions, 'Omit Outliers', Objects);
                    break;
            }
            return actions;
        }
        }
    );
}());