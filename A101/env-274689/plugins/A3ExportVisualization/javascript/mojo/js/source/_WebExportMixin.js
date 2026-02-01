(function() {

	mstrmojo.requiresCls(
		"mstrmojo.plugins.A3ExportVisualization._Configuration"
	);

	mstrmojo.plugins.A3ExportVisualization._WebExportMixin = mstrmojo.provide(
		"mstrmojo.plugins.A3ExportVisualization._WebExportMixin",mstrmojo.hash.copy(mstrmojo.plugins.A3ExportVisualization._Configuration, {
			exportWeb : async function(exportOptions) {
				let origin = window.location.origin;
				let pathName = window.location.pathname.split("/")[1];

				let sessionState = mstrApp.sessionState;
				let instanceId = mstrApp.docModelData.mid;
				let documentName = mstrApp.rootCtrl.docCtrl.model.n;
				
				let requestURL = `${origin}/${pathName}/servlet/taskProc`;

				const formData = new FormData();
				formData.append('taskId', 'exportToPDF');
				formData.append('taskEnv', 'xhr');
				formData.append('taskContentType', 'binary');
				formData.append('sessionState', sessionState);
				formData.append('instanceId', instanceId);
				formData.append('exportTarget', exportOptions.exportTarget);
				formData.append('visTarget', exportOptions.visTarget);
				formData.append('pageHeight', this.PAGE_HEIGHT);
				formData.append('pageWidth', this.PAGE_WIDTH);
				formData.append('expandGridData', exportOptions.expandGridData);

				let options = {
					method : "POST",
					body: formData
				}

				let response = await fetch(requestURL, options);

				if(response.ok) {
					let pdfData = await response.arrayBuffer();
					let blob = new Blob([pdfData], { type: 'application/pdf' });

					let downloadLink = document.createElement("a");
					downloadLink.download = `${documentName}.pdf`;
					downloadLink.style.display = "none";
					downloadLink.href = window.URL.createObjectURL(blob);
					document.body.appendChild(downloadLink);
					downloadLink.click();
				}

				this.setLoading(false);
			}
		}));

})();



