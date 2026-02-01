(function () {
    if (!mstrmojo.plugins.BulletChart) {
        mstrmojo.plugins.BulletChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.BulletChart.BulletChartDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.BulletChart.BulletChartDropZones",
            cssClass: "bulletchartdropzones",
            getCustomDropZones: function getCustomDropZones() {

                return [
                    {
                        name: 'Category',
                        title: mstrmojo.desc(13828, 'Drag attributes here'),
                        //maxCapacity: ,
                        allowObjectType: 1,
                        disabled: false
                    },
                    {
                        name: 'Actual',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        maxCapacity: 1,
                        allowObjectType: 2,
                        disabled: false
                    },
                    {
                        name: 'Target',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        maxCapacity: 1,
                        allowObjectType: 2,
                        disabled: false/*this.getDropZoneObjectsByIndex(1).length === 0 && // Group zone is enabled only if color zone is not empty
                     this.getDropZoneObjectsByIndex(2).length === 0    // And itself is not empty.*/
                    },
                    {
                        name: 'Range',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        maxCapacity: 3,
                        allowObjectType: 2,
                        disabled: false/*this.getDropZoneObjectsByIndex(1).length === 0 && // Group zone is enabled only if color zone is not empty
                     this.getDropZoneObjectsByIndex(3).length === 0    // And itself is not empty.*/
                    },
                    {
                        name: 'KPI',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        //maxCapacity: 3,
                        allowObjectType: 2,
                        disabled: false
                    }
                ];

            },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {

                var me = this;

                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        /*switch(zone.n) {
                         case 'Class':
                         return !me.isObjectInZone(object, 'Package');   // Can't have same unit in Package zone.
                         }*/

                        return true;
                    })
                };


            },
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {

                var me = this,
                    actions = [];

                return actions;
            },

            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) {


            },
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {

                // Add threshold menu option to size zone.

                //TODO: for now remove threshold for world, will resume later
                /*  var zoneName = this.getDropZoneName(zone);
                 if (zoneName === 'Actual' || zoneName === "KPI") {
                 cfg.addSeparator();
                 this.buildThresholdMenuOptions(cfg, {item: object}, true);
                 }*/


            }
        })
}());
