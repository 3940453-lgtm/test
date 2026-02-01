(function () { 
    if (!mstrmojo.plugins.ImageOverlay) {
        mstrmojo.plugins.ImageOverlay = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.plugins.ImageOverlay.ImageOverlay" ,         
        "mstrmojo.array"
    );
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE ; 
    mstrmojo.plugins.ImageOverlay.ImageOverlayEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.ImageOverlay.ImageOverlayEditorModel",
            cssClass: "ImageOverlayeditormodel",
            getCustomProperty: function getCustomProperty(){

                  return [
                {
                    name :  mstrmojo.desc("ImageOverlay.1" ,"Configuration").replace(/^\[+|\]+$/g , "")  , 
                    value : [
                        //{propertyName : "centerPosition2"}, {propertyName : "centerPosition"}, {propertyName : "zoomLevel"}, 
                        {
                            style: $WT.EDITORGROUP,
                            items: [
                             
                            {
                            style: $WT.TWOCOLUMN,
                            items: [{
                                style: $WT.LABEL,
                                name: "text", 
                                width: "35%",
                                labelText:  mstrmojo.desc("ImageOverlay.2" ,"Shape Color").replace(/^\[+|\]+$/g , "")  
                                }, {
                                    style: $WT.FILLGROUP,
                                    width: "65%",
                                    propertyName: "fillColor",
                                    items: [{
                                        childName: "fillAlpha",
                                        disabled: false 
                                    }]
                                }]
                            } , 
                            {
                                style: $WT.TWOCOLUMN,
                                items: [{
                                    style: $WT.LABEL,
                                    name: "text", 
                                    width: "35%",
                                    labelText:  mstrmojo.desc("ImageOverlay.25" ,"Background").replace(/^\[+|\]+$/g , "")  
                                    }, {
                                        style: $WT.FILLGROUP,
                                        width: "65%",
                                        propertyName: "mapBackColor",
                                        items: [{
                                            childName: "fillAlpha",
                                            disabled: false 
                                        }]
                                    }]
                             }                            
                            , 
                            {
                                style: $WT.TWOCOLUMN,
                                items: [{
                                    style: $WT.LABEL,
                                    name: "text",
                                    width: "25%",
                                    labelText: mstrmojo.desc("ImageOverlay.3" ,"Border").replace(/^\[+|\]+$/g , "")  
                                }, {
                                    style: $WT.LINEGROUP,
                                    width: "75%",
                                    propertyName: "borderColor"
                                }]
                            } // border Color                                                          
                            , 
                            {
                                style: $WT.TWOCOLUMN, 
                                width : "50%" ,
                                    items: [{
                                        style: $WT.LABEL,
                                        name: "text",
                                        width: "70%",
                                        labelText: mstrmojo.desc("ImageOverlay.32" ,"Line Thickness").replace(/^\[+|\]+$/g , "")  
                                    }, {
                                        style: $WT.STEPPER,
                                        width: "30%",
                                        propertyName: "linethickness" ,
                                        min : 1 , max : 10 
                                    }]      
                            },                            
                            {
                            style: $WT.TWOCOLUMN,
                            items: [{
                                style: $WT.LABEL,
                                name: "text", 
                                width: "35%",
                                labelText: mstrmojo.desc("ImageOverlay.4" ,"Type").replace(/^\[+|\]+$/g , "")  
                                }, {
                                    style: $WT.PULLDOWN,
                                    width: "65%",
                                    propertyName: "displaymode",
                                    items: [
                                        {name : mstrmojo.desc("ImageOverlay.7" ,"Region").replace(/^\[+|\]+$/g , "")  , value : "region"} , 
                                        {name : mstrmojo.desc("ImageOverlay.22" ,"Point").replace(/^\[+|\]+$/g , "")  ,value:"point" } , 
                                        {name : mstrmojo.desc("ImageOverlay.5" ,"Bubble").replace(/^\[+|\]+$/g , "")  ,value:"bubble" }
                                    ]   
                                }]
                            } // end of displaymode 
                             ,  
                            {
                            style: $WT.TWOCOLUMN, 
                            width : "50%" ,
                                items: [{
                                    style: $WT.LABEL,
                                    name: "text",
                                    width: "70%",
                                    labelText: mstrmojo.desc("ImageOverlay.8" ,"Minimum Size").replace(/^\[+|\]+$/g , "")  
                                }, {
                                    style: $WT.STEPPER,
                                    width: "30%",
                                    propertyName: "bubblemin" ,
                                    min : 5 , max : 99  
                                }]      
                            },
                            {
                            style: $WT.TWOCOLUMN,
                            width : "50%" ,
                                items: [{
                                    style: $WT.LABEL,
                                    name: "text",
                                    width: "70%",
                                    labelText: mstrmojo.desc("ImageOverlay.9" ,"Maximum Size").replace(/^\[+|\]+$/g , "")  
                                }, {
                                    style: $WT.STEPPER,
                                    width: "30%",
                                    propertyName: "bubblemax" , 
                                    min : 5 , max : 100 ,                                     
                                    disabled : (this.getHost().getProperty('displaymode') === "region" || this.getHost().getProperty('displaymode') === "point" )
                                }]      
                            },
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'hideUnmatched',
                                labelText: mstrmojo.desc("ImageOverlay.28" ,"Hide unmatched shape").replace(/^\[+|\]+$/g , "")  
                            } ,
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'multiselect',
                                labelText: mstrmojo.desc("ImageOverlay.29" ,"Allow Multiselect").replace(/^\[+|\]+$/g , "")  
                            } ,
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'repeatMode',
                                labelText: mstrmojo.desc("ImageOverlay.30" ,"Drawing Repeat Mode").replace(/^\[+|\]+$/g , "")  
                            } ,
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'groupControl',
                                labelText: mstrmojo.desc("ImageOverlay.33" ,"View Single Layer Control").replace(/^\[+|\]+$/g , "")  
                            } ,
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'collapseControl',
                                labelText: mstrmojo.desc("ImageOverlay.34" ,"Collapse Layer Control").replace(/^\[+|\]+$/g , "")  
                            },                            
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'ptHideControl',
                                labelText: mstrmojo.desc("ImageOverlay.35" ,"Hide Control in Presentation").replace(/^\[+|\]+$/g , "")  
                            },     
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'ptZoomControl',
                                labelText: mstrmojo.desc("ImageOverlay.36" ,"Disable Scroll Zoom").replace(/^\[+|\]+$/g , "")  
                            },                          
                            {
                            style: $WT.TWOCOLUMN,
                            width : "50%" ,
                                items: [{
                                    style: $WT.LABEL,
                                    name: "text",
                                    width: "50%",
                                    labelText: mstrmojo.desc("ImageOverlay.14" ,"Zoom").replace(/^\[+|\]+$/g , "")  
                                }, {
                                    style: $WT.PULLDOWN,
                                    width: "50%",
                                    propertyName: "fitview", 
                                    // disabled : this.getHost().getProperty('displaymode') !== "region" , 
                                    items: [
                                        {name : mstrmojo.desc("ImageOverlay.16" ,"Auto Fit").replace(/^\[+|\]+$/g , "")  ,value:"autofit" }   , 
                                        {name : mstrmojo.desc("ImageOverlay.15" ,"Static").replace(/^\[+|\]+$/g , "")  ,value:"static" }  
                                    ]  
                                }]      
                            }, 
                            {  
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'showlegend',
                                labelText: mstrmojo.desc("ImageOverlay.23" ,"Show Legend").replace(/^\[+|\]+$/g , "")  
                            } ,  
                         
                            {
                                style: $WT.TWOCOLUMN,
                                width : "50%" ,
                                    items: [{
                                        style: $WT.LABEL,
                                        name: "text",
                                        width: "50%",
                                        labelText: mstrmojo.desc("ImageOverlay.24" ,"Legend Format").replace(/^\[+|\]+$/g , "")  
                                    }, {
                                        style: $WT.PULLDOWN,
                                        width: "50%",
                                        propertyName: "legendformat", 
                                        // disabled : this.getHost().getProperty('displaymode') !== "region" , 
                                        items: [
                                            {name : mstrmojo.desc("ImageOverlay.27" ,"%").replace(/^\[+|\]+$/g , "")  ,value:"percent" }  ,
                                            {name : mstrmojo.desc("ImageOverlay.26" ,"Number").replace(/^\[+|\]+$/g , "")  ,value:"number" }
                                        ]  
                                    }] ,
                                    disabled : this.getHost().getProperty('showlegend') == "false" , 
                                }  
                                
                            ]
                    }
                    ,
                    {
                        style: $WT.EDITORGROUP,
                        items: [
                            {
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: mstrmojo.desc("ImageOverlay.17" ,"Data Lable").replace(/^\[+|\]+$/g , "")  
                            }, 
                            {
                                style: $WT.BUTTONBAR,
                                propertyName: "dataLabel",
                                items: [
                                  {
                                   labelText: mstrmojo.desc("ImageOverlay.18" ,"Lable").replace(/^\[+|\]+$/g , "")  ,
                                   width : "50%" , 
                                   propertyName: "N"
                                  },
                                  {
                                    labelText: mstrmojo.desc("ImageOverlay.19" ,"Value").replace(/^\[+|\]+$/g , "")  ,
                                    width : "50%" , 
                                    propertyName: "V"
                                  }
                                ],
                                multiSelect:true  
                              }, 
                              {
	                            style: $WT.CHECKBOXANDLABEL,
	                            propertyName: 'hideCollision',
	                            labelText: mstrmojo.desc("ImageOverlay.20" ,"Hide Overlap Label").replace(/^\[+|\]+$/g , "")  
	                        }                                                     
                        ]
                }
                ,{ 
                    style: $WT.EDITORGROUP,
                    items: [{
                        style: $WT.LABEL,
                        name: "text",
                        width: "100%",
                        labelText: mstrmojo.desc("ImageOverlay.21" ,"Lable Format").replace(/^\[+|\]+$/g , "")  
                    }, {
                        style: $WT.CHARACTERGROUP,
                        propertyName: 'labelfont',
                        items: [{
                            childName: 'fontSize'
                        }] ,
                         disabled : this.getHost().getProperty('dataLabel') ? (this.getHost().getProperty('dataLabel').N === "false" && this.getHost().getProperty('dataLabel').V === "false") : false                        
                    }, 
                    {
                      style: $WT.CHECKBOXANDLABEL,
                      propertyName: 'whiteoutline',
                      labelText: mstrmojo.desc("ImageOverlay.37" ,"Lable White Outline Effect").replace(/^\[+|\]+$/g , "")    
                    } ]
                } 
                    ]
                } // end of configuration 
                  ] ;

}
})}());
//@ sourceURL=ImageOverlayEditorModel.js