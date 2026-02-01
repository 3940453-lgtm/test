(function () {
    if (!mstrmojo.plugins.CircularTreeMap) {
        mstrmojo.plugins.CircularTreeMap = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.CircularTreeMap.CircularTreeMapDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.CircularTreeMap.CircularTreeMapDropZones",
            cssClass: "circulartreemapdropzones",
            getCustomDropZones: function getCustomDropZones() {
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;
                return [
                    {
                        name: 'Attributes',
                        title: mstrmojo.desc(13828, 'Drag attributes here'),
                        maxCapacity: 5,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                    }, {
                        name: 'Metric',
                        title: mstrmojo.desc(13827, 'Drag metric here'),
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