
(function (){
	
   
    // Import the necessary library
    mstrmojo.requiresCls(
      "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );

    mstrmojo.requiresDescsWPrefix("a3Export.", "0");

    //variable that represent the enum of all the widget type
    let $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
    
    mstrmojo.plugins.A3ExportVisualization.A3ExportEditorModel = mstrmojo.declare(
      mstrmojo.vi.models.editors.CustomVisEditorModel,
      [],
      {
        getCustomProperty: function getCustomProperty() {
            const visualizations = this.getVisualizations();
            return [
                {
                    name: 'Export Properties',
                    value: [
                        {
                            style: $WT.EDITORGROUP,
                            items:[
                                 {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: "expandGridData",
                                    labelText: "Expand Grid Data"
                                },
                                {
                                    style: $WT.LABEL,
                                    labelText: "Export Target",
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "exportTarget",
                                    items: [{
                                        name: "Entire Dossier",
                                        value: "entireDossier"
                                    },
                                    {
                                        name: "Entire Page",
                                        value: "entirePage"
                                    },
                                    {
                                        name: "Visualization",
                                        value: "visualization"
                                    }]
                                },
                                {
                                    style: $WT.LABEL,
                                    labelText: "Visualization Target",
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "visTarget",
                                    items: visualizations
                                }
                            ]
                        }
                    ]
                }
            ];
        },
        getVisualizations: function getVisualizations(){
            let domElements = document.getElementsByClassName("mstrmojo-VIBox");
            const visualizations = [];
            for(const domElement of domElements){
                const visData = mstrmojo.all[domElement.id];
                visualizations.push({
                    value: visData.k,
                    name: visData.title
                });
            }
            return visualizations;
        }
      }
    );
    
  }());
  
  