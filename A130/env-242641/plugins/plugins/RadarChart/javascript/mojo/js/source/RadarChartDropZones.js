(function () {
    if (!mstrmojo.plugins.RadarChart) {
        mstrmojo.plugins.RadarChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    //this will pre-load the descriptions
    mstrmojo.requiresDescs(13827, 13828);
    mstrmojo.plugins.RadarChart.RadarChartDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.RadarChart.RadarChartDropZones",
            cssClass: "radarchartdropzones",
            getCustomDropZones: function getCustomDropZones() {

                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;

                return [
                    {
                        name: 'Attributes',
                        title: mstrmojo.desc(13828, 'Drag parent attribute here'),
                        maxCapacity: 1,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                    }, {
                        name: 'Metrics',
                        title: mstrmojo.desc(13827, 'Drag metric here'),
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                    }
                ];
            },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
                return {allowedItems: dragObjects};


            },
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {


            },
            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) {


            },
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {


            }
        })
}());
//@ sourceURL=RadarChartDropZones.js