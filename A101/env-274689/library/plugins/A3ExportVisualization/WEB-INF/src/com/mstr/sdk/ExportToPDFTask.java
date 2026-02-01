package com.mstr.sdk;


import com.microstrategy.utils.log.Level;
import com.microstrategy.web.app.tags.Log;
import com.microstrategy.web.beans.MarkupOutput;
import com.microstrategy.web.beans.RequestKeys;
import com.microstrategy.web.objects.WebIServerSession;
import com.microstrategy.web.objects.WebObjectsException;
import com.microstrategy.web.objects.rw.*;
import com.microstrategy.web.tasks.AbstractBaseTask;
import com.microstrategy.web.tasks.TaskException;
import com.microstrategy.web.tasks.TaskParameterMetadata;
import com.microstrategy.web.tasks.TaskRequestContext;
import com.microstrategy.webapi.EnumDSSXMLDocExecutionFlags;

public class ExportToPDFTask extends AbstractBaseTask {

	private final TaskParameterMetadata instanceIdParam;
	private final TaskParameterMetadata exportTargetParam;
	private final TaskParameterMetadata visTargetParam;
	private final TaskParameterMetadata pageHeightParam;
	private final TaskParameterMetadata pageWidthParam;
	private final TaskParameterMetadata expandGridDataParam;

	public ExportToPDFTask() {
		super("");
		this.addSessionStateParam(true, null);
		instanceIdParam = addParameterMetadata("instanceId", "Dossier instance id", true, null);
		exportTargetParam = addParameterMetadata("exportTarget", "Export Target", true, ExportTargetEnum.entireDossier.toString());
		visTargetParam = addParameterMetadata("visTarget", "Visualization target", false, "");
		pageHeightParam = addParameterMetadata("pageHeight", "Page height", true, null);
		pageWidthParam = addParameterMetadata("pageWidth", "Page width", true, null);
		expandGridDataParam = addParameterMetadata("expandGridData", "Expand grid data", false, "true");
	}

	@Override
	public void processRequest(TaskRequestContext context, MarkupOutput output) throws TaskException {
		String methodName = "processRequest";
		try {
			RequestKeys keys = context.getRequestKeys();
			WebIServerSession session = checkParameters(context, keys);
			String instanceId = instanceIdParam.getValue(keys);
			String exportTarget = exportTargetParam.getValue(keys);
			String visTarget = visTargetParam.getValue(keys);
			String pageHeight = pageHeightParam.getValue(keys);
			String pageWidth = pageWidthParam.getValue(keys);
			boolean expandGridData = Boolean.parseBoolean(expandGridDataParam.getValue(keys));
			output.append(this.exportToPdf(session, instanceId, exportTarget, visTarget,pageHeight,pageWidth,expandGridData));
		} catch (Exception e) {
			e.printStackTrace();
			if(e instanceof TaskException) throw (TaskException)e;
			Log.logger.logp(Level.SEVERE, this.getClass().getCanonicalName(), methodName,"There was an error during the execution of the task: " + e.getMessage(),e);
			throw new TaskException ("Failed to process request: " + e.getMessage(), e);
		}
		
	}

	private WebIServerSession checkParameters(TaskRequestContext context, RequestKeys keys) throws TaskException {
		checkForRequiredParameters(keys);
		return context.getWebIServerSession("sessionState", null);
	}
	
	
	private byte[] exportToPdf(WebIServerSession iServerSession, String instanceId, String exportTarget, String visTarget, String pageHeight, String pageWidth, boolean expandGridData) throws WebObjectsException {
		iServerSession.getSessionID();

		RWSource rwSource = iServerSession.getFactory().getRWSource();
		
		RWInstance rwInstance = rwSource.getInstanceFromMessageID(instanceId, rwSource.getRWSettings(EnumRWExecutionModes.RW_MODE_PDF));
		
		int executionFlags = EnumDSSXMLDocExecutionFlags.DssXmlDocExecutionExportAll + EnumDSSXMLDocExecutionFlags.DssXmlDocExecutionInboxKeepAsIs + EnumDSSXMLDocExecutionFlags.DssXmlDocExecutionUseRWDCache + EnumDSSXMLDocExecutionFlags.DssXmlDocExecutionExportPDF;

		rwInstance.getResultSettings().setExecutionFlags(executionFlags);
		rwInstance.getResultSettings().setExportSettings(modifyExportSettings((RWExcelExportSettings) rwInstance.getExportSettings(),exportTarget,visTarget,pageHeight,pageWidth,expandGridData ));
		rwInstance.pollStatus();
		return rwInstance.getPDFData();
	}
	
	
	private RWExportSettings modifyExportSettings(RWExcelExportSettings settings, String exportTarget, String visTarget, String pageHeight, String pageWidth, boolean expandGridData) {
		settings.setExportPaperHeight(pageHeight);
		settings.setExportPaperWidth(pageWidth);
		settings.setFilterSummary(2);
		settings.setExportPDFFooter(1);
		if(expandGridData)settings.setGridPagingMode(1); //For expand all grid data

		if(exportTarget.equals(ExportTargetEnum.entireDossier.toString()))settings.setRange(0);
		else settings.setRange(4);

		if(exportTarget.equals(ExportTargetEnum.visualization.toString()))settings.setGridKey(visTarget);

		return settings;
	}

}
