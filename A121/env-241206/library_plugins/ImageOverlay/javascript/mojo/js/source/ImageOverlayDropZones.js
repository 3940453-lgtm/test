(function () { 
    if (!mstrmojo.plugins.ImageOverlay) {
        mstrmojo.plugins.ImageOverlay = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.ImageOverlay.ImageOverlayDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.ImageOverlay.ImageOverlayDropZones",
            cssClass: "ImageOverlaydropzones",
            getCustomDropZones: function getCustomDropZones(){
  return [ 
 { 
name: 'Shape Attributes' , 
title: mstrmojo.desc(13828, 'Drag attributes here'), 
maxCapacity: 1,
allowObjectType:1
 },  
 { 
    name: 'Group Attributes' , 
    title: mstrmojo.desc(13828, 'Drag attributes here'), 
     maxCapacity: 1,
    allowObjectType:1
}, 
{ 
name: 'Overlay Image Path' , 
title: mstrmojo.desc(13828, 'Drag attributes here'), 
maxCapacity: 1,
allowObjectType:1
},  
     { 
name: mstrmojo.desc(517, 'Metric'), 
title: mstrmojo.desc(13827, 'Drag metric here'), 
allowObjectType:2
 }
 ];},     
})}());
//@ sourceURL=ImageOverlayDropZones.js