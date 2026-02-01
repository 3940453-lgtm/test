(function () { 
    if (!mstrmojo.plugins.OrgCharWorld) {
        mstrmojo.plugins.OrgCharWorld = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );

    mstrmojo.plugins.OrgCharWorld.OrgCharWorld = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.OrgCharWorld.OrgCharWorld",
            cssClass: "orgcharworld",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"//www.google.com/jsapi"},{url:"//d3js.org/d3.v3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){

                //PLACE CODE HERE To add "use as a filter" item in the right click menu of the visualization.





                var me = this;

                this.domNode.style.overflow = "auto";

                if (!is10Point2()) {
                    me.setDefaultPropertyValues({

                        size: {
                            small: 'false',
                            medium: 'true',
                            large: 'false'
                        },
                        bgFillColor: {fillColor: '#edf7ff'},
                        selectionFillColor: {fillColor: '#d6e9f8'}

                    });

                }

                var CUSTOM_PROPERTIES = {
                    SIZE: 'size',
                    SMALL: 'small',
                    MEDIUM: 'medium',
                    LARGE: 'large',
                    NOCOLLAPSE: 'noCollapse',
                    BGFILLCOLOR: 'bgFillColor',
                    SELECTIONFILLCOLOR: 'selectionFillColor'
                };

                var DROP_ZONES = {
                    MANAGER: 'Manager',
                    EMPLOYEE: 'Employee',
                    TITLE: 'Title'
                };


                if (!google.visualization || !google.visualization.OrgChart) {
                    google.load('visualization', '1.1', {
                        "callback": drawChart,
                        packages: ["orgchart"]
                    });

                } else {
                    drawChart();
                }

                function drawChart() {

					//Object used for the "use as a filter" functionality
                    var selectorData = [];

                    //Get the data from MSTR in JSON format
                    var mstrData = getMstrData();

                    //Process the mstr json into a json format that the chart requires
                    var visData = processMstrData(mstrData);

                    //Create the org chart visualization inside the visualization div "domNode"
                    var chart = new google.visualization.OrgChart(me.domNode);

                    //Prepare the options of the chart using default options and custom properties values if any.
                    var chartOptions = prepareChartOptions();

                    //Draw chart with the visData and the chart options
                    chart.draw(visData, chartOptions);

                    //PLACE CODE HERE To add an event to apply the filtering capability when an element is selected






                    //Raise event for New Export Engine
                    me.raiseEvent({
                        name: 'renderFinished',
                        id: me.k
                    });

                    //Clear the selection when clicking on the domNode
                    var svg = d3.select(me.domNode)
                        .on("click", function () {
                            me.clearSelections();
                            me.endSelections();

                        });

                    function getMstrData() {
                        /*  Get the data from MSTR in JSON format  */
                        return me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {
                            hasSelection: true,
                            hasTitleName: true
                        });
                    }


                    function prepareChartOptions() {
                        /*  Prepare the options of the chart using default options and custom properties values if any. */

                        // Set up the default Google Org Chart default options
                        var option = {
                            allowHtml: true,
                            allowCollapse: true,
                            size: 'medium',
                            color: '#edf7ff',
                            selectionColor: '#d6e9f8'
                        };

                        // Override the options with the custom property values
                        if (!is10Point2()) { // Custom property only available for 10.2 +

                            //PLACE CODE HERE to handle new custom properties values






                            //getBackgroudColor
                            var backgroundFillColor = me.getProperty(CUSTOM_PROPERTIES.BGFILLCOLOR);
                            if (backgroundFillColor) {
                                option.color = backgroundFillColor.fillColor;
                            }
                            //getSelectionColor
                            var selectionFillColor = me.getProperty(CUSTOM_PROPERTIES.SELECTIONFILLCOLOR);
                            if (selectionFillColor) {
                                option.selectionColor = selectionFillColor.fillColor;
                            }
                        }


                        return option;

                    }

                    function processMstrData(mstrData) {
                        /*  Process the mstr json into a json format that the chart requires  */

                        var visData = new google.visualization.DataTable();
                        visData.addColumn('string', 'Name');
                        visData.addColumn('string', 'Manager');
                        visData.addColumn('string', 'ToolTip');

                        //For each row, we compare the different attribute ids with the ones in a specific drop zone
                        for (i = 0; i < mstrData.length; i++) { // rows
                            var managerName = "";
                            var employeeName = "";
                            var employeeTitle = "";

                            for (j = 0; j < mstrData[i].headers.length; j++) { //columns <=> attributes here

                                switch (mstrData[i].headers[j].attributeSelector.tid) {

                                    case me.zonesModel.getDropZoneObjectsByName(DROP_ZONES.MANAGER)[0].id:
                                        managerName = mstrData[i].headers[0].name;
                                        break;

                                    case me.zonesModel.getDropZoneObjectsByName(DROP_ZONES.EMPLOYEE)[0].id:
                                        employeeName = mstrData[i].headers[j].name;

                                        //PLACE CODE HERE to Make the employee element the selectors of "use as a filter"





                                        break;

                                    case me.zonesModel.getDropZoneObjectsByName(DROP_ZONES.TITLE)[0].id:
                                        employeeTitle = mstrData[i].headers[j].name;
                                        break;
                                }

                            }

                            // For each orgchart box, provide the employee, manager, and title to show.
                            visData.addRows([

                                [{
                                    v: employeeName,
                                    f: '<div style="color:#444649">' + employeeName + '</div><div style="color:DarkGray; font-style:italic">' + employeeTitle + '</div>'
                                }, managerName, employeeTitle]

                            ]);

                        }
                        return visData;
                    }
                }

                function is10Point2() {
                    return !(typeof me.addThresholdMenuItem === 'function');
                }
            }})}());
//@ sourceURL=OrgCharWorld.js