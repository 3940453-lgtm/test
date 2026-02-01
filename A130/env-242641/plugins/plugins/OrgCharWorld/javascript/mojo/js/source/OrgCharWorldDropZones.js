(function () { 
    if (!mstrmojo.plugins.OrgCharWorld) {
        mstrmojo.plugins.OrgCharWorld = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.OrgCharWorld.OrgCharWorldDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.OrgCharWorld.OrgCharWorldDropZones",
            cssClass: "orgcharworlddropzones",
            getCustomDropZones: function getCustomDropZones(){
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
name: 'Metric', 
maxCapacity:1, 
title:'Drag any metric here, it will not be used, but it is necessary to render the visualization', 
allowObjectType:2
 }
 ];},
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
 
 
                return {allowedItems: dragObjects};






},
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {
 
 







},
            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) { 
  








},
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {
 
 
 
 
 
 
 // Optional: Define the RMC context menu for an object
 
  
 
 
 


            





}
})}());
//@ sourceURL=OrgCharWorldDropZones.js