(function () {
    if (!mstrmojo.plugins.GoogleSankey) {
        mstrmojo.plugins.GoogleSankey = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.GoogleSankey.GoogleSankeyDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleSankey.GoogleSankeyDropZones",
            cssClass: "googlesankeydropzones",
            getCustomDropZones: function getCustomDropZones() {
                return [
                    {
                        name: 'Source',
                        maxCapacity: 1,
                        title: 'Drag attributes here',
                        allowObjectType: 1
                    }, {
                        name: 'Target',
                        maxCapacity: 1,
                        title: 'Drag attributes here',
                        allowObjectType: 1
                    }, {
                        name: 'Metric',
                        maxCapacity: 1,
                        title: 'Drag attributes here',
                        allowObjectType: 2
                    }
                ];
            },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {

                var me = this;
                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        return true;
                    })
                };


            },
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {


            },
            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) {


            },
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {


            }
        })
}());
//@ sourceURL=GoogleSankeyDropZones.js