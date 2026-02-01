(function () {
    if (!mstrmojo.plugins.ParaCoorDataProcessing) {
        mstrmojo.plugins.ParaCoorDataProcessing = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );

    var aColor;
    var colorChanged = false;

    this._isInitialized = false;

    mstrmojo.plugins.ParaCoorDataProcessing.ParaCoorDataProcessing = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.ParaCoorDataProcessing.ParaCoorDataProcessing",
            cssClass: "paracoordataprocessing",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            externalLibraries: [{url: "//d3js.org/d3.v3.min.js"},
                                {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins") + "ParaCoorDataProcessing/javascript/mojo/js/source/d3.parcoords.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine
            changeLineColorMode: function (colorChangeFlag) {
                var newColor = colorChangeFlag.fillColor;

                if(aColor === newColor) {
                    colorChanged = false;
                }
                else{
                    colorChanged = true;
                    aColor = newColor;
                }
            },

            plot: function () {
                //
                //...YOUR JS CODE...
                // Read in the data from dashboard:
                var me = this;
                var rawData = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV, {hasSelection: true, colorByInfo: this.zonesModel && this.zonesModel.getColorByAttributes()});
                var numRow = this.dataInterface.getTotalRows();
                var numCol = this.dataInterface.getTotalCols();


                var CUSTOM_PROPERTIES = {
                    LINE_FILL_COLOR: 'lineFillColor'
                };

                if (!is10Point2()) {
                    aColor = me.getProperty(CUSTOM_PROPERTIES.LINE_FILL_COLOR);
                    colorChanged = true;

                }

                var paletteColor = [];

                var rawChildren = rawData.children;


                var arr = new Array();
                for (var i = 0; i < numRow; i++) {
                    var attributeItem = rawChildren[i];
                    var attrName = attributeItem.name;

                    paletteColor.push(this.getColorBy(attributeItem.colorInfo));



                    arr[i] = new Array();
                    for (var j = 0, col = j + 1; j < numCol, col < numCol + 1; j++, col++) {

                        var val = attributeItem.values[j].rv;
                        arr[i][col] = val;
                    }
                    arr[i][0] = attrName;
                }



                var margin = {top: 0, right: 0, bottom: 50, left: 50},
                    width = parseInt(this.width,10) - margin.left - margin.right,
                    height = parseInt(this.height,10) - margin.top - margin.bottom;

                var container = d3.select(this.domNode)
                    .append("div")
                    .attr("class", "parcoords")
                    .attr("id", "example")
                    .style("width", this.width+"px")
                    .style("height", this.height+"px");
                //add visualization to div
               var graph = d3.parcoords()(this.domNode.querySelector("#example"))
                    .data(arr)
                //    .margin({ top: 30, left: 3 * textLength, bottom: 40, right: 0 })
                    .alpha(0.6)
                    // For New Export Engine: If open in NewEE, using 'default' mode to disable animation
                    .mode(window.mstrApp && window.mstrApp.isExporting ? 'default' : 'queue')
                    .color(function(d, i) {
                        if(!aColor){
                            return aColor;
                        } else{
                            return paletteColor[i];
                        }

                    })
                    .rate(5)
                    .render()
                    .createAxes()
                    .brushMode("1D-axes")  // enable brushing
                    .interactive();
                
                // raise event for New Export Engine
                me.raiseEvent({
                    name: 'renderFinished',
                    id: me.k
                });

                d3.select(this.domNode.querySelector("#example svg"))
                    .on("mousemove", function () {
                        var mousePosition = d3.mouse(this);
                        highlightLineOnClick(mousePosition, true); //true will also add tooltip
                    })
                    .on("mouseout", function () {
                        cleanTooltip();
                        graph.unhighlight();
                    });

                function getActiveData() {
                    // I'm pretty sure this data is already somewhere in graph
                    if (graph.brushed() != false) return graph.brushed();
                    return graph.data();
                }

                function isOnLine(startPt, endPt, testPt, tol) {
                    // check if test point is close enough to a line
                    // between startPt and endPt. close enough means smaller than tolerance
                    var x0 = testPt[0];
                    var y0 = testPt[1];
                    var x1 = startPt[0];
                    var y1 = startPt[1];
                    var x2 = endPt[0];
                    var y2 = endPt[1];
                    var Dx = x2 - x1;
                    var Dy = y2 - y1;
                    var delta = Math.abs(Dy * x0 - Dx * y0 - x1 * y2 + x2 * y1) / Math.sqrt(Math.pow(Dx, 2) + Math.pow(Dy, 2));
                    if (delta <= tol) return true;
                    return false;
                }

                function findAxes(testPt, cenPts) {

                    // finds between which two axis the mouse is
                    var x = testPt[0];
                    var y = testPt[1];

                    // make sure it is inside the range of x
                    if (cenPts[0][0] > x) return false;
                    if (cenPts[cenPts.length - 1][0] < x) return false;

                    // find between which segment the point is
                    for (var i = 0; i < cenPts.length; i++) {
                        if (cenPts[i][0] > x) return i;
                    }
                }

                function getClickedLines(mouseClick) {
                    var clicked = [];
                    var clickedCenPts = [];


                    // find which data is activated right now
                    var activeData = getActiveData();
                    // find centriod points
                    var graphCentPts = getCentroids(activeData);

                    if (graphCentPts.length == 0) return false;

                    // find between which axes the point is
                    var axeNum = findAxes(mouseClick, graphCentPts[0]);
                    if (!axeNum) return false;

                    graphCentPts.forEach(function (d, i) {
                        if (isOnLine(d[axeNum - 1], d[axeNum], mouseClick, 2)) {
                            clicked.push(activeData[i]);
                            clickedCenPts.push(graphCentPts[i]); // for tooltip
                        }
                    });

                    return [clicked, clickedCenPts]
                }

                // Add highlight for every line on click
                function getCentroids(data) {
                    // this function returns centroid points for data. I had to change the source
                    // for parallelcoordinates and make compute_centroids public.
                    // I assume this should be already somewhere in graph and I don't need to recalculate it
                    // but I couldn't find it so I just wrote this for now
                    var margins = graph.margin();
                    var graphCentPts = [];

                    data.forEach(function (d) {

                        var initCenPts = graph.compute_centroids(d).filter(function (d, i) {
                            return i % 2 == 0;
                        });


                        // move points based on margins
                        var cenPts = initCenPts.map(function (d) {
                            return [d[0] + margins["left"], d[1] + margins["top"]];
                        });

                        graphCentPts.push(cenPts);
                    });

                    return graphCentPts;
                }

                function cleanTooltip() {
                    // removes any object under #tooltip is
                    graph.svg.selectAll("#tooltip")
                        .remove();
                }

                function addTooltip(clicked, clickedCenPts) {
                    // sdd tooltip to multiple clicked lines
                    var clickedDataSet = [];
                    var margins = graph.margin()

                    // get all the values into a single list
                    // I'm pretty sure there is a better way to write this is Javascript
                    for (var i = 0; i < clicked.length; i++) {
                        for (var j = 0; j < clickedCenPts[i].length; j++) {
                            var text = d3.values(clicked[i])[j];
                            // not clean at all!
                            var x = clickedCenPts[i][j][0] - margins.left;
                            var y = clickedCenPts[i][j][1] - margins.top;
                            clickedDataSet.push([x, y, text]);
                            break;
                        }
                    }

                    // add rectangles
                    var fontSize = 14;
                    var padding = 2;
                    var rectHeight = fontSize + 2 * padding; //based on font size

                    graph.svg.selectAll("rect[id='tooltip']")
                        .data(clickedDataSet)
                        .enter()
                        .append("rect")
                        .attr("x", function (d) {
                            return d[0] - d[2].length * 5;
                        })
                        .attr("y", function (d) {
                            return d[1] - rectHeight + 2 * padding;
                        })
                        .attr("rx", "2")
                        .attr("ry", "2")
                        .attr("id", "tooltip")
                        .attr("fill", "grey")
                        .attr("opacity", 0.9)
                        .attr("width", function (d) {
                            return d[2].length * 10;
                        })
                        .attr("height", rectHeight)
                        .html(function(d){return d;});

                    // add text on top of rectangle
                    graph.svg.selectAll("text[id='tooltip']")
                        .data(clickedDataSet).enter()
                        .append("text")
                        .attr("x", function (d) {
                            return d[0];
                        })
                        .attr("y", function (d) {
                            return d[1];
                        })
                        .attr("id", "tooltip")
                        .attr("fill", "white")
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontSize)
                        .text(function (d) {
                            return d[2];
                        })
                }

                function highlightLineOnClick(mouseClick, drawTooltip) {

                    var clicked = [];
                    var clickedCenPts = [];

                    clickedData = getClickedLines(mouseClick);

                    if (clickedData && clickedData[0].length != 0) {

                        clicked = clickedData[0];
                        clickedCenPts = clickedData[1];

                        // highlight clicked line
                        graph.highlight(clicked);

                        if (drawTooltip) {
                            // clean if anything is there
                            cleanTooltip();
                            // add tooltip
                            addTooltip(clicked, clickedCenPts);
                        }
                    }
                };
                function is10Point2() {
                    return !(typeof me.addThresholdMenuItem === 'function');
                };
            }
        })
}());
//@ sourceURL=ParaCoorDataProcessing.js