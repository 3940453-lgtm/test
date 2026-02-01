(function () { 
    if (!mstrmojo.plugins.ImageOverlay) {
        mstrmojo.plugins.ImageOverlay = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );

	var $VISUTIL = mstrmojo.VisUtility ; 

	var $pluginName = "ImageOverlay"  ; 
	var isApp = window.webkit ? true  : false ; 
	var libPath = ((mstrApp.getPluginsRoot && mstrApp.getPluginsRoot()) || "../plugins/") + $pluginName + '/lib/'  ;   
	// {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins/") + "D3WordCloud/javascript/mojo/js/source/d3.layout.cloud.js"}
	var d3Path = libPath + "d3.v4.min.js" ;  
	var leafletJS = libPath + "leaflet.js" ;  
	var d3LibFile = isApp ? "//d3js.org/d3.v4.min.js" : d3Path ; 


    var isApp = window.webkit ? true  : false ; 
    var isMobile = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString ? true : false  ;
    var isPresentation = false ; 

	Number.isInteger = Number.isInteger || function(value) {
		return typeof value === "number" &&
			   isFinite(value) &&
			   Math.floor(value) === value;
	};

	function isTrue(value) {
			return value === 'true' || value === true ? true : false;
	}; 

    mstrmojo.plugins.ImageOverlay.ImageOverlay = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.ImageOverlay.ImageOverlay",
            cssClass: "ImageOverlay",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires at least one attribute for shape and one metric ",
			externalLibraries: [
				{url:(mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || '../plugins/') +  'ImageOverlay/javascript/mojo/js/source/d3.v4.min.js'}, 
				{url:(mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || '../plugins/') +  'ImageOverlay/javascript/mojo/js/source/leaflet.js' },
				{url:(mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || '../plugins/') +  'ImageOverlay/javascript/mojo/js/source/leaflet.draw.js'},
				{url:(mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || '../plugins/') +  'ImageOverlay/javascript/mojo/js/source/easy-button.js'}], 
			useRichTooltip: false,
            supportNEE: true,
			reuseDOMNode: false, 
			draggable: false,
			getFontStyle: function getFontStyle(styleName) {
				var fontStyle = {}; 
				var fontProps = this.getProperty(styleName) ;
				fontStyle.fontFamily = fontProps.fontFamily;
				fontStyle.fontColor = fontProps.fontColor ; 
				fontStyle.fontSize = fontProps.fontSize ; 
                fontStyle.fontStyle = isTrue(fontProps.fontItalic) ? 'italic' : 'normal';
                fontStyle.fontWeight = isTrue(fontProps.fontWeight) ? 'bold' : 'normal';
                fontStyle.textDecoration = "";
                if (isTrue(fontProps.fontUnderline)) {
                    fontStyle.textDecoration += ' underline';
                }

                if (isTrue(fontProps.fontLineThrough)) {
                    fontStyle.textDecoration += ' line-through';
                }

                if (fontStyle.textDecoration === "") {
                    fontStyle.textDecoration = "none";
                }                
				return fontStyle ; 
			} , 

            plot:function(){
			
            this.addUseAsFilterMenuItem();
            this.addThresholdMenuItem();  // Threshold 
            var DIModel =  new mstrmojo.models.template.DataInterface(this.model.data) ; 
			var rawData , treeData; 
			var bMin = 10  , bMax = 30 ; 
			var centerLatLng = [0,0] ;
			var lineType = mstrmojo.vi.models.editors.CustomVisEditorModel.ENUM_LINE_STYLE ; 				
			this.setDefaultPropertyValues (  
			 {	 
				fillColor : {fillColor:"#1F77B4" , fillAlpha : 70} , 
				mapBackColor :{fillColor:"#FFFFFF" , fillAlpha : 100}  , 
                displaymode : "region"  ,
                bubblemin : 10 , 
                bubblemax : 20 , 
				fitview : "autofit" , 
				labelfont: { fontSize: '10pt', fontFamily: 'Open Sans',  fontWeight : 'false' ,  fontColor: '#202020' }   ,
				dataLabel : {N:'false', V:'false' }  , 
				hideCollision : 'true' , 
				zoomLevel : 0  , 
				centerPosition : {lat : centerLatLng[0] , lng : centerLatLng[1]}  , 
				borderColor : {lineColor: "#808080" , lineStyle : lineType.NONE }  , 
				OverlayJson : '{}'  , 
				showlegend : 'true' ,  
				legendformat : 'percent' , 
				propCurrentMapGroup : '' , 
				hideUnmatched : 'false' , 
				multiselect : 'false' , 
				repeatMode : 'false' , 
				linethickness : "4" , 
				groupControl : 'false' , 
				collapseControl : 'true'   , 
				whiteoutline : 'true' , 
				ptHideControl : 'false' , 
				ptZoomControl : 'false'
			 });
			 // Read Properties
			var OverlayJson = this.getProperty("OverlayJson")
			var fillColor = this.getProperty("fillColor") ;//fillColor , fillAlpha  
			var fillOpacity = parseInt(fillColor.fillAlpha) / 100  
			var mapBackColor = this.getProperty("mapBackColor") ;//fillColor , fillAlpha  
			var mapfillOpacity = parseInt(mapBackColor.fillAlpha) ;  
			var selectedOpacity = parseFloat(fillOpacity/3*2) ; 
            var displaymode =this.getProperty("displaymode") ; 
            var bubblemin    =this.getProperty("bubblemin") ;  
            var bubblemax   =this.getProperty("bubblemax") ; 
			var fitview = this.getProperty("fitview") ; 
			var dataLabel = this.getProperty("dataLabel") ; 
			var fontLabel = this.getFontStyle("labelfont");  
			var zoomLevel = this.getProperty("zoomLevel") ;
			var hideCollision = isTrue (this.getProperty("hideCollision")) ; 
			var centerPosition = this.getProperty("centerPosition") ; 
			var borderColor =  this.getProperty("borderColor").lineColor ;  
			var showlegend  =   isTrue (this.getProperty("showlegend")) ;  
			var legendformat = this.getProperty("legendformat") ;  
			var propCurrentMapGroup = this.getProperty("propCurrentMapGroup") ;  
			var hideUnmatched = isTrue (this.getProperty("hideUnmatched")) ; 
			var multiselect = isTrue (this.getProperty("multiselect")) ; 
			var repeatMode = isTrue (this.getProperty("repeatMode")) ; 		
			var linethickness = this.getProperty("linethickness") ; 
			var groupControl = isTrue (this.getProperty("groupControl")) ;
			var collapseControl = isTrue (this.getProperty("collapseControl")) ;
			var whiteoutline = isTrue (this.getProperty("whiteoutline")) ;
			var ptHideControl = isTrue (this.getProperty("ptHideControl")) ; 
			var ptZoomControl = isTrue (this.getProperty("ptZoomControl")) ; 
			
			var isUserAction = true  ;
			var borderStyle = {} ;
			switch (parseInt (this.getProperty("borderColor").lineStyle)) {
				case lineType.NONE : 				
					borderStyle = {width : 0 ,dasharray  : 0  };  break ;				
				case lineType.THIN : 
					borderStyle = {width : 1 ,dasharray  : 0  };  break ;				
				case lineType.DASHED : 
					borderStyle = {width : 1 ,dasharray  : 2  };  break ;
				case lineType.DOTTED : 
					borderStyle = {width : 1 ,dasharray  : 1  };  break ;				
				case lineType.THICK : 
					borderStyle = {width : 2 ,dasharray  : 0  };  break ;				
			}
			var hideZoomControl = false ; 
			if (isMobile) { isPresentation = true }
			else if (mstrApp.isExporting) {
				isPresentation = true ;     
			} 
			else {
				isPresentation = mstrApp.isAppStatePresentation() ;
			}
			if (isPresentation && ptHideControl ) {
				hideZoomControl = true ; 
			}
		
		
    	    var me = this ; 
            var divWidth = parseInt ( me.width)  , divHeight =parseInt( me.height)  ; 
			var divId = "div" + this.k ;
			var data= [];   

			var loadedGeoJson , maploadedGeoJson = {} ; 
			var viewcenter , isFitView = fitview == "autofit"  ? false  : true  ; 
			if ( isFitView) {
				viewcenter = [centerPosition.lat , centerPosition.lng] ;
			} 
			else {
				viewcenter = [divHeight/2 , divWidth /2 ] ;
				zoomLevel=0;
			}


			var groupGeoJson = {} ; 
			var geoCollection = {
			   "type": "FeatureCollection",
			   "features": []
			   }; 			


			var nullGeoJson = '{"type": "FeatureCollection","features": []}'  ; 


			var EmptyImgUrl = libPath + "empty.png" ; 
			EmptyImgUrl = "blank" ; 
			var isEditMode = false ; 
			var layerStyleDefault = { color : borderColor   , /* "weight" : borderStyle.width ,  */"opacity" : fillOpacity , "fillOpacity" : 0.3 , dashArray : borderStyle.dasharray  } ;
			var layerStyleSelected = { /* "weight" : 2 , */ "opacity" : 1 , "fillOpacity" : selectedOpacity ,dashArray :"3,3" } ;
			var layerStyleEditStart = { maintainColor: true, color : "#3388ff"  , "weight" : 2 , "opacity" : 0.6 , "fillOpacity" : 0.3 , dashArray : 3  }   ;

			var DI = this.dataInterface ;

			// Drop Zone Attrubites
			// this.zonesModel.getDropZoneObjectsByIndex(0)[0] && this.zonesModel.getDropZoneObjectsByIndex(0)[0].id
			var groupAttribute = this.zonesModel && this.zonesModel.getDropZoneObjectsByName("Group Attributes")  ; 
			var ShapeAttribute = this.zonesModel && this.zonesModel.getDropZoneObjectsByName("Shape Attributes")  ;
			var ImagePathAttribute = this.zonesModel && this.zonesModel.getDropZoneObjectsByName("Overlay Image Path")  ;  

			// Check Metric Count and Attribute Count  
			if ( DI.getTotalCols() == 0 || !ShapeAttribute.length) {
				return ;
			}

            rawData =   this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV,
									{ hasTitleName: true  , hasSelection:true , hasThreshold: true});  
			
            var headerCnt = rawData[0].headers.length  ; 
			var metricCnt = rawData[0].values.length  ; 


			// Find image attribute position
			var ImagePathAttributeIndex  = -1 , groupAttributeIndex = -1  ,  shapeAttributeFormsCnt = 1 ; 
			var headerNames = [] , headerNamesIndex = [] ;

			// finding attribute index of header and header Information   
			for ( i=0 ; i < DIModel.getRowTitles().size() ; i++ ) {
				if ( ShapeAttribute && ShapeAttribute.length  && DIModel.getRowTitles().getTitle(i).title.id  == ShapeAttribute[0].id  ){
					ShapeAttributeIndex   = i ; 
					shapeAttributeFormsCnt = DIModel.getRowTitles().getTitle(ShapeAttributeIndex).getForms().length  ; 
					for (j=i ; j<DIModel.getRowTitles().getTitle(ShapeAttributeIndex).getForms().length ; j++ ) {
						headerNamesIndex.push (j);
					}
					continue ; 
				} 
			}

			for ( i =0  ; i< DIModel.getRowHeaders(0).headers.length   ; i++) {
				if ( ImagePathAttribute && ImagePathAttribute.length  && DIModel.getRowHeaders(0).getHeader(i).t.id   == ImagePathAttribute[0].id  ){
					ImagePathAttributeIndex   = i ; 
				} 
				if ( groupAttribute && groupAttribute.length  && DIModel.getRowHeaders(0).getHeader(i).t.id  == groupAttribute[0].id  ){
					groupAttributeIndex   = i ; 
				} 
			}			
			
			for ( i =0  ; i< DIModel.getRowTitles().titles.length    ; i++) { 
				if ( DIModel.getRowTitles().getTitle(i).getForms().length  == 1 ) {						
					headerNames.push (DIModel.getRowTitles().getTitle(i).getName() ) ;					 
				}
				else {
					for (j=0 ; j< DIModel.getRowTitles().getTitle(i).getForms().length  ; j ++ ) {
						headerNames.push ( DIModel.getRowTitles().getTitle(i).getName() + " " + DIModel.getRowTitles().getTitle(i).getForms()[j].n ) ;
					} 	
				}
			}			


			/* Parse Group and Images */ 
			for ( i =0 , gIndex = 0 ; i< DIModel.getTotalRows()  ; i++) {
				var tmpGroup = "" , tmpImage = "" ;
				tmpImage = ImagePathAttributeIndex!=-1 ?   DIModel.getRowHeaders(i).getHeader(ImagePathAttributeIndex).getName() : EmptyImgUrl ;  
				tmpGroup = groupAttributeIndex!=-1 ?   DIModel.getRowHeaders(i).getHeader(groupAttributeIndex).getName() : "" ;  
				if (tmpGroup == "") {
					tmpGroup =  tmpImage != "" ? tmpImage.split('/')[tmpImage.split('/').length-1].split('.')[0] : ""; 
				}				
				if (!groupGeoJson.hasOwnProperty(tmpGroup)) {
					groupGeoJson[tmpGroup]  = {imagePath : tmpImage}  ; 
				}
				// console.log(groupGeoJson) ;				
			} 
			
			// Setting group Geo Json from Property
			loadedGeoJson = JSON.parse (OverlayJson) ; 
			function assignToGroupJson(){
				for (key in groupGeoJson  ) {				
					if (loadedGeoJson.hasOwnProperty(key)) {
						groupGeoJson[key].geoJson = loadedGeoJson[key] ; 
					}
					else {
						groupGeoJson[key].geoJson = geoCollection ; 
					}
				}
			}; 

			assignToGroupJson () ; 
		 
            rawData.forEach(function(c) {
	        	var dHeaders = c.headers , dMetrics = c.values ;         	
	        	var tmpData = {} , tmpGroup = {} , tmpLabel = ""; 
				// process Header Data.  
 	        	tmpData.node = [] ;
	        	for (i=0 ; i<headerCnt  ; i++)
	        	{
					// tmpData.node.push ({nodeName:dHeaders[i].tname , nodeValue:dHeaders[i].name , attributeSelector : dHeaders[i].attributeSelector}) ;					
					tmpData.node.push ({nodeName:headerNames[i] , nodeValue:dHeaders[i].name , attributeSelector : dHeaders[i].attributeSelector}) ;					
				} 
				for ( j=headerNamesIndex[0] ;j <= headerNamesIndex[headerNamesIndex.length-1] ; j++) {
					tmpLabel += ( j == 0  ?  "" : " , ")  + dHeaders[j].name ;
				}
				tmpData.labelName = tmpLabel ; 
				
				var tmpImagePath =dHeaders[ImagePathAttributeIndex]  &&  dHeaders[ImagePathAttributeIndex].name ?  dHeaders[ImagePathAttributeIndex].name :  EmptyImgUrl ;
				if (groupAttributeIndex>-1)   { // Group Attributes exists..   
					if (!groupGeoJson.hasOwnProperty(dHeaders[groupAttributeIndex].name)) {
						groupGeoJson[dHeaders[groupAttributeIndex].name]  = tmpImagePath ; 
					}
				 }
				// headers
	        	tmpData.colorInfo = c.colorInfo ; 
				// Process Metric Data 
				tmpData.metrics= [] ; 
	        	for (i=0 ; i<metricCnt ; i++)
	        	{
	        		tmpData.metrics.push ({metricName:dMetrics[i].name , metricValue:dMetrics[i].v , metricRValue:dMetrics[i].rv , 
	        			metricColor : (dMetrics[i].threshold) ? dMetrics[i].threshold.fillColor : undefined }) ;
				}
	        	data.push (tmpData) ;
		        });
			
            var selectorData =[]; 
			bMin =   bubblemin; bMax =   bubblemax;
			if (displaymode == "region") { 
				bMin = 10 ;  bMax = 10  ;
			}
            var ValueExtent = d3.extent( rawData.map( function(d) {  return d.values[0].rv} ) ) ; 
			var radius = d3.scaleLinear().domain(ValueExtent).range([bMin,bMax]); 
			var lineWeightDomain  = d3.scaleLinear().domain(ValueExtent).range([linethickness,bMax/2]); 
			d3.select(this.domNode).select('div').remove(); 
			var container  = d3.select(this.domNode).select("div");
			var map ; 
			// Init Map Widget 
			if (container.empty()) {
                container = d3.select (this.domNode).append("div").attr("id","div"+this.k) ; 
				container.style("width", divWidth +"px" ).style("height",divHeight +"px" ).style("position" , "relative")
				.attr("class" , "leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom"); 
				container.append("div").attr("class", "leaflet-bottom leaflet-left"); 
			 }			
			 // Data for mapping 
			 var dataMap= []  ; 
			 for ( i=0 ; i< headerCnt ; i++) {
				 dataMap[i] =  d3.map(data, function (d) { return d.node[i].nodeValue}) ;  
			 }
			 
			// OverLay Map Draw 
			 drawOverlay () ;
 
		function drawOverlay () {  
			// debugger ; 
			var visbounds =  [[0,0], [divHeight,divWidth]]; ;  // default Bounds 
			var imagePaddingTop = [40,0] , imagePaddingBottom = [  0, showlegend ? 30 :0] ;
			var imageMapsLayerControl =  {} ;  
			var settedMap = "" ;
			var currentMap = "" ;
			var currentImageLayer ; 
			// Create overlay layers
			for (key in groupGeoJson  ) {				
				if (groupGeoJson.hasOwnProperty(key)) {
					var tmpimgsrc = groupGeoJson[key].imagePath ; 
					var tmpLayers = L.imageOverlay(tmpimgsrc ,visbounds ,  
							{zIndex : 0 , 
								opacity : 0 
							//  errorOverlayUrl : libPath + "empty.png"
						} );//.addTo(map); 
					 tmpLayers.key = key ;  
					 
					 tmpLayers.on("load", imageLayerLoad ) ; 
					 tmpLayers.on("error",emptyLayerLoad) ;
					 imageMapsLayerControl[key] = tmpLayers ;
				}
			}
			// Check Current Map Set 			 
			settedMap == ""  ? settedMap = groupGeoJson.hasOwnProperty(propCurrentMapGroup) ?  propCurrentMapGroup : Object.keys(imageMapsLayerControl)[0] : settedMap  = settedMap ; 
			currentImageLayer  = imageMapsLayerControl[settedMap]; 
			currentMap = settedMap ;  
			// Call Map Instance
			map  = L.map(divId , {
				crs : L.CRS.Simple  , minZoom : -5 , maxZoom :  10  , zoomDelta : 0.5 , zoomSnap : 0.1  , layers :currentImageLayer   , 
				center : viewcenter  , 
				zoom : zoomLevel  ,  
				// zoomControl : ! mstrApp.isExporting || ptHideControl,
				zoomControl : ! hideZoomControl , 
			 	renderer : L.svg({padding:0.0 , tolerance:0}) , 
				attributionControl : false   , 
				scrollWheelZoom : ! ptZoomControl
				} ) ; 
			// set map background ..  
			
			map.getContainer().style.backgroundColor  = hexToRGB (mapBackColor.fillColor , mapfillOpacity ) ;  // mapBackColor.fillColor ;
			// map.getContainer().style.opacity = mapfillOpacity ; 
			
				function emptyLayerLoad (el) {
					var imageBounds = [[0,0],[divHeight,divWidth] ] ; 
					isUserAction = false ; 
					map.setView(viewcenter ,zoomLevel , {animate:false }) 					
					if ( !isFitView) { 
						map.fitBounds(imageBounds , {paddingTopLeft : imagePaddingTop , paddingBottomRight : imagePaddingBottom ,animate:false  } ); 
					}
					this.getElement().style.display  = "none" ; 
					// this.getElement().style.border = "2px  dotted #D3D3D3" ;  
					isUserAction = true  ; 
					// Call Json Drawing..
					drawJsonData(groupGeoJson[settedMap].geoJson)  ; //settedMap 
					renderEvent ("empty image loaded"); 
				} 				

				function imageLayerLoad (el) {
					var xImage = L.DomUtil.create ("img");
					xImage.src = this.getElement().src  ; 
					xImage.key = this.key ; 				 
					L.DomEvent.on (xImage,'load', imageSetting) ;  
				} 

				function imageSetting (e,i) {
					var imageBounds = [[0,0],[this.height,this.width] ] ; 
					var oLayer = imageMapsLayerControl[this.key] ; 
					oLayer.setBounds(imageBounds);
					oLayer.imageBounds = imageBounds ; 
					isUserAction = false ; 
					map.setView(viewcenter ,zoomLevel , {animate:false })			 /* [this.height/2 , this.width / 2] */ 
					if ( !isFitView) {
						map.fitBounds(imageBounds , {paddingTopLeft : imagePaddingTop , paddingBottomRight : imagePaddingBottom ,animate:false  } );			
					}
					oLayer.setOpacity (1.0) ;
					isUserAction = true  ;  

					// Call Json Drawing..
					drawJsonData(groupGeoJson[settedMap].geoJson)  ; //settedMap 

					// renderEvent ("image loaded");
				}
var fitMapControl = L.easyButton ({ 
	states : [{ 
	stateName : 'fitMap' , 
	icon : '<img style="padding-top:3px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAGeSURBVDhPvZS/S0JRFMe/CiIiKYhCLq7+/AvCJSQcxSEaBAlaxMHWFl0UdGhRyKHJIYQGoVVIQhJpeBmaOdpioIL21Emfenv39qihAt9D+izv3O+978u599xzVUQEW0QtfX/w1uthOBhIo835yvAyn8f7eIyBaDIajWCz2ZDMZNgiObAMl8slHup1DIdDQPR3ulyKzCjMcDadQqvVQqVSYSEIOPD72aQSmOFkMsFqvcaOwQC9Xo+LbBb31SpbIBt6hg2OIyfhMA2JuH0Si0TIcShEbstlpsmBGdIfeZ5nAmW1WpHTaJQcBYPkudmU1M1ghr8hCAK5Lhal0eb838VWimzDdqslRX/ANr4hL+02OQwEyHk6LSnf0JtCkZWhy+3GnteLTqeDTColqUAykcBsNmOxoqLkczk8chzcHg/MZjPuKhWcxeOwOxzKihKNxbDv8+G128VTowGdTgeD2GUUxVU2WyxQq9XQaDQQGwEGo5HpigxvSiVcFQpYzOeY8Dx7VOgbQJF9hoN+H/VaDXanE7tWK0wmkzTzyZY7BfgA4U+i8bobE94AAAAASUVORK5CYII="></img>' , 
	title : 'Fit Image to Screen' , 
	onClick : fitMap  } ]
	} ) ;   
	function fitMap () { 
		var layerBound = currentImageLayer.imageBounds ?currentImageLayer.imageBounds  :  currentImageLayer.getBounds() ; 
		map.fitBounds ( layerBound  , {paddingTopLeft : imagePaddingTop , paddingBottomRight : imagePaddingBottom ,animate:true   } ) ; 
	} 
	if (!mstrApp.isExporting &&  !hideZoomControl ) {
		fitMapControl.addTo(map);
	}
		var enableDrawControl = L.easyButton(
			{ states : [{				 
						stateName: 'Edit',
						icon: '<img style="padding-top:3px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNpi/P//PwM1ARMDlcHgMTAwMNCBagYCDVsApPZDacoMBBpigMSNB/InkG0g1EXngfgAEC/EpoaR2GQDNSweSSgRRKxfv34ByS7EYhgIGKAbRpQLcRi2EGhYAsmxTKpheA0kxzCcBkKTAsmGYTUQms4ekGMYLhduAGKQ5kJSDQMBFiz5Ux6KQWxDoGEXSEn8LGh8kEs+AjEoQhaQahgYgNIhDAcEBBgg88nBjIO+xAYIMABo1oNug7k4sgAAAABJRU5ErkJggg=="/>' , 				
						title: 'Editing Shape',
						onClick: function(control) {
							EnableEditShape() ;				
							control.state('Save');
						} 
					} ,
					{
						stateName: 'Save',
						icon: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sCCBApCF3iiWoAAAGbSURBVCjPjdI/SAJxFAfw987jFyf3K0EMj4Y4L3QzXJITHBqiIXAQGmoIHRrbopagIOgPNDhEBScIDi21uCQikoME5uKQHCZhgnGmUGhGiJy2FISE9db3Po8vj4fwzyoWiySTyWxSSu/wP0BRlPFWq3VaLpcXZFl+ZP4CuVxuVlXVvWq16rPZbPccx60MRaVSaTGbzSrdbnfZarU+SZK04ff7b4eiZDK5pmmaRCl9FQRhx+fzpQAAGACAdDo9NQhCodCWpmkziAh2u/3a4XBcIGIXAIAJh8Or+Xz+MJFILH2DWCy22m6313VdHzGbzQVJkk7cbvf7d59FxGCz2ZQrlcp0NBp9EEVxTFXVo06nM8rz/IvJZNrxer03P1OwDMOEWZadqNfrEs/zu4SQyVqtNspxHAiCcBUMBi8HoyMAQCQSWWs0Gtu6rpsBABCxRyl9c7lc8x6PJzuIGACAQCBwbDQaz1iW/SCEgMFg6FNKz2VZzv92VeZrc9/pdO5bLJY4APQIIc+iKB4gYufPdykUCnOKojTi8Xhq2Nwn8AGPfvz7NpYAAAAASUVORK5CYII="/>' ,
						title: 'Finish Editing Shape',
						onClick: function(control) {
							DisableEditShape() ;
							control.state('Edit');				
						} 	
					}]
			}
		 ) 
		 if (!isPresentation )
			 { 
				 enableDrawControl.addTo(map);
			 }

// 
		 var editConfig = L.easyButton ({ 
			states : [{ 
			stateName : 'Config' , 
			icon : '<img style="padding-top:3px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAMAAAB1/u6nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABXUExURQAAAICAgICAgICAgISEhISEhIODg4aGhoWFhYeHh4eHh4iIiIiIiIaGhoeHh4eHh4mJiYeHh4eHh4iIiIiIiIiIiIeHh4eHh4eHh4iIiIaGhoiIiGZmZtK6pVUAAAAcdFJOUwAECBA0PEBUYGBkZ2twd3t/l5ufp6+zt7vHy99TVLvXAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAe0lEQVQoU62QwQ6CQAxER1BQQVmEXQXn/7/TbSkJB3oxvEtfJ5tNWxzLk2RjvuGd48HcqOJ1zik53dLZMqDUyPgWlqLTfgyj1tZSROkuWWqRfgmB4kO+1BIZT2rCQD5UAhlUBOe187cziTM3qrRued9sqezcRHAu+DfADyy8Df1nUjvWAAAAAElFTkSuQmCC"></img>' , 
			title : 'View Shape GeoJSON for local saving and clearing' , 
			onClick : showJsonPopup  } ]
			} ) ;  



		// map.setView(viewcenter ,0 , {animate:false }) 
		map.on ('baselayerchange', setImageOverlay) ;
		function setImageOverlay(el) {
			// redraw json features -- drawnItems 
			// Set JSON object 
			currentImageLayer  = el.layer ; 
			currentImageLayer.setZIndex (0) ;
			currentMap = el.name  ; // set current layer property ;  			 
			me.setProperty("propCurrentMapGroup",currentMap,{suppressData: true}) ;  

			if (drawnItems) {
				drawnItems.clearLayers()  ;
				drawJsonData(groupGeoJson[currentMap].geoJson)  ; //Change to Other Group  
			}
			if (el.layer.imageBounds ) {
				map.fitBounds(el.layer.imageBounds , {paddingTopLeft : imagePaddingTop , paddingBottomRight : imagePaddingBottom ,animate:false  } );
			} 
		}
		
		var layerControl = L.control.layers (imageMapsLayerControl,null,{collapsed:collapseControl});
		var islayerControl = Object.keys(imageMapsLayerControl).length > 1 ? true : false  ;
		if (islayerControl || groupControl ) 
		{
			layerControl.addTo(map) ; 
		}
		// layerControl.addTo(map) ; 
		
		var drawnItems = new L.FeatureGroup([],{pane:"markerPane"}); 		
		map.addLayer(drawnItems);
		// Draw Control 

		function drawControlOption (repeatMode)
		{
			return  {
				edit: {
					featureGroup: drawnItems, 
					allowIntersection : false , 
					edit : {
								moveMarkers:true , 
								selectedPathOptions:layerStyleEditStart 
						   } , 	
					poly : {
						allowIntersection : false , 
						shapeOptions : layerStyleEditStart  , 
						icon : new L.DivIcon({
							iconSize: new L.Point(12,12), 
							className: "leaflet-div-icon leaflet-editing-icon leaflet-own-poly-icon"
						})
					} 
				},
				draw: {
					polygon : {
						allowIntersection: false,
						showArea:false , 
						guidelineDistance : 10 , 
						repeatMode : repeatMode  , 
						icon : new L.DivIcon({
							iconSize: new L.Point(12,12), 
							className: "leaflet-div-icon leaflet-editing-icon leaflet-own-poly-icon"
						}),					
					} , 			
					 rectangle : {
						repeatMode : repeatMode , 
						icon : new L.DivIcon({
							iconSize: new L.Point(12,12), 
							className: "leaflet-div-icon leaflet-editing-icon leaflet-own-poly-icon"
						})
					}	, 		 
					circle :  { repeatMode : repeatMode , showArea : false , showLength : false , showRadius: false },  
					marker : false , 
					circlemarker :  { repeatMode : repeatMode }  ,  
					polyline : {
						showLength:false ,   
						icon : new L.DivIcon({
							iconSize: new L.Point(12,12), 
							className: "leaflet-div-icon leaflet-editing-icon leaflet-own-poly-icon"
						})
					}
				}
			} ;
		}

		var drawControl  = new L.Control.Draw(drawControlOption(repeatMode));

		function drawJsonData () {
				// Parse Geo JSON // 		
				geoJson = groupGeoJson[currentMap].geoJson ;	
				drawnItems.clearLayers () ;  
				if (!geoJson.features) {
					geoJson = geoCollection ;
				}

				var layerMaxCount = geoJson.features.length  ? geoJson.features.length  : 0  ;
				if (geoJson.features) {
					for (i=0 ; i<layerMaxCount ; i ++  ) 
					{
						maploadedGeoJson["index" + i ]  =  geoJson.features[i].properties ;
						geoJson.features[i].properties.layerIndex = i ; 					 				 
					}
				}
				// Parse Geo JSON End // 
				try {
					loadedGeo =  L.geoJSON (geoJson , { 
							style : geoStyle  , 
							onEachFeature : addToEditable  , 
							pointToLayer : pointToLayer 
						}) ; 
					
					enableViewMode(); 

					} 
					catch (e) {
						console.log("invalid geoJson " + e ) ;
					}  
			}

			// Init map draw.
			function addToEditable (feature , layer) { 
				if (feature.properties.layerGroup  && feature.properties.layerGroup == currentMap ) 
				{
					if (feature.properties.layerType == "rectangle") {
						layer = L.rectangle (layer.getBounds())  ;
					} ;
					if (feature.properties.layerType == "circle") {
						layer = L.circle (layer.getLatLng() )   ; 
						layer.setRadius (feature.properties.layerRadius)  ; 
					} ;
					// Set point when its' bubble and point except polyline. 
					if (!isEditMode &&  displaymode != "region" && feature.properties.layerType !== "circlemarker" && feature.properties.layerType !== "polyline" ) {
						if ( feature.properties.layerType !== "circle") {
						layer = L.circleMarker (layer.getBounds().getCenter())  ;
						}
						else {
							layer = L.circleMarker (layer.getLatLng())  ;
						}	
					}
					layer.name = feature.properties.name ; 
					layer.desc = feature.properties.desc ; 
					layer.layerIndex = feature.properties.layerIndex; 
					layer.layerGroup = feature.properties.layerGroup ; 
					layer.layerType = feature.properties.layerType ;
					layer.feature = feature ; 					
					layer.setStyle (geoStyle(feature)) ; 
					layer.setStyle ({className:"mstrlayer"}) ; 
					// Match Layer and MSTR Data 
					matchLayerToData(layer) ;
					// Set Radius and line Thick 
					if (!isEditMode && displaymode != "region" && layer.data && feature.properties.layerType !== "polyline" )
					{	
						layer.setRadius(parseInt(radius(layer.data.metrics[0].metricRValue)) ) ;
					}	
					else if (!isEditMode &&displaymode == "bubble" && layer.data && feature.properties.layerType == "polyline" )
					{
						layer.setStyle( { weight: parseInt( lineWeightDomain (layer.data.metrics[0].metricRValue)) } ) ;
					}
					else if (!isEditMode  &&   feature.properties.layerType == "circlemarker")
					{
						layer.setRadius(bubblemin) ;
					}
				
					var bDraw =   isEditMode ? true : !hideUnmatched ?  true : layer.data ? true : false  ;    
					if (bDraw)  {
						drawnItems.addLayer(layer);
					}					
				}
			} 

			function pointToLayer (geoJsonPoint , latlng) {
				return L.circleMarker (latlng) ; 
			}

			function geoStyle (feature) {
				var mcolor = fillColor.fillColor ; 
				var fName , fDesc ,layerBorderWeight , layerBorderColor , layerLineOpacity  ,layerLineDashArray  , polylineWeight = linethickness; 
				for (i=0 ; i<dataMap.length ; i++) {
						var fName = feature.properties["name"] ;
						if (dataMap[i].get(fName)) {
							var matchedData = dataMap[i].get(fName) ; 
							mcolor = getTC(matchedData) ; 
							polylineWeight = parseInt( lineWeightDomain (matchedData.metrics[0].metricRValue))
							break; 
						}							
				}  
				layerBorderWeight =  borderStyle.width ; 
				layerBorderColor = borderColor ; 
				layerLineOpacity = 1 ;
				layerLineDashArray  =  borderStyle.dasharray  ; 
				if (feature.properties.layerType == "polyline") 
				{
					layerBorderWeight = polylineWeight , 
					layerBorderColor = mcolor  ; 
					layerLineOpacity = fillOpacity ;
					layerLineDashArray = borderStyle.dasharray * layerBorderWeight ;  
				}
				return  { color : layerBorderColor  , "opacity" : 1 , "fillColor" : mcolor , "fillOpacity" : fillOpacity
				, dashArray : layerLineDashArray  , weight : layerBorderWeight , opacity : layerLineOpacity }  ;
			}
			function saveBtnClick(e) {
				saveLayerProperty(this.layer) ;
			}
			function saveLayerProperty(layer) {
				var newNameVal = container.select('#layerName').node().value ;
				var newDescVal = container.select('#layerDesc').node().value ;
				layer.name = newNameVal ;
				layer.desc = newDescVal ; 
				layer.layerGroup = currentMap  ;
				SaveToMapLayer(layer) ;  
				SaveJsonToProperty() ;
				layer.setStyle (geoStyle(layer.feature)) ; 
				addLabelText() ;
				map.closePopup(layer_popup);					
				// get layer.. 
			}


			function getShapeData (shapeKey) {
				var shapeDataMap  = {}  , returnData = []  , 
				shapeDataMap = dataMap[0].get(shapeKey); 
				if (!shapeDataMap) { return returnData } ;
				for (i=0 ; i < shapeDataMap.node.length ; i++) { 
					if (i != ImagePathAttributeIndex ) {
						returnData.push ([shapeDataMap.node[i].nodeName,shapeDataMap.node[i].nodeValue] ) ;
					}
				}
				for (i=0 ; i < shapeDataMap.metrics.length ; i++) {
					returnData.push ([shapeDataMap.metrics[i].metricName,shapeDataMap.metrics[i].metricValue] ) ;
				}
				return returnData ;
			}

			function matchLayerToData(layer) {
				var fName = layer.feature.properties["name"] ;
				if (dataMap[0].get(fName)) { 
					layer.data = dataMap[0].get(fName) ;
				}
			}

			map.on("click" , mapclick ) ;  

			function mapclick (e){
				if (selectorData.length == 0) {
					return ; 
				}
				if (!event.target.classList.contains ("mstrlayer"))  {
					setdefaultStyle();
					selectorData = [] ;
					if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) {  // mobile
						var d = {}
						d.messageType = "deselection";
						window.webkit.messageHandlers.selectionDataJSONString.postMessage(d);
					} else {
						me.clearSelections();
						me.endSelections();
					}
				} else {
					return true;				
				}
			} ;
			var isEditShow = true ; 
			map.on(L.Draw.Event.TOOLBAROPENED, function (e) { 
				isEditShow = false ; 
			});  
			map.on(L.Draw.Event.TOOLBARCLOSED, function (e) {
				isEditShow = true  ; 
			});  


			map.on(L.Draw.Event.CREATED, function (e) {
				var type = e.layerType
				var layer = e.layer;
				layer.layerType = type ; 
				layer.layerGroup = currentMap ; 
				drawnItems.addLayer(layer);  
				layer.layerIndex = drawnItems.getLayers().length -1 ; 
				SaveToMapLayer(layer) ;				
				layer.setStyle(geoStyle(layer.feature)) ;
				layer.setStyle ({className:"mstrlayer"}) ; 
				SaveJsonToProperty() ; 				
				layer.on ("click" , editLayerClick);  
				enableTooltip(layer) ;
			});  
			

			map.on(L.Draw.Event.EDITED, function (e) {
				var editedLayers = 	e.layers.getLayers() ;	 				
				for (var i = 0 ; i<  editedLayers.length; i++ ) {
					var layer = editedLayers[i]
					if (layer) {
						SaveToMapLayer(layer) ;
					}
				}
				enableDrawControl.enable() ;
				SaveJsonToProperty() ;
				setdefaultStyle(); 
				addLabelText() ; 
				for ( var j = 0 ; j<editedLayers.length ;j++ )  {
					enableTooltip(editedLayers[j]) ;
				}
				
			});  
			map.on(L.Draw.Event.DELETESTART, function (e) {
				enableDrawControl.disable();
				controlPopup ('off') ;
			});  
			map.on(L.Draw.Event.DELETESTOP, function (e) {
				enableDrawControl.enable();
				controlPopup ('on') ;
			});  
			map.on (L.Draw.Event.EDITSTART, function (e) 
			{
				enableDrawControl.disable();
			} ) ;
			map.on (L.Draw.Event.EDITSTOP, function (e) 
			{
				enableDrawControl.enable();
			} ) ;
			function controlPopup (onoff) {
				if  (onoff == 'on') {
					drawnItems.eachLayer (function(el){el.on ("click" , editLayerClick);}) ;
				} 
				else if (onoff =='off')  {
					drawnItems.eachLayer (function(el){el.off ("click" , editLayerClick);}) ;
					}				
			}

			map.on (L.Draw.Event.DELETED, function (e) 
			{

				var deleteLayers = 	e.layers.getLayers() ;	 
				// Update Group GeoJson 
				groupGeoJson[currentMap].geoJson.features = drawnItems.toGeoJSON(3).features ;
				if (deleteLayers.length > 0 ) {
					SaveJsonToProperty() ;
				}
				enableDrawControl.enable() ;
			} ) ;

			viewLegend() ;

			map.on ("moveend", updateMap);
			map.on ("zoomend",zoomEndMap) ;
			function zoomEndMap () {
				renderEvent ("zoom");
			}

			function updateMap(ev) {
				addLabelText()  ; 				
				saveMapProperty() ; 
			} 

			function  saveMapProperty() {
				if (!isUserAction) {
					return ; 
				}
					try { 			// Save Map Properties for Center and ZoomLevel .. 						
						 me.setProperty("centerPosition", {lat:map.getCenter().lat , lng : map.getCenter().lng},{suppressData: true }) ;  
						 me.setProperty("zoomLevel",map.getZoom(),{suppressData: true}) ;  
						}
				catch (e) {
					console.log("Many interaction could cause invalid state error") ;
				}
			}
	
			function setdefaultStyle () {
				drawnItems.eachLayer (function(el){
					el.setStyle(layerStyleDefault); 
					el.setStyle (geoStyle(el.feature)) ;
				}) ;
					}
			function viewLegend() { 
				if (!showlegend) {
					return ; 
				}
				var thInfo = getThresholdInfo () ;	
				var legend = L.control({position: 'bottomright'});
				legend.onAdd = function (map) {		
					var div = L.DomUtil.create('div', 'Overlayinfo Overlaylegend'), labels = []  ; 
					if (thInfo.length>0 ) {
						labels.push('<span class="Overlaylegendlabel"><b>' + thInfo[0].thresholdName +'</b></span>') ; 
					}
					for (var i = 0; i < thInfo.length; i++) {
						labels.push(
							'<span class="Overlaylegendicon" style="width:18px;background:' + thInfo[i].bgcolor + '"></span><span class="Overlaylegendlabel">' + thInfo[i].label +'</span>' );
					}		
					div.innerHTML = labels.join('');
					return div;
				};
				if (thInfo.length > 0 ) {
					legend.addTo(map); 
				}
	
				function getThresholdInfo () {
					var thOid = "" , thInfo = []  ,  threshold  , thresholdName ; 
					var fmtType = (legendformat == "number") ? "" : "%" ;
					var fmt, sampleM ,precison = 0  ;
					for (i = 0 ;i< DI.getColumnHeaderCount() ; i++) {
						thOid = DI.getColHeaders(0).getHeader(i).getObjectId() ;
						threshold = DI.data.gsi.thresholds[thOid] ;
						if (threshold) {
							thresholdName = DI.getColHeaders(0).getHeader(i).getName() ;  
							break ; 
						}
						}
						
					if (threshold) {
						if ( !isMobile) {
							var fmtValue =  threshold[0].expr.nds[0].cs[0].v ;
												
							fmt = fmtValue.charAt(fmtValue.length-1) == "%" ? "%" : "" ; 
							diff  = DI.getUnitById(thOid).unit.max - DI.getUnitById(thOid).unit.min ; 
							precison = diff > 100 ? 0 :  diff> 10 ? 1 : 2 ; 
							for (j=0 ; j<threshold.length ; j++) {
								var tmpth = {} ; var fvalue , cvalue ; 
								tmpth.bgcolor = threshold[j].fmt.bc ; 
								tmpth.thresholdName= thresholdName ; 
								//fvalue =   threshold[j].flr == "-Infinity" ? "" :  threshold[j].flr.toFixed(precison) + fmtType  ; 
								//cvalue =   threshold[j].ceil== "Infinity" ? "" : threshold[j].ceil.toFixed(precison)  + fmtType ; 
								fvalue =   threshold[j].flr == "-Infinity" ? "" :  threshold[j].flr + fmtType  ; 
								cvalue =   threshold[j].ceil== "Infinity" ? "" : threshold[j].ceil + fmtType ; 
								tmpth.label = fvalue  + '-' + cvalue ; 
								thInfo.push (tmpth) ; 
							}
						}
						else { // For Mobile legend 
							for (j=0 ; j<threshold.length ; j++) {
								if ( !threshold[j].hasOwnProperty ("fmt"))  {
									continue ; 
								}
								var tmpth = {} ; var fvalue , cvalue ;
								tmpth.bgcolor = threshold[j].fmt.bc ; 
								tmpth.thresholdName= thresholdName ; 
								fvalue =   threshold[j].flr + fmtType  ; 
								cvalue =   threshold[j].ceil + fmtType ; 
								tmpth.label = fvalue  + ' - ' + cvalue ; 
								thInfo.push (tmpth) ; 
							}
						}
					}
					return thInfo ; 
				}
			}		


			// L.easyButton function Control for Map Edit Enable Disable  
			function DisableEditShape () { 
				map.removeControl(drawControl) ; 
				map.removeControl(editConfig); 
				currentImageLayer.setOpacity(1) ;
				if (islayerControl) {
					layerControl.getContainer().querySelectorAll("input").forEach(function (e) {  e.disabled= false ; }) 
				}
				isEditMode  = false ;
				drawJsonData(groupGeoJson[currentMap].geoJson) ;
				var imageOverlayElement = imageMapsLayerControl[currentMap].getElement() ; 
				imageOverlayElement.style.background = "" ; 
				imageOverlayElement.style.outline = "" ;  
			}

			function EnableEditShape() {  
				var imageOverlayElement = imageMapsLayerControl[currentMap].getElement() ; 
				var imageLoaded = (imageMapsLayerControl[currentMap].completed &&  imageMapsLayerControl[currentMap].naturalWidth ) ;
				map.addControl(drawControl);  
				map.addControl(editConfig);				
				if (islayerControl) {
					layerControl.getContainer().querySelectorAll("input").forEach(function (e) {  e.disabled= true ; }) 
				}
				currentImageLayer.setOpacity(0.7); 
				imageOverlayElement.style.background = "white" ;  
				imageOverlayElement.style.outline = "2px  dotted #808080" ;
				isEditMode  = true ; 
				drawJsonData(groupGeoJson[currentMap].geoJson) ;
				enableEditMode() ;
			} // Control Drawing  

			function enableEditMode() { 
				map.off("click" , mapclick ) ;
				drawnItems.eachLayer (function (el){
					el.off ("click" , viewLayerclick ) ;
					el.on ("click" , editLayerClick);		
				} ) ; 
			}

			// functions for Handling layer tooltip & event & popup 
			function enableViewMode() {
				map.on("click" , mapclick ) ;		
				drawnItems.eachLayer (function (el){
					enableTooltip(el) ;
					el.off ("click" , editLayerClick);	
					el.on ("click" , viewLayerclick ) ;	
				}) 				
				 
				addLabelText() ; 
			} 
			function enableTooltip (el) {  
				if (isMobile) {
					el.on ( "click" , layermouseovermobile ); 
				}
				else {
					el.on ( "mouseover" , layermouseover ); 
					el.on ( "mouseout"  , layermouseout ) ; 	
				}
			}
			
 			function viewLayerclick (e) {	
			
				var selectorItem  = this.data  && this.data.node[0] &&  this.data.node[0].attributeSelector ; 
				if (!selectorItem) {return ;}
				var inSelectorItem = selectorData.filter (function(o) { 					
					return o ? o.eid === selectorItem.eid : false ;
				})[0] ; 
			
				if ( multiselect && !isMobile )  // Multi Selection  and not for mobile. 
				{
					if (inSelectorItem)  // existing item 
					{ 
						selectorData.pop(inSelectorItem) ;					
						this.setStyle(geoStyle(this.feature));
						this.on ( "mouseout" ,layermouseout ) ;
						clearSelection() ; 
					}
					else { // new selected layer 
						selectorData.push (selectorItem) ;
						this.setStyle(layerStyleSelected);
						this.off ( "mouseout" ,layermouseout ) ;
						submitSelection() ; 
					} 
				}
				else {  // Single Selection 
					setdefaultStyle () ;
					if (inSelectorItem)  // existing item 
					{ 
						selectorData = []  ;
						this.setStyle(geoStyle(this.feature));
						this.on ( "mouseout" ,layermouseout ) ;
						clearSelection() ; 
					}
					else { // new selected layer 
						selectorData = [selectorItem] ;
						previousSelectedLayer = this ; 
						this.setStyle(layerStyleSelected);
						this.off ( "mouseout" ,layermouseout ) ;
						submitSelection() ; 
					} 				
				}			 
				function clearSelection () {
					if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
						var d = {}
						d.messageType = "deselection"; 
						window.webkit.messageHandlers.selectionDataJSONString.postMessage(d);
				  } else {
						me.applySelection(selectorData);
				  }
				} 				
				function submitSelection() {
					if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
						selectorItem.messageType='selection'
						window.webkit.messageHandlers.selectionDataJSONString.postMessage(selectorItem);							
				  } else {
					me.applySelection(selectorData);
				  }
				}
			}

			function layermouseovermobile(e) {
				this.setStyle({ fillOpacity : selectedOpacity , opacity  : selectedOpacity }) ; 
				var tooltipHtml ; 
				// tooltip bind 
				tooltipHtml  = tooltipPopupContents (this ) ; 
				this.bindTooltip(tooltipHtml , {permanent : false  , sticky:true , direction : "auto" ,  offset : [0,0]}).openTooltip() ;  
			}
			function layermouseover (e) {
				this.setStyle({ fillOpacity : selectedOpacity , opacity  : selectedOpacity }) ; 
				var tooltipHtml ; 
				// tooltip bind 
				tooltipHtml  = tooltipPopupContents (this ) ; 
				this.bindTooltip(tooltipHtml , {permanent : false  , sticky:true , direction : "auto" ,  offset : [0,0]}).openTooltip() ;  
			} 
			function layermouseout (e) {
				this.setStyle ( geoStyle(this.feature)) ;
				this.unbindTooltip() ;
			} 

			function tooltipPopupContents (layer) { 
				//	if (!layer.data ) { return ;}
				var tooltipHtml ; 
				var tooltipData = getShapeData(layer.name)  ;  
				// if (tooltipData.length == 0 ) { return }
				var tooltipHtml = "<table class='tooltipTable'>" ;
				tooltipData.forEach(function (datum,index ) {
					tooltipHtml += "<tr><td class='tooltipName'>"+datum[0] +"</td><td class='tooltipValue'>" + datum[1] + "</td></tr>" ;
				})				
				if (!layer.data && layer.name && layer.name.trim().length > 0) {
					tooltipHtml += "<tr><td class='tooltipName'>Shape ID</td><td class='tooltipValue'>" + layer.name + "</td></tr>" ;
				}
				if ( layer.desc && layer.desc.trim().length > 0) {
					tooltipHtml += "<tr><td class='tooltipName'>Description</td><td class='tooltipValue'>" + layer.desc + "</td></tr>" ;
				} 
				tooltipHtml += "</table>" ;
				return tooltipHtml ;
			}  

		// Popup for editing layer.. 
		var layer_popup = L.popup({maxWidth:300 , minWidth : 150 , maxHeight : 300  , className : "overlayPopup"}); 
		function  editLayerClick (e) { 
			if (isEditShow) {
				popupLayerPropEditor(this , e.latlng ) ;
				}
		}


		
			function popupLayerPropEditor(layer,latlng) {
				var layerName = "" , layerDesc =""; 
				layer.name  ? layerName =  layer.name  : ""; 
				layer.desc ?  layerDesc =  layer.desc : "" ; 
				var contents = L.DomUtil.create('div','ImageOverlayPopup')  , table = " " ;	 
				table = "<table class='propertyTable'>"  ; 
				table += "<tr><td class='header'>Shape ID</td>" + 
							"<td class='value'><input type='text'  value='" + layerName  + "' id='layerName'/></td></tr>";
				table += "<tr><td class='header'>Shape Desc</td>" + 
				"<td class='value'><input type='text' value='" + layerDesc  + "' id='layerDesc'/></td></tr>";	
				table += "</table>"	;			
				contents.innerHTML =  table ;
				
				function enterkey() {
					if (window.event.keyCode == 13) {
						saveLayerProperty(layer) ; 
						}
				}
			
			
				var saveBtn = L.DomUtil.create('div' , 'overlay-button-save' , contents) ; 
				saveBtn.innerText = "SAVE" ;
				saveBtn.layer = layer ; 
				L.DomEvent.on (saveBtn, 'click', saveBtnClick) ; 

				// Enter key 
				L.DomEvent.on (contents, 'keyup', enterkey) ; 

				var cancelBtn = L.DomUtil.create('div' , 'overlay-button-cancel' , contents ) ; 
				cancelBtn.innerText="Cancel" ; 
				L.DomEvent.on (cancelBtn, 'click', function (){
					map.closePopup(layer_popup);
				})
				if (!latlng )  {
					if (layer.layerType != "circlemarker") {
						latlng = layer.getCenter() ; 
					}
					else {
						latlng = layer.getLatLng() ; 
					}
				}
				layer_popup.setLatLng(latlng? latlng : layer.getCenter())  
					.setContent (contents)  
					.openOn(map) ; 
				map.on ("popupopen" , function (e) {
					 document.getElementById('layerName').focus(); 
				})
			}			
			
			// Geo JSON Editor 
			var json_popup = L.popup({maxWidth:500 ,  maxHeight:400 , minHeight : 400,  className : "jsonPopup"}); 
			var jsonOption = "" , jsonTextNode ;		
			// Show GEO JSON TEXT 
			function showJsonPopup  (){
					var currentGeoJson =  JSON.stringify(groupGeoJson[currentMap].geoJson, null , 2)   ;  	
					var allGroupJson = 	JSON.stringify(loadedGeoJson, null , 2)   ;  					 
					var json_contents = L.DomUtil.create ('div', 'jsonPopupDiv') 
					jsonOption = "curr"
					// Option for Select Which JSON 
					var optionJson   = L.DomUtil.create ('div', 'jsonOptionDiv' , json_contents )  ;
					optionJson.innerHTML = "<input type='radio' class='leaflet-control-layers-selector' name='jsonSelect' value='curr'  checked='checked'>" + 
											"<span class='optionlabel'> " +currentMap+" JSON </span>"  + 
											"<input type='radio' class='leaflet-control-layers-selector' name='jsonSelect' value='all'  >" + 
											"<span class='optionlabel'> All JSON </span>"  ;  
					L.DomEvent.on(optionJson, 'click' ,function (){
						jsonOption =  d3.select(this).select('input[name="jsonSelect"]:checked').node().value ;
						switch (jsonOption) {
							case "curr" :
									allTextArea.style.display = "none" ; 
									currentTextArea.style.display = "" ;
								break ; 
							case "all" :
									allTextArea.style.display = "" ; 
									currentTextArea.style.display = "none" ;								 
								break ; 
						} 						
					})	;	
					var textDiv = L.DomUtil.create ('div', 'jsonTextDiv' , json_contents ) ;
					var currentTextArea = L.DomUtil.create ('div', 'jsonTextDiv' , textDiv ) ;
					var allTextArea = L.DomUtil.create ('div', 'jsonTextDiv' , textDiv ) ;
					currentTextArea.innerHTML = "<textarea id=textAreaCurrJson class='jsonContents' rows=15 cols=50>" + currentGeoJson + "</textarea>" ;
					allTextArea.innerHTML = "<textarea id=textAreaAllJson class='jsonContents' rows=15 cols=50>" + allGroupJson + "</textarea>" ;
					allTextArea.style.display = "none";
				 
					json_popup.setLatLng(map.getCenter())
					// json_popup.setContent ('<div style="overflow:scroll" class="jsonPopup"><textarea rows=30 cols=50>' + currentGeoJson + '</textarea></div>');
					var saveBtn = L.DomUtil.create('div' , 'overlay-button-save' , json_contents) ; 
					saveBtn.innerText = "SAVE" ;
					L.DomEvent.on (saveBtn, 'click', function () {
						var inputJson , parsedInputJson ;
						switch (jsonOption) { 
							case "curr" :
									inputJson = container.select('#' + 'textAreaCurrJson').node().value  ; 
									try { 
										parsedInputJson = (JSON.parse(inputJson))   ; 
										groupGeoJson[currentMap].geoJson = parsedInputJson  ; 
									}
									catch (e) {
										console.log("invalid json input") ;  
										alert("Invalid Format. Can't save the JSON.")
									} 
								break ; 
							case "all" :
									inputJson = container.select('#' + 'textAreaAllJson').node().value  ;  
									try { 
										parsedInputJson = (JSON.parse(inputJson)) ;
										// Set All Json to Input Json.
										loadedGeoJson  = parsedInputJson ;
										assignToGroupJson();
										// Set current JSON too.    
										container.select('#textAreaCurrJson').node().value =  JSON.stringify(groupGeoJson[currentMap].geoJson, null , 2)  ; 
										// try to set current json layer 
										// groupGeoJson[currentMap].geoJson = parsedInputJson  ; 
									}
									catch (e) {
										console.log("invalid json input") ;  
										alert("Invalid Format. Can't save the JSON.")
									} 
								break ; 
						}
						SaveJsonToProperty() ;						
						drawJsonData(groupGeoJson[currentMap].geoJson) ; 
						map.closePopup(json_popup);
					}) ; 
					
					var cancelBtn = L.DomUtil.create('div' , 'overlay-button-cancel' , json_contents ) ; 
					cancelBtn.innerText="Cancel" ; 
					L.DomEvent.on (cancelBtn, 'click', function (){
						map.closePopup(json_popup);
					})

					var ClearAllBtn = L.DomUtil.create('div' , 'overlay-button-clear' , json_contents ) ; 
					ClearAllBtn.innerText="Clear All" ; 
					L.DomEvent.on (ClearAllBtn, 'click', function () { 
						var currTextArea = container.select('#' + 'textAreaCurrJson').node()  ;
						var allTextArea =  container.select('#' + 'textAreaAllJson').node()   ;
						currTextArea.value = nullGeoJson ; 
						groupGeoJson[currentMap].geoJson  = nullGeoJson ;
						SaveJsonToProperty(); 
						switch (jsonOption) { 
							case "curr" : 
									allTextArea.value = JSON.stringify(loadedGeoJson, null , 2) ; 
								break; 
							case "all" :
									allTextArea.value = "{}"; 
									loadedGeoJson = {};
								break ; 
						}
						SaveJsonToProperty(); 
						drawnItems.clearLayers();
					}) ;
					var RemoveUnusedJsonBtn = L.DomUtil.create('div' , 'overlay-button-remove' , json_contents ) ; 
					RemoveUnusedJsonBtn.innerText="Remove Unused" ; 
					RemoveUnusedJsonBtn.title="Remove unused shaped mapping data" ; 
					L.DomEvent.on (RemoveUnusedJsonBtn, 'click', function () { 
						for (key in loadedGeoJson  ) {				
							if (!groupGeoJson.hasOwnProperty(key)) {
								delete loadedGeoJson[key] ; 
							}
						}	
						setJsonContents();	
					}) ;
					function setJsonContents() {
						currentTextArea ; 
					}
					json_popup.setContent(json_contents) 
					json_popup.openOn(map); 
			}  



			function SaveToMapLayer(layer) {					
				var layergeojson ; 				
				layergeojson = SaveProperty (layer) ; 
				// SaveProperty (layer) ; 
				layer.feature = layergeojson ; 		
				matchLayerToData(layer) ;
				// When editing existing layer 
				if (groupGeoJson[currentMap].geoJson.features[layer.layerIndex]) {
					groupGeoJson[currentMap].geoJson.features[layer.layerIndex] = layergeojson ;   
				}
				else {
					// When Adding new layer 
					groupGeoJson[currentMap].geoJson.features.push (layergeojson);  
				} 				
			}			

			function SaveJsonToProperty() {				
				// Write to Property JSON
				loadedGeoJson[currentMap] =  groupGeoJson[currentMap].geoJson  ;
				me.setProperty("OverlayJson",JSON.stringify(loadedGeoJson),{suppressData: true}) ;				
			}	
			function SaveProperty ( sourceLayer) {
				var geojson = sourceLayer.toGeoJSON() ;  //3 
				geojson.properties.name = 	sourceLayer.name ; 
				geojson.properties.desc =  sourceLayer.desc  ; 
				geojson.properties.layerType =  sourceLayer.layerType   ; 
				geojson.properties.layerGroup = sourceLayer.layerGroup  ;
				geojson.properties.layerIndex = sourceLayer.layerIndex  ;  
				geojson.properties.layerRadius = sourceLayer._mRadius ; // Radius for circle   
				return geojson ; 
			}
				// Display Label to Map 
			function addLabelText () {
 
					// Clear Label Area 
					var mapsvg = d3.select ("#" +divId).select("svg") ;			
					/* var mapsvg = d3.select(map.getPane("tooltipPane")).select ("svg") ;
					if (mapsvg.empty()) {
						mapsvg.append("svg") ;
					} */				
					var mapG = mapsvg.select("#label"+divId ) ;
					// filter 
					var filterId = "whiteOutlineEffect"  + divId ; 
					var filterhtml = '' + 
						'<filter id="'+ filterId +'"><feMorphology in="SourceAlpha" result="MORPH" operator="dilate" radius="2 1" /><feColorMatrix in="MORPH" result="WHITENED" type="matrix" values="-1 0 0 1 0, 0 -1 0 1 0, 0 0 -1 1 0, 0 0 0 1 0"/>  <feMerge>    <feMergeNode in="WHITENED"/>    <feMergeNode in="SourceGraphic"/>  </feMerge>'+
					'</filter>' ; 
					if (mapG.empty()) {
						mapG = mapsvg.append("g").attr("id","label"+divId ) ;
/* 						mapG.style("font-size", fontLabel.fontSize )
						mapG.style("font-family" , fontLabel.fontFamily)   */
						mapG.append("defs").html(filterhtml) ; 
					} 
					mapG.selectAll("text").remove() ; 
				
					if ((dataLabel.N != "true" &&   dataLabel.V != "true") || drawnItems.getLayers().length == 0 ) {
						return ; // don't draw any label.  
					} 

					var fName , fDesc , textLabelData = []  , labelFontSize = 0 ; 
					labelFontSize = parseInt(fontLabel.fontSize) * ( dataLabel.V != "true" ? 2 : 1) ;
					for (i=0 ; i<drawnItems.getLayers().length ; i++) {
							var el =  drawnItems.getLayers()[i] ; 
							var fName =el.feature.properties["name"] ; 
							var tmpData = {} ;
								if (el.data) { 
									tmpData.metricValue  = el.data.metrics[0].metricValue ; 
									tmpData.labelName = el.data.labelName ;  
									tmpData.labelDesc = el.desc ? el.desc : "" ; 
									if (el instanceof L.CircleMarker ) {
										tmpData.LatLng = el.getLatLng() ;
										tmpData.margin = parseInt( el.getRadius()) + labelFontSize    ;
									} 
									else {
										tmpData.LatLng = el.getCenter() ; 
										tmpData.margin  = 0 ; 
									}
								textLabelData.push (tmpData)
							}							
					} 
					
					var textLabel = mapG.selectAll("text")
						.data(textLabelData) 
						.enter()
						.append("text")
						.attr("fill", fontLabel.fontColor)
						.style("font-size", fontLabel.fontSize )
						.style("font-family" , fontLabel.fontFamily)  
						.attr("visibility" , "hidden")
						.attr("id", function (d,i){
							return "label_" + i ; 
						}); 
					var valueMargin =0 ; 
					if (dataLabel.N == "true" ) {
						textLabel.append("tspan")
						.style("text-anchor","middle")
							.attr("y" , function(d) {return d.margin} ).attr("x",0)
							.text(function(d) {
								// return 	d.node[0].nodeValue ;   
								return d.labelName  + (" " + d.labelDesc).trim() ;
								}) ; 		
					}
					if (dataLabel.V == "true" ) {
						valueMargin =labelFontSize  + 4   ;
						textLabel.append("tspan")
						.style("text-anchor","middle")
								.attr("y" ,  function(d) {return d.margin + valueMargin} ).attr("x",0)
								.text(function(d) {
									return 	d.metricValue  ;  
									}) ; 
					}

					textLabel.attr ("transform" , function (d) {
						return "translate("  + 
							map.latLngToLayerPoint(d.LatLng).x  + "," + 
							(map.latLngToLayerPoint(d.LatLng).y )   //+ radius(d.metrics[0].metricRValue) 
						+")"
					}) ; 
		
					if (hideCollision) {
						var labelNodes = textLabel.nodes() ;
						var labelLength = labelNodes.length ;
		
						var labelRect = {} , labelMatrix  = {} , labelDisplayList = {} , labelID , matrixSize  = 10 ; 
						// Create label Rect Matrix 
						for (var l = 0 ; l < labelLength; l ++ ) {
						var o =  labelNodes[l].getBoundingClientRect() ;
						labelID = "label_"  + l ; 
						labelRect[labelID] = o ; 
						// Create Label Matrix 
						CreateLabelMatrix(labelID, o ) ; 
						labelDisplayList[labelID]  = true ; 
					}			

					// Detect Collision
					for (var l = 0 ; l < labelLength; l ++ ) {
						labelID = "label_"  + l ; 
						var o =  labelRect[labelID] ;
						if (!labelDisplayList.hasOwnProperty(labelID)) { // 지워진 노드는 비교하지 않음
							continue  ; 
						}
						var g = cellStartEnd(o) ; 
						for (i=g.rowStart; i<g.rowEnd ; i++ ) {
							for (j =g.colStart ; j< g.colEnd ; j++) {
								if (labelMatrix[i] && labelMatrix[i][j]) {
									coNodes = labelMatrix[i][j] ; 
									for (node in coNodes) {
										if (labelID == node) { continue ; } 
										if (coNodes.hasOwnProperty(node) && labelDisplayList.hasOwnProperty(node) ) {
											delete labelDisplayList[node] ;  
											coNodes[node]  = false ; 
										}
									}
								}
							}
						}
					}

					var Nodeselector = ""  , labelDisplayListLength = 0 ; 
					for (node in labelDisplayList) {
						Nodeselector += (labelDisplayListLength == 0 ? "" : "," ) +  "#" + node ;
						labelDisplayListLength += 1  ;
					}
					if (Nodeselector) {
						mapG.selectAll(Nodeselector ).attr("visibility","visible").attr("class","ImageOverlayLabel") ;
					}

					function CreateLabelMatrix(lableID, o) {
						var g = cellStartEnd(o) ; 
						for (i=g.rowStart; i<g.rowEnd ; i++ ) {
							for (j =g.colStart ; j< g.colEnd ; j++) {
								if (!labelMatrix[i] ){
									labelMatrix[i] = {} ; 
								}
								if (!labelMatrix[i][j]) {
									labelMatrix[i][j] = {} ; 
								}
									labelMatrix[i][j][labelID] = true ; 
							}
						}
					}

					function cellStartEnd (n) {
						var g= {}  ;
						g.rowStart =  Math.floor(n.top / matrixSize  ) ;
						g.rowEnd =  Math.floor(n.bottom  / matrixSize  ) ;
						g.colStart =  Math.floor(n.left  / matrixSize  ) ;
						g.colEnd  =  Math.floor(n.right   / matrixSize  ) ;
						return g ; 
					}

				}  
				else {
					mapG.selectAll("text" ).attr("visibility","visible").attr("class","ImageOverlayLabel");
				}// end of Label collision ..  
				if (!mstrApp.isExporting && whiteoutline ) {
					mapG.selectAll("text" ).style("filter" , "url(#"+filterId+")" );
				}

		} // End of drawLabel ..   

		L.DomEvent.on( me.domNode , "mousedown" , function(e){ 				
				L.DomEvent.stop(e);
				L.DomEvent.stopPropagation(e);
		}); 
		// Touch messge for library app 
		if (isMobile) {
			touchMessage () ;
		}
		function touchMessage() {  
			var touchMessage  = container.append("div").attr("class","OverlayTouchMessage") ;
			touchMessage.html("Tap and hold longer to move map") ;
			messageWidth = parseInt ( touchMessage.node().getBoundingClientRect().width ) ; 
			touchMessage.style("left" , (divWidth -messageWidth)  / 2 + "px" ).style("top","20px") ;
			map.on("touchstart" , function (e) {		 
				touchMessage.style("display" , "block")   ; 
				window.setTimeout( function (){
					touchMessage.style("display","none")  ; 
				} , 4000 )
			})
			
			map.on("touchend" , function (e) {		 
				touchMessage.style("display","none")  ; 
			})
		}

			}		// End of Draw Overlay .

				/* utility Functions */ 
			 
			// Get Metric Color 
			function getTC (tcData) {
			// get first Threshold color Info. 
				for ( var ti=0 ; ti<tcData.metrics.length ; ti ++ )
				{
					if (tcData.metrics[ti].metricColor && tcData.metrics[ti].metricColor !="" ){
						return tcData.metrics[ti].metricColor ; 
					}
				}
			return fillColor.fillColor  ;
			} ;  // End of GetThreshold Color 


			// PDF Export finished event 			
			function renderEvent(msgcall) {
				setTimeout ( 
				function () {me.raiseEvent({
				name: 'renderFinished',
				id: me.k
					}); 
				console.log("PDF render"); 
			} , 500) ;
			}
			
			function hexToRGB (hex, alpha) { 
                if (hex == "transparent") {
                    return "transparent" ; 
                }
                var r = parseInt(hex.slice(1, 3), 16);
                var g = parseInt(hex.slice(3, 5), 16);
                var b = parseInt(hex.slice(5, 7), 16);              
                if (alpha >= 0) {
                  return "rgba( "+r+","+g+","+b+"," + parseInt(alpha) /100 +")";
                } else {
                  return "rgba( "+r+","+g+","+b +" )";
                }
              } 


}})}());
//@ sourceURL=ImageOverlay.js

