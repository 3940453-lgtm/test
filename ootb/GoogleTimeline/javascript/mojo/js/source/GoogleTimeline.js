(function () {
    if (!mstrmojo.plugins.GoogleTimeline) {
        mstrmojo.plugins.GoogleTimeline = {};
    }


    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.plugins.GoogleTimeline._ParseDate"
    );


    mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES = {
        HIDE_ROW_LABELS: 'hideRowLabels',
        HIDE_BAR_LABELS: 'hideBarLabels',
        BAR_LABEL_FONT: 'barLabelFont',
        ROW_LABEL_FONT: 'rowLabelFont'

    };

    mstrmojo.plugins.GoogleTimeline.GoogleTimeline = mstrmojo.declare(
        mstrmojo.CustomVisBase,

        [mstrmojo.plugins.GoogleTimeline._ParseDate],

        {
            scriptClass: "mstrmojo.plugins.GoogleTimeline.GoogleTimeline",
            cssClass: "googletimeline",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires four attributes and one metric.",
            externalLibraries: [{url: "//www.gstatic.com/charts/loader.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine
            supportPagination: true, // indicate the widget supports pagination when export to PDF

            _hackedStyleSheet: null,
            _hackedRuleIndex: -1,

            preExport: function preExport() {
                // google timelines hack: hide scrollbar to show all the content
                if ((document.styleSheets || []).length) {
                    this._hackedStyleSheet = document.styleSheets[0];
                    try {
                        this._hackedRuleIndex = this._hackedStyleSheet.insertRule('::-webkit-scrollbar {display: none!important}');   
                    } catch(e) {} // do nothing
                }

                return this._super();
            },

            postExport: function() {
                // restore google timelines hack made in preExport
                if (this._hackedStyleSheet && this._hackedRuleIndex > 0) {
                    this._hackedStyleSheet.deleteRule(this._hackedRuleIndex);
                }
            },

            prePrint: function() {
                if (!this.canScrollDown()) {
                    var c = this.getPaginationContainer();
                    var defSvg = c.previousElementSibling;

                    if (defSvg && mstrmojo.dom.checkTagName(defSvg, 'svg')) {
                        var offset = c.scrollHeight - c.firstElementChild.clientHeight;
                        defSvg.style.transform = 'translateY(-' + offset + 'px)';
                    }
                }
            },

            _paginationContainer: null,

            getPaginationContainer: function getPaginationContainer() {
                var pc = this._paginationContainer;

                if (!pc) {
                    var dn = this.domNode,
                        findContainerRec = function(root) {
                            var res;

                            try {
                                mstrmojo.array.forEach(root.children || [], function(c) {
                                    if (containsOnlySvgChart(c)) {
                                        res = c;
                                        return false;
                                    } else if (!mstrmojo.dom.checkTagName(c, 'svg')) {
                                        res = findContainerRec(c);
                                        if (res) {
                                            return false;
                                        }
                                    }
                                });
                            } catch (e) {
                                log(e)
                            }

                            return res;
                        },
                        containsOnlySvgChart = function(node) {
                            return node && node.childElementCount === 1 && mstrmojo.dom.checkTagName(node.firstElementChild, 'svg') && node.firstElementChild.getAttribute('aria-label') === 'A chart.';
                        };

                    pc = this._paginationContainer = findContainerRec(dn) || dn;
                }
                
                return pc;
            },

            canScrollRight: function canScrollRight() {
                return false;
            },

            getHideRowLabelsOption: function getHideRowLabelsOption() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    hideRowLabels = this.getProperty(GTL_PROPERTIES.HIDE_ROW_LABELS);
                return hideRowLabels;

            },
            getHideBarLabelsOption: function getHideBarLabelsOption() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    hideBarLabels = this.getProperty(GTL_PROPERTIES.HIDE_BAR_LABELS);
                return hideBarLabels;

            },
            getBarLabelFontStyle: function getBarLabelFontStyle() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    getFontStyle = this.getProperty(GTL_PROPERTIES.BAR_LABEL_FONT);
                return getFontStyle;
            },
            getRowLabelFontStyle: function getRowLabelFontStyle() {
                var GTL_PROPERTIES = mstrmojo.plugins.GoogleTimeline.GTL_PROPERTIES,
                    getFontStyle = this.getProperty(GTL_PROPERTIES.ROW_LABEL_FONT);
                return getFontStyle;
            },


            plot: function () {

                var me = this;

                var is10Point2 = true;

                if (typeof this.addThresholdMenuItem == 'function') {
                    is10Point2 = false;

                }

                //move the data fetch method out of the callback to let the exception be caught when there is not sufficient data in the drop zones.
                var orgDataTree = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
                var orgData = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {
                    hasSelection: true
                });
                //throw error explicitly.
                if (orgData.length === 0 || orgData[0].headers.length < 4) {
                    throw "insufficient data!";
                }
                if (!google.visualization || !google.visualization.Timeline) {
                    google.load('visualization', '1.1', {
                        "callback": drawChart,
                        packages: ["timeline"]
                    });
                } else {
                    drawChart();
                }

                if (!is10Point2) {
                    me.setDefaultPropertyValues({
                        barLabelFont: {
                            fontSize: '14pt',
                            fontFamily: 'Arial',
                            fontColor: '#000'
                        },
                        rowLabelFont: {
                            fontSize: '14pt',
                            fontFamily: 'Arial',
                            fontColor: '#000'
                        },
                        hideRowLabels: 'false',
                        hideBarLabels: 'false'

                    });
                }

                function drawChart() {
                    var chart = new google.visualization.Timeline(me.domNode);

                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn({
                        type: 'string',
                        id: 'Position'
                    });
                    dataTable.addColumn({
                        type: 'string',
                        id: 'Name'
                    });
                    dataTable.addColumn({
                        type: 'date',
                        id: 'Start'
                    });
                    dataTable.addColumn({
                        type: 'date',
                        id: 'End'
                    });


                    for (i = 0; i < orgData.length; i++) {

                        var categoryName = orgData[i].headers[0].name;
                        var name = orgData[i].headers[1].name;
                        var beginDate = orgData[i].headers[2].name;
                        var endDate = orgData[i].headers[3].name;

                        var bdParse = me.parseDate(beginDate);
                        var edParse = me.parseDate(endDate);
                        var bd = typeof(bdParse) === "number" ? new Date(bdParse) : bdParse;
                        var ed = typeof(edParse) === "number" ? new Date(edParse) : edParse;


                        dataTable.addRows([
                            [categoryName, name, bd, ed]
                        ]);

                    }
                    var options = {
                        timeline: {
                            showRowLabels: false,
                            showBarLabels: true,
                            rowLabelStyle: {fontName: '', fontSize: 14, color: ''},
                            barLabelStyle: {fontName: '', fontSize: 14}
                        },
                        avoidOverlappingGridLines: false,
                        tooltip: {isHTML: true}
                    };

                    if (!is10Point2) {
                        //check the hide row label option
                        if (me.getHideRowLabelsOption() === 'true') {
                            options.timeline.showRowLabels = false;
                        } else {
                            options.timeline.showRowLabels = true;
                        }
                        //check the hide bar label option
                        if (me.getHideBarLabelsOption() === 'true') {
                            options.timeline.showBarLabels = false;
                        } else {
                            options.timeline.showBarLabels = true;
                        }

                        var barLabelStyle = me.getBarLabelFontStyle();
                        var rowLabelStyle = me.getRowLabelFontStyle();
                        //update bar label style
                        if (barLabelStyle) {

                            if (barLabelStyle.fontSize) {
                                var fontSize = barLabelStyle.fontSize;

                                var len = fontSize.length;
                                var newSize = fontSize.substr(0, len - 2);
                                options.timeline.barLabelStyle.fontSize = newSize;
                            }
                            if (barLabelStyle.fontFamily) {
                                options.timeline.barLabelStyle.fontName = barLabelStyle.fontFamily;
                            }

                        }
                        //update row label style
                        if (rowLabelStyle) {
                            if (rowLabelStyle.fontColor) {
                                options.timeline.rowLabelStyle.color = rowLabelStyle.fontColor;
                            }
                            if (rowLabelStyle.fontSize) {
                                var fontSize = rowLabelStyle.fontSize;

                                var len = fontSize.length;
                                var newSize = fontSize.substr(0, len - 2);
                                options.timeline.rowLabelStyle.fontSize = newSize;
                            }
                            if (rowLabelStyle.fontFamily) {
                                options.timeline.rowLabelStyle.fontName = rowLabelStyle.fontFamily;
                            }

                        }
                    }

                    chart.draw(dataTable, options);

                    // raise event for New Export Engine
                    me.raiseEvent({
                        name: 'renderFinished',
                        id: me.k
                    });


                }

            }

        })
}());
//@ sourceURL=GoogleTimeline.js