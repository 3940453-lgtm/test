(function() {

    mstrmojo.requiresCls(
        "mstrmojo.plugins.A3ExportVisualization._Configuration"
    );

    mstrmojo.plugins.A3ExportVisualization._LibraryExportMixin = mstrmojo.provide(
        "mstrmojo.plugins.A3ExportVisualization._LibraryExportMixin", mstrmojo.hash.copy(mstrmojo.plugins.A3ExportVisualization._Configuration,{
            base64toBlob : function(base64Data, contentType) {
                contentType = contentType || '';
                let sliceSize = 1024;
                let byteCharacters = atob(base64Data);
                let bytesLength = byteCharacters.length;
                let slicesCount = Math.ceil(bytesLength / sliceSize);
                let byteArrays = new Array(slicesCount);
            
                for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                    let begin = sliceIndex * sliceSize;
                    let end = Math.min(begin + sliceSize, bytesLength);
            
                    let bytes = new Array(end - begin);
                    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                        bytes[i] = byteCharacters[offset].charCodeAt(0);
                    }
                    byteArrays[sliceIndex] = new Uint8Array(bytes);
                }
                return new Blob(byteArrays, { type: contentType });
            },
            exportLibrary :  function(authToken, exportOptions) {
            
                let origin = window.location.origin;
                let pathName = window.location.pathname.split("/")[1];
                let instanceId = mstrApp.docModel.mid;
                let dossierId = mstrApp.docModel.oid;
                let projectId = window.location.pathname.split("/")[3];
               
                let path = `${origin}/${pathName}`;

                this.exportAction(path, dossierId, instanceId, authToken, projectId,exportOptions);
                
				
            },
            exportAction : async function(path, dossierId, instanceId, authToken, projectId, exportOptions) {
                let requestURL =  `${path}/api/documents/${dossierId}/instances/${instanceId}/pdf`;

                let headers = {
                    "Content-type": "application/json",
                    "Accept": "application/json",
                    "X-MSTR-AuthToken" : authToken,
                    "X-MSTR-ProjectID" : projectId
                }
				let pageOption = this.getPageOption(exportOptions.exportTarget);
				const gridPagingMode = exportOptions.expandGridData===true?"enlarge":"none";

				debugger;

                let payload = {
                    "includeOverview":true,
                    "includeDetailedPages":false,
                    "includeHeader":true,
                    "includeFooter":true,
                    "includeToc":false,
                    "orientation":"NONE",
                    "pageOption": pageOption,
                    "pageHeight":this.PAGE_HEIGHT,
                    "pageWidth":this.PAGE_WIDTH,
                    "viewportHeight":0,
                    "viewportWidth":0,
                    "filterSummary": "BAR",
                    "gridPagingMode":gridPagingMode,//"enlarge" for expand all grid data
                    "fitToPage":true,
                    "repeatColumnHeader":true,
                    "responsiveView":false
                }

                if(exportOptions.exportTarget === "visualization") payload["nodeKey"] = exportOptions.visTarget

                let options = {
                    method : "POST",
                    headers,
                    body : JSON.stringify(payload)
                }
                
                let response = await fetch(requestURL, options); 
                
                if(response.ok) {
                    let name = mstrApp.docModel.n;
                    let responseBody = await response.json();
                    let type =  "application/pdf";
                    let blobData = this.base64toBlob(responseBody.data, type);
                
                    let downloadLink = document.createElement("a");
                    downloadLink.download = `${name}.pdf`;
                    downloadLink.style.display = "none";
                    downloadLink.href = window.URL.createObjectURL(blobData);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                }

                this.setLoading(false);
            },
            getPageOption: function (exportTarget){
                return exportTarget === "entireDossier"? "ALL":"PAGE";
            }
        }));

})();