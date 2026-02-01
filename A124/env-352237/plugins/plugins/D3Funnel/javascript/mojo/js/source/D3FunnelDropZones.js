(function () {
    if (!mstrmojo.plugins.D3Funnel) {
        mstrmojo.plugins.D3Funnel = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.D3Funnel.D3FunnelDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3Funnel.D3FunnelDropZones",
            cssClass: "d3funneldropzones",
            getCustomDropZones: function getCustomDropZones() {
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;
                return [
                    {
                        name: 'Attributes',
                        title: 'Drag attributes here',
                        maxCapacity: 2,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                    }, {
                        name: 'Metric',
                        title: 'Drag metrics here',
                        maxCapacity: 1,
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
//@ sourceURL=D3FunnelDropZones.js