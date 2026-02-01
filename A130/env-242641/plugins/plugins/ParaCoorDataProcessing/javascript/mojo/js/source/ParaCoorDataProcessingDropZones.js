(function () {
    if (!mstrmojo.plugins.ParaCoorDataProcessing) {
        mstrmojo.plugins.ParaCoorDataProcessing = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.ParaCoorDataProcessing.ParaCoorDataProcessingDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.ParaCoorDataProcessing.ParaCoorDataProcessingDropZones",
            cssClass: "paracoordataprocessingdropzones",
            getCustomDropZones: function getCustomDropZones() {

                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;

                return [
                    {
                        name: 'Color By', // Or any other name
                        title: mstrmojo.desc(13828, 'Drag attributes here'),
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                        isColorBy: true
                    },

                    //{
                    //    name: 'Color',
                    //    title: mstrmojo.desc(13828, 'Drag attributes here'),
                    //    maxCapacity: 1,
                    //    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                    //    disabled: false
                    //}, {
                    //    name: 'Group',
                    //    title: mstrmojo.desc(13828, 'Drag attributes here'),
                    //    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                    //    disabled: this.getDropZoneObjectsByIndex(0).length === 0 // Group zone is enabled only if Color zone is not empty.
                    //},
                    {
                        name: 'Metrics',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        minCapacity: 1,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                    }
                    //, {
                    //    name: 'Tooltip',
                    //    title: mstrmojo.desc(13827, 'Drag metrics here'),
                    //    allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                    //}
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
//@ sourceURL=ParaCoorDataProcessingDropZones.js