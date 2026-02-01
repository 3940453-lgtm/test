(function () { 
    if (!mstrmojo.plugins.WordsmithNLG) {
        mstrmojo.plugins.WordsmithNLG = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );

	var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
	
    mstrmojo.plugins.WordsmithNLG.WordsmithNLGEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.WordsmithNLG.WordsmithNLGEditorModel",
            cssClass: "wordsmithnlgeditormodel",
            getCustomProperty: function getCustomProperty(){
				var myViz = this.getHost();
				return [
				{
					name: "Wordsmith NLG",
					value: [
					//{
					//	style: $WT.EDITORGROUP,
					//	items: [
					//	{
					//		style: $WT.LABEL,
					//		labelText: "End Point"
					//	},
					//	{
					//		style: $WT.TEXTBOX,
					//		propertyName: "endpoint",
					//		disabled: true
					//	},
					//	{
					//		style: $WT.LABEL,
					//		labelText: "API Key"
					//	},
					//	{
					//		style: $WT.TEXTBOX,
					//		propertyName: "apiKey"
					//	}
					//	]
					//},
					{
						style: $WT.EDITORGROUP,
						items: [
						{
							style: $WT.TWOCOLUMN,
							items:[
							{
								style: $WT.LABEL,
								name: "pj",
								width: "50%",
								labelText: "Project"
							},
							{
								style: $WT.TEXTBOX,
								propertyName: "projectName",
								width: "50%"
							}
							]
						},
						{
							style: $WT.TWOCOLUMN,
							items: [
							{
								style: $WT.LABEL,
								name: "tp",
								width: "50%",
								labelText: "Template"
							},
							{
								style: $WT.TEXTBOX,
								propertyName: "templateName",
								width: "50%"
							}
							]
						}
						]
					},
					{
						style: $WT.EDITORGROUP,
						items: [
						{
							style: $WT.LABEL,
							name: "content",
							width: "100%",
							labelText: "Content Font"
						},
						{
							style: $WT.CHARACTERGROUP,
							propertyName: "contentfont",
							config: {
								suppressData: true,
								callback: function(){
									myViz.applyFontStyle();
								}
							}
						}				
						]
					}
					]
				}
				];
}
})}());
//@ sourceURL=WordsmithNLGEditorModel.js