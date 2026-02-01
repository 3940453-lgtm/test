(function () { 
    if (!mstrmojo.plugins.NarrativeScienceNLG) {
        mstrmojo.plugins.NarrativeScienceNLG = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGDropZones",
            cssClass: "narrativesciencenlgdropzones",
            getCustomDropZones: function getCustomDropZones(){
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;
                
                return [
                    {
                        name: 'Attributes',
                        title: mstrmojo.desc(13828, 'Drag attributes here'),
                        maxCapacity: 2,
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                        disabled: false
                    },
                    {
                        name: 'Metrics',
                        title: mstrmojo.desc(13827,'Drag metrics here'),
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                    },
                    {
                        name: 'Drivers',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
                        disabled: this.getDropZoneObjectsByIndex(1).length === 0
                    }
                ];
 },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
                var me = this;
                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        var isMetric = me.isMetric(object);
                        switch (zone.n) {
                            case 'Drivers':
                                return !me.isObjectInZone(object, 'Metrics');
                            case 'Metrics':
                                return !me.isObjectInZone(object, 'Drivers');
                            default: 
                                return true;
                        }
                    })
                }
 








},
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {
 








},
            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) { 
 








},
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {
 








}
})}());
//@ sourceURL=NarrativeScienceNLGDropZones.js