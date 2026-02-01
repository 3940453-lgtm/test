(function () { 
    if (!mstrmojo.plugins.WordsmithNLG) {
        mstrmojo.plugins.WordsmithNLG = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
		"mstrmojo.VisUtility",
		"mstrmojo.plugins.WordsmithNLG.WordsmithNLGConfig"
    );

	var $VISUTIL = mstrmojo.VisUtility;
	function isTrue(value) {
		return value === 'true' || value === true ? true : false;
	}
	
    mstrmojo.plugins.WordsmithNLG.WordsmithNLG = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.WordsmithNLG.WordsmithNLG",
            cssClass: "wordsmithnlg",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
			iniProperties: function(){
				var defaultKey = mstrmojo.plugins.WordsmithNLG.WordsmithNLGConfig.apiKey
				    ,defaultEndpoint = mstrmojo.plugins.WordsmithNLG.WordsmithNLGConfig.endpoint;
					
				this.setDefaultPropertyValues(
				{
					endpoint: defaultEndpoint,
					apiKey: defaultKey,
					contentfont: {
						fontSize: '11pt',
						fontFamily: 'Helvetica',
						fontColor: '#000000'
					}
				}
				);
			},
            plot:function(){
				this.domNode.className += " hasVertical mstrmojo-scrollNode";
				this.domNode.innerHTML = "";
				this.iniProperties();
            
				var endpoint = this.getProperty("endpoint");
				var apiKey = this.getProperty("apiKey");
				
				var contentNode = document.createElement('div');
				var fontStyle = this.getContentFontStyle();
				$VISUTIL.applyStyles2DomNode(contentNode, fontStyle);
				
				this.domNode.appendChild(contentNode);
				if(apiKey == null || apiKey == ""){
					contentNode.innerHTML = '<p>API Token is required</p>';
					return;
				}
				var projectName = this.getProperty("projectName");
				if(projectName == null || projectName == ""){
					contentNode.innerHTML = '<p>Project is required</p>';
					return;
				}
				var templateName = this.getProperty("templateName");
				if(templateName == null || templateName == ""){
					contentNode.innerHTML = '<p>Template is required</p>';
					return;
				}
				
				
				var pd = {};
				pd.data = this.generateJSONBody();
				
				d3.xhr(endpoint+'projects/'+projectName+'/templates/'+templateName+'/outputs')
				  .header("Authorization", "Bearer "+apiKey)
				  .header("Content-Type", "application/json")
				  .post(JSON.stringify(pd), function(err, resp){
					  if(err){
						  contentNode.innerHTML = "<p>An error happens, please check you project and template slug names and also data you use.</p>";
						  return;
					  }
					  var res = JSON.parse(resp.responseText);
					  contentNode.innerHTML = '<p>' + res.data.content + '<p>';
					  
				  });
				 
			},
			
			generateJSONBody: function(){
				var $DI = this.dataInterface;
				var row = $DI.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS)[0];
				var headers = $DI.getColHeaders(0);
				for(var i = 0; i < headers.size(); i++){
					var name = headers.getHeader(i).getName();
					row[name] = row[name].rv;
				}

				return row;
			},
getContentFontStyle: function getContentFontStyle(){
	var fontProps = this.getProperty("contentfont");
	var fontStyle = {};
	
	fontStyle.fontFamily = fontProps.fontFamily;
	fontStyle.fontStyle = isTrue(fontProps.fontItalic) ? 'italic': 'normal';
	fontStyle.fontWeight = isTrue(fontProps.fontWeight)? 'bold':'normal';
	
	fontStyle.color = fontProps.fontColor;
	fontStyle.fontSize = fontProps.fontSize;
	fontStyle.textDecoration = "";
	if(isTrue(fontProps.fontUnderline)){
		fontStyle.textDecoration += ' underline';
	}
	if(isTrue(fontProps.fontLineThrough)){
		fontStyle.textDecoration += ' line-through';
	}
	if(fontStyle.textDecoration === ""){
		fontStyle.textDecoration = "none";
	}
	return fontStyle;
},
applyFontStyle: function() {
	$VISUTIL.applyStyles2DomNode(this.domNode.firstChild, this.getContentFontStyle());
}
})}());
//@ sourceURL=WordsmithNLG.js