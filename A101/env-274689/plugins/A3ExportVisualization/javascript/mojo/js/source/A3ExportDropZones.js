(function () {
	if (!mstrmojo.plugins.A3ExportVisualization) 
		mstrmojo.plugins.A3ExportVisualization = {};

	mstrmojo.requiresCls("mstrmojo.vi.models.CustomVisDropZones");


	mstrmojo.plugins.A3ExportVisualization.A3ExportDropZones = mstrmojo.declare(
		mstrmojo.vi.models.CustomVisDropZones,
		null,
		{
			scriptClass: 'mstrmojo.plugins.A3ExportVisualization.A3ExportDropZones',
			getCustomDropZones: function () {
				var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;
				// Fill the zones’ definition here.
				return [
					{
						name: 'Object',
						title: mstrmojo.desc(13828, 'Drag items here'),
						allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE_AND_METRIC
					}
					
				];
			}
		}
	);
}());