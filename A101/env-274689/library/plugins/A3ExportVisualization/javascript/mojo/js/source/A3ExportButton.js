(function() {

    mstrmojo.requiresCls(
        "mstrmojo.plugins.A3ExportVisualization._LibraryExportMixin",
        "mstrmojo.plugins.A3ExportVisualization._WebExportMixin"
        );

    mstrmojo.requiresDescsWPrefix("a3Export.", "0");

	mstrmojo.plugins.A3ExportVisualization.A3ExportButton = mstrmojo.declare(
        mstrmojo.Button,
        [mstrmojo.plugins.A3ExportVisualization._LibraryExportMixin, mstrmojo.plugins.A3ExportVisualization._WebExportMixin],
        {
            scriptClass : "mstrmojo.plugins.A3ExportVisualization.A3ExportButton",
            isDownloadingAlready : false,
            onclick : function(e) {

                if(this.isDownloadingAlready) 
                    return;
                
                this.setLoading();

                const customProperties =  this.parent.getAllProperties();
                const exportOptions = {
                    expandGridData: this.getExpandGridData(customProperties),
                    exportTarget: this.getExportTarget(customProperties),
                    visTarget: this.getVisTarget(customProperties)
                }

                const authToken = this.getAuthToken();

                if(authToken)
                   this.exportLibrary(authToken,exportOptions);
                else 
                    this.exportWeb(exportOptions);

                
            },
            getExpandGridData: function(customProperties){
                return customProperties.expandGridData?customProperties.expandGridData:"false";
            },
            getExportTarget: function(customProperties){
                return customProperties.exportTarget?customProperties.exportTarget:"entireDossier";
            },
            getVisTarget: function(customProperties){
                return customProperties.visTarget?customProperties.visTarget:"";
            },
            getAuthToken : function () {

                if(window.iSession)
                    return window.iSession;

                let docCookie = document.cookie;

                if(docCookie && docCookie.includes && docCookie.includes("iSession")) {
                    let cookies = docCookie.split(";");

                    for(let c = 0, cSize = cookies.length; c < cSize; c++) {
                        let cookie = cookies[c];
                        if(cookie.includes && cookie.includes("iSession")) {
                            let values = cookie.split("=");
                            return values[1];
                        }
                    }

                }

            },
            setLoading : function(isLoading = true) {
                if(isLoading) {
                    this.isDownloadingAlready = true;
                    this.cssClass = "A3ExportButton-button A3ExportButton-button-loading";
                } else  {
                    this.isDownloadingAlready = false;
                    this.cssClass = this.getCorrectImageClass();
                }
                    
                this.refresh();
          
            },
            isPropertyApplicable : function(property) {
                return !!(property && property === "true");
            },
            getCorrectImageClass : function() {
                let exportButtonClass = "A3ExportButton-button";
                    
                let customProperties =  this.parent.getAllProperties();
              
                if(!customProperties.exportEntireDossier)
                    return `${exportButtonClass} A3ExportButton-button-currentPage`;
                
                if(customProperties.exportEntireDossier === "false")
                    return `${exportButtonClass} A3ExportButton-button-currentPage`;

                return `${exportButtonClass} A3ExportButton-button-wholeDossier`;
            },
            bindings : {
                cssClass : function() {
                    return this.getCorrectImageClass();
                }
            }
        });

})();