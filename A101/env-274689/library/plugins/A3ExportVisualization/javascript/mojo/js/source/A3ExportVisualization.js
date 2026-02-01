(function(){
	
	if (!mstrmojo.plugins.A3ExportVisualization) 
		mstrmojo.plugins.A3ExportVisualization = {};

	mstrmojo.requiresCls(
	"mstrmojo.plugins.A3ExportVisualization.A3ExportButton",
	"mstrmojo.CustomVisBase"
	);mstrmojo.requiresCls(
	"mstrmojo.plugins.A3ExportVisualization.A3ExportButton",
	"mstrmojo.CustomVisBase"
	);
	
	mstrmojo.plugins.A3ExportVisualization.A3ExportVisualization = mstrmojo.declare(
		mstrmojo.CustomVisBase, [],
		{
			
			scriptClass:'mstrmojo.plugins.A3ExportVisualization.A3ExportVisualization',
			reuseDOMNode: false,
			errorDetails: "Failure.",
			supportNEE: true,
			rendered : false,
			hovered : true,
			externalLibraries: [],
			cssClass : "A3ExportButton-button-container",
			plot : function(){
				try {
					const visualizations = this.edtModel.getVisualizations();
					this.setDefaultPropertyValues({
						expandGridData: false,
						exportTarget: "entireDossier",
						visTarget: visualizations.length>0?visualizations[0].value:""
					});
				
					this.renderWidget();

					this.raiseEvent({
						name: 'renderFinished',
						id: this.k
					});
						
					
					
				  } catch (error) {
					console.error(error);
					// expected output: ReferenceError: nonExistentFunction is not defined
					// Note - error messages will vary depending on browser
				  }
					
				
	
			}, 
			renderWidget : function () {	
				
				if(!this.children || (this.children && this.children.length === 0))
					this.addChildren([{
						scriptClass : "mstrmojo.plugins.A3ExportVisualization.A3ExportButton"
					}]);

				this.children[0].render();
			

			},
			renderErrorMessage : function (message) {

				const div = document.createElement("div");
				// force the div to appear on the document page
				if (mstrApp.pageName === "oivm") 
					div.style.fontSize = "10px";	
				
				this.domNode.appendChild(div);
			},
			getAllProperties: function (){
				const properties = this.getDefaultProperties();
				const setProp = ((this.model.data.vp.cvp) ? this.getProperties() : this.model.data.vp);
				const keys = Object.keys(properties);
				let size = keys.length;
				while (size) {
					size--;
					const k = keys[size];
					if (setProp.hasOwnProperty(k)) {
						properties[k] = setProp[k];
					}
				}
				return properties;
			}
		}
	
	);
	
	
}());