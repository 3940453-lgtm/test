(function () {
    if (!mstrmojo.plugins.OrgChart) {
        mstrmojo.plugins.OrgChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.OrgChart.OrgChartDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.OrgChart.OrgChartDropZones",
            cssClass: "orgchartdropzones",
            getCustomDropZones: function getCustomDropZones() {
                return [
                    {
                        name: 'Manager',
                        maxCapacity:1,
                        title:'Drag Manager Attribute here ',
                        allowObjectType:1
                    }, {
                        name: 'Employee',
                        maxCapacity:1,
                        title:'Drag Employee Attribute Here',
                        allowObjectType:1
                    }, {
                        name: 'Title',
                        maxCapacity:1,
                        title:'Drag the attribute containing employees’ title here',
                        allowObjectType:1,
                        disabled:'this.getDropZoneObjectsByName("Employee").length === 0'
                    }, {
                        name: 'Metric',
                        maxCapacity:1,
                        title:'Drag any metric here, it will not be used, but it is necessary to render the visualization',
                        allowObjectType:2
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
//@ sourceURL=OrgChartDropZones.js