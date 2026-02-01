(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.SmartKPIWidget) {
        mstrmojo.plugins.SmartKPIWidget = {};
    }

    // Import the necessary library.
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    /**
     * <p>Simple drop zone model for visualization KPI widget</p>
     * <p>Defined the drop zones displayed in drop zone panel.</p>
     * @class mstrmojo.plugins.SmartKPIWidget.SmartKPIWidgetDropZones
     * @extends mstrmojo.vi.models.CustomVisDropZones
     */
        // Declare the visualization drop zones model object
    mstrmojo.plugins.SmartKPIWidget.SmartKPIWidgetDropZones = mstrmojo.declare(
        // Declare that this code extends CustomVisDropZones
        mstrmojo.vi.models.CustomVisDropZones,

        null,

        {
            // Define the JavaScript class that renders your visualization drop zones.
            scriptClass: 'mstrmojo.plugins.SmartKPIWidget.SmartKPIWidgetDropZones',

            getCustomDropZones: function getCustomDropZones() {
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;

                return [
                    {
                        name: 'Metric',
                        maxCapacity: 1,
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                    },
                    {
                        name: 'Category',
                        maxCapacity: 1,
                        title: mstrmojo.desc(null, 'Drag category related attribute here'),
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                    },
                    {
                        name: 'Time',
                        maxCapacity: 1,
                        title: mstrmojo.desc(null, 'Drag time related attribute here'),
                        allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                    }
                ];
            }
        }
    );
}());
//@ sourceURL=SmartKPIWidgetDropZones.js