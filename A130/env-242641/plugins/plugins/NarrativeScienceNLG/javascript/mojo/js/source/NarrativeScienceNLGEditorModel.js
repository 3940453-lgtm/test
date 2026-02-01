(function () {
    if (!mstrmojo.plugins.NarrativeScienceNLG) {
        mstrmojo.plugins.NarrativeScienceNLG = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array",
        "mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGConfig"
    );
	
	var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

    mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGEditorModel",
            cssClass: "narrativesciencenlgeditormodel",
            getCustomProperty: function getCustomProperty() {
				var myViz = this.getHost(),
                    narrativescienceProps = {
                        name : "NLG Basic Settings",
                        value: []
                    },
                    chartTyleCtl = {
                        style: $WT.EDITORGROUP,
                        items: [
                            {
                                style: $WT.TWOCOLUMN,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        width: "50%",
                                        labelText: "Chart Type"
                                    },
                                    {
                                        style: $WT.PULLDOWN,
                                        propertyName: "chartType",
                                        width: "50%",
                                        items: [
                                            {
                                                name: "Bar",
                                                value: "barchart"
                                            },
                                            {
                                                name: "Line",
                                                value: "linechart"
                                            },
                                            {
                                                name: "Pie",
                                                value: "piechart"
                                            },
                                            {
                                                name: "Scatter",
                                                value: "scatterplot"
                                            },
                                            {
                                                name: "Histogram",
                                                value: "histogram"
                                            }
                                        ]/*,
							config: {
								suppressData: true,
								callback: function(){
									myViz.drawStory();
								}
							}
                            */
						            }
                                ]
                            }
                        ]
                    },
                    authoringCtl,
                    metricsNum,
                    options,
                    options1,
                    i,
                    op,
                    applyMeasureChange,
                    measureCtl,
                    attNum,
                    dimOptions,
                    obj,
                    name,
                    p,
                    fontCtl,
                    goodFontCtl,
                    badFontCtl,
                    props,
                    analyticProps,
                    line,
                    bar,
                    hist,
                    driverProps,
                    n,
                    g,
                    j,
                    n1,
                    c,
                    g1,
                    currencyOptions,
                    currencyList,
                    metricList = myViz.zonesModel.dropZones[1].items,
                    driverList = myViz.zonesModel.dropZones[2].items;
                
                narrativescienceProps.value.push(chartTyleCtl);
				
				authoringCtl = {
                    style: $WT.EDITORGROUP,
					items: [
                        {
                            style: $WT.LABEL,
                            name: "authoring",
                            width: "100%",
                            labelText: "Authoring Configuration"
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "formatText",
                                    width: "50%",
                                    labelText: "Format"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "format",
                                    width: "50%",
                                    items: [
                                        {
                                            name: "bullets",
                                            value: "bullets"
                                        },
                                        {
                                            name: "paragraph",
                                            value: "paragraph"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "verbosityText",
                                    width: "50%",
                                    labelText: "Verbosity"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "verbosity",
                                    width: "50%",
                                    items: [
                                        {
                                            name: "low",
                                            value: "low"
                                        },
                                        {
                                            name: "medium",
                                            value: "medium"
                                        },
                                        {
                                            name: "high",
                                            value: "high"
                                        }
                                    ]
                                }
                            ]
                        }/*,
                         Hide this option
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: "runSupportStory",
                            labelText: "Run Support Story"
                        },
                        
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: "isLinked2Chart",
                            labelText: "Is Linked to Chart"
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: "selectionMade",
                            labelText: "Selection Made"
                        }
                        */
                    ]
                };
				narrativescienceProps.value.push(authoringCtl);
				metricsNum = myViz.gridData.gts.col.length === 0 ? 0 : myViz.gridData.gts.col[0].es.length;
				options = [];
				options.push({
					name: 'All',
					value: 'all'
				});
				options1 = [{name: "None", value: 'none'}];
				for (i = 0; i < metricList.length; i = i + 1) {
                    op = {};
                    op.name = metricList[i].n;
                    op.value = myViz.makeID(op.name);
                    options.push(op);
                }
                /*
                for (i = 0; i < metricsNum; i = i + 1) {
					op = {};
					op.name =  myViz.gridData.gts.col[0].es[i].n;
					op.value = myViz.makeID(op.name);//op.name.replace(' ', '_');
					options.push(op);
					options1.push(op);
				}
				*/
				applyMeasureChange = function () {
					myViz.applyMeasureProperty();
				};
                currencyOptions = [];
                currencyList = mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGConfig.currency;
                for (i = 0; i < currencyList.length; i = i + 1) {
                    op = {};
                    op.name = currencyList[i];
                    op.value = currencyList[i];
                    currencyOptions.push(op);
                }
				measureCtl = {
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            name: "measurelable",
                            width: "100%",
                            labelText: "Metric Customizations"
                        },
                        {
                            style: $WT.PULLDOWN,
                            propertyName: "metricName",
                            items: options,
                            config: {
                                suppressData: true,
                                onPropertyChange: function (propertyName, newValue) {
                                  //myViz.setMeasureProperty();
                                    var m = newValue,
                                        format = myViz.getProperty(m + 'measureFormat') || myViz.getProperty('allmeasureFormat'),
                                        currency = myViz.getProperty(m + 'currency') || myViz.getProperty('allcurrency'),
                                        sentiment = myViz.getProperty(m + 'upSentiment') || myViz.getProperty('allupSentiment'),
                                        cumulative = myViz.getProperty(m + 'cumulative') || myViz.getProperty('allcumulative'),
                                        parentmetric = myViz.getProperty(m + 'parentmetric') || myViz.getProperty('parentmetric'),
                                        relationType = myViz.getProperty(m + 'relationType') || myViz.getProperty('relationType'),
                                        numOfPeriods = myViz.getProperty(m + 'numOfPeriods') || myViz.getProperty('numOfPeriods'),
                                        timeUnit = myViz.getProperty(m + 'timeUnit') || myViz.getProperty('timeUnit');
                                    return {
                                        measureFormat: format,
                                        currency: currency,
                                        upSentiment: sentiment,
                                        cumulative: cumulative,
                                        parentmetric: parentmetric,
                                        relationType: relationType,
                                        numOfPeriods: numOfPeriods,
                                        timeUnit: timeUnit
                                    };
                                },
                                callback: function () {
                                }
                            }
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "formatText",
                                    width: "60%",
                                    labelText: "Format"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "measureFormat",
                                    width: "40%",
                                    items: [
                                        {
                                            name: "number",
                                            value: "number"
                                        },
                                        {
                                            name: "money",
                                            value: "money"
                                        },
                                        {
                                            name: "percent",
                                            value: "percent"
                                        }
                                    ],
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'measureFormat'] = newValue;
                                            return obj;
                                        },
                                        suppressData: true,
                                        callback: applyMeasureChange
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "currencyText",
                                    width: "60%",
                                    labelText: "Currency"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "currency",
                                    width: "40%",
                                    disabled: myViz.getProperty('measureFormat') !== 'money',
                                    items: currencyOptions,/*[
                                        {
                                            name: "USD",
                                            value: "USD"
                                        },
                                        {
                                            name: "EUR",
                                            value: "EUR"
                                        },
                                        {
                                            name: 'JPY',
                                            value: 'JPY'
                                        },
                                        {
                                            name: "CNY",
                                            value: "CNY"
                                        },
                                        {
                                            name: 'GBP',
                                            value: 'GBP'
                                        },
                                        {
                                            name: 'CAD',
                                            value: 'CAD'
                                        }
                                    ],*/
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'currency'] = newValue;
                                            return obj;
                                        },
                                        suppressData: true,
                                        callback: applyMeasureChange
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "sentimentText",
                                    width: "60%",
                                    labelText: "Larger Values Are"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "upSentiment",
                                    width: "40%",
                                    items: [
                                        {
                                            name: "good",
                                            value: "good"
                                        },
                                        {
                                            name: "neutral",
                                            value: "neutral"
                                        },
                                        {
                                            name: "bad",
                                            value: "bad"
                                        }
                                    ],
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'upSentiment'] = newValue;
                                            return obj;
                                        },
                                        suppressData: true,
                                        callback: applyMeasureChange
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "cumulativeText",
                                    width: "60%",
                                    labelText: "Show Cumulative"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "cumulative",
                                    width: "40%",
                                    items: [
                                        {
                                            name: "Cumulative",
                                            value: "cumulative"
                                        },
                                        {
                                            name: "Yes",
                                            value: "add_values"
                                        },
                                        {
                                            name: "No",
                                            value: "none"
                                        }
                                    ],
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'cumulative'] = newValue;
                                            return obj;
                                        },
                                        suppressData: true,
                                        callback: applyMeasureChange
                                    }
                                }
                            ]
                        }/*,
                        Hide these options
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "parentText",
                                    width: "50%",
                                    labelText: "Parent Metric"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "parentmetric",
                                    width: "50%",
                                    items: options1,
                                    disabled: (!myViz.getProperty('metricName')) || myViz.getProperty('metricName') === 'all',
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'parentmetric'] = newValue;
                                            return obj;
                                        },
                                        suppressData: true,
                                        callback: applyMeasureChange
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: "relationTypeText",
                                    width: "50%",
                                    labelText: "Relation Type"
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: "relationType",
                                    width: "50%",
                                    items: [
                                        {
                                            name: 'component',
                                            value: 'component'
                                        },
                                        {
                                            name: 'benchmark',
                                            value: 'benchmark'
                                        },
                                        {
                                            name: 'previous',
                                            value: 'previous'
                                        }
                                    ],
                                    disabled: (!myViz.getProperty('metricName')) || myViz.getProperty('metricName') === 'all',
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'relationType'] = newValue;
                                            return obj;
                                        },
                                        suppressData: true,
                                        callback: applyMeasureChange
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Num of Periods'
                                },
                                {
                                    style: $WT.STEPPER,
                                    width: '50%',
                                    min: 1,
                                    max: 1000,
                                    propertyName: 'numOfPeriods',
                                    disabled: myViz.getProperty('relationType') !== 'previous',
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'numOfPeriods'] = newValue;
                                            return obj;
                                        },
								        suppressData: true,
								        callback: applyMeasureChange
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Time Unit'
                                },
                                {
                                    style: $WT.TEXTBOX,
                                    width: '50%',
                                    propertyName: 'timeUnit',
                                    disabled: myViz.getProperty('relationType') !== 'previous',
                                    config: {
                                        onPropertyChange: function (propertyName, newValue) {
                                            var mn = myViz.getProperty('metricName'),
                                                obj = {};
                                            obj[mn + 'timeUnit'] = newValue;
                                            return obj;
                                        },
								        suppressData: true,
								        callback: applyMeasureChange
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'outside',
                            labelText: 'Outside',
                            config: {
                                onPropertyChange: function (propertyName, newValue) {
                                    var mn = myViz.getProperty('metricName'),
                                        obj = {};
                                    obj[mn + 'outside'] = newValue;
                                    return obj;
                                },
                                suppressData: true,
                                callback: applyMeasureChange
                            }
                        }
                        */
                    ]
                };
				narrativescienceProps.value.push(measureCtl);
				
                
                attNum = myViz.gridData.gts.row.length;
                dimOptions = [{name: 'None', value: 'none'}];
                for (i = 0; i < attNum; i = i + 1) {
                    obj = myViz.gridData.gts.row[i];
                    name = myViz.makeID(obj.dn);//obj.dn.replace(' ', '_');
                    
                    dimOptions.push({
                        name: obj.dn,
                        value: name
                    });
                    
                    p = {
                        style: $WT.EDITORGROUP,
                        items: [
                            {
                                style: $WT.LABEL,
                                width: '100%',
                                labelText: 'Attribute ' + obj.dn// + ' (separate by ;)'
                            },
                            {
                                style: $WT.TWOCOLUMN,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        width: '30%',
                                        labelText: 'Singular:'
                                    },
                                    {
                                        style: $WT.TEXTBOX,
                                        propertyName: name + 'singular',
                                        width: '70%'
                                    }
                                ]
                            },
                            {
                                style: $WT.TWOCOLUMN,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        width: '30%',
                                        labelText: 'Plural:'
                                    },
                                    {
                                        style: $WT.TEXTBOX,
                                        propertyName: name + 'plural',
                                        width: '70%'
                                    }
                                ]
                            }
                        ]
                    };
                    narrativescienceProps.value.push(p);
                }
				
				fontCtl = {
					style: $WT.EDITORGROUP,
					items: [
                        {
                            style: $WT.LABEL,
                            name: "content",
                            width: "100%",
                            labelText: "Content Font"
                        },
                        {
                            style: $WT.CHARACTERGROUP,
                            propertyName: "contentfont",
                            config: {
                                suppressData: true,
                                callback: function () {
                                    myViz.applyFontStyle();
                                }
                            }
                        }
                    ]
                };
                goodFontCtl = {
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            width: '100%',
                            labelText: 'Highlight Font (Good)'
                        },
                        {
                            style: $WT.CHARACTERGROUP,
                            propertyName: 'highlightFont',
                            config: {
                                suppressData: true,
                                callback: function () {
                                    myViz.applyHighlightFont();
                                }
                            }
                        }
                    ]
                };
                badFontCtl = {
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            width: '100%',
                            labelText: 'Highlight Font (Bad)'
                        },
                        {
                            style: $WT.CHARACTERGROUP,
                            propertyName: 'highlightFontBad',
                            config: {
                                suppressData: true,
                                callback: function () {
                                    myViz.applyHighlightFont();
                                }
                            }
                        }
                    ]
                };
                
				narrativescienceProps.value.push(fontCtl);
                narrativescienceProps.value.push(goodFontCtl);
                narrativescienceProps.value.push(badFontCtl);
				props = [];
				props.push(narrativescienceProps);
                /*
				analyticProps = {
					name: "Custom Analytics",
					value: [
					]
				};
				line = {
				    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            name: 'lineanalyticsText',
                            width: '100%',
                            labelText: 'Continuous Narratives'
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableSegments',
                                    labelText: 'Segments',
                                    width: '60%',
                                    disabled: myViz.getProperty('chartType') !== 'linechart'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'segmentsIndex',
                                    min: 0,
                                    max: 3,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableSegments') !== 'true' || myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '70%',
                                    labelText: 'Inclusion (float value)'
                                },
                                {
                                    style: $WT.TEXTBOX,
                                    width: '30%',
                                    propertyName: 'segmentsInclusion',
                                    disabled: myViz.getProperty('enableSegments') !== 'true' || myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '70%',
                                    labelText: 'Formatting (float value)'
                                },
                                {
                                    style: $WT.TEXTBOX,
                                    width: '30%',
                                    propertyName: 'segmentsFormatting',
                                    disabled: myViz.getProperty('enableSegments') !== 'true' || myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableTrendline',
                                    labelText: 'Trendline',
                                    width: '60%',
                                    disabled: myViz.getProperty('chartType') !== 'linechart'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'trendlineIndex',
                                    min: 0,
                                    max: 3,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableTrendline') !== 'true' || myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '70%',
                                    labelText: 'Inclusion (float value)'
                                },
                                {
                                    style: $WT.TEXTBOX,
                                    width: '30%',
                                    propertyName: 'trendlineInclusion',
                                    disabled: myViz.getProperty('enableTrendline') !== 'true' || myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    name: 'thresholdFormattingText',
                                    width: '70%',
                                    labelText: 'Formatting (float value)'
                                },
                                {
                                    style: $WT.TEXTBOX,
                                    width: '30%',
                                    propertyName: 'trendlineFormatting',
                                    disabled: myViz.getProperty('enableTrendline') !== 'true' || myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '70%',
                                    labelText: 'Prediction Periods'
                                },
                                {
                                    style: $WT.STEPPER,
                                    width: '30%',
                                    propertyName: 'trendlinePrediction',
                                    min: 1,
                                    max: 14,
                                    disabled: (myViz.getProperty('enableTrendline') !== 'true') || myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableVolatility',
                                    labelText: 'Volatility',
                                    width: '60%',
                                    disabled: myViz.getProperty('chartType') !== 'linechart'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'volatilityIndex',
                                    min: 0,
                                    max: 3,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableVolatility') !== 'true'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableCorrelation',
                                    labelText: 'Correlation',
                                    width: '60%',
                                    disabled: myViz.getProperty('chartType') !== 'linechart'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'correlationIndex',
                                    min: 0,
                                    max: 3,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableCorrelation') !== 'true'
                                }
                            ]
                        }
                    ]
				};
                analyticProps.value.push(line);
                bar = {
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            name: 'discreteText',
                            width: '100%',
                            labelText: 'Discrete Narratives'
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableClustering',
                                    labelText: 'Clustering',
                                    width: '60%',
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'barchart'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'clusteringIndex',
                                    min: 0,
                                    max: 2,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableClustering') !== 'true'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableDistribution',
                                    labelText: 'Distribution',
                                    width: '60%',
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'barchart'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'distributionIndex',
                                    min: 0,
                                    max: 2,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableDistribution') !== 'true'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableBarCorrelation',
                                    labelText: 'Correlation',
                                    width: '60%',
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'barchart'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'barCorrelationIndex',
                                    min: 0,
                                    max: 2,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableBarCorrelation') !== 'true'
                                }
                            ]
                        }
                    ]
                };
                analyticProps.value.push(bar);
                
                hist = {
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            name: 'histText',
                            width: '100%',
                            labelText: 'Histogram Narratives'
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enablePopulation',
                                    labelText: 'Cohort',
                                    width: '60%',
                                    disabled: myViz.getProperty('chartType') !== 'histogram'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'populationIndex',
                                    min: 0,
                                    max: 1,
                                    width: '40%',
                                    disabled: myViz.getProperty('enablePopulation') !== 'true'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: 'enableAggregation',
                                    labelText: 'Time Series',
                                    width: '60%',
                                    disabled: myViz.getProperty('chartType') !== 'histogram'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'aggregationIndex',
                                    min: 0,
                                    max: 1,
                                    width: '40%',
                                    disabled: myViz.getProperty('enableAggregation') !== 'true'
                                }
                            ]
                        }
                    ]
                };
                analyticProps.value.push(hist);
                props.push(analyticProps);
                */
				
                driverProps = {
					name: "NLG Advanced Settings",
					value: [
                        /*
                        {
                            style: $WT.EDITORGROUP,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '100%',
                                    labelText: 'Measure Drivers(only for linechart)'
                                }
                            ]
                            
                        }
                        */
					]
				};
                
                line = {
				    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            name: 'lineanalyticsText',
                            width: '100%',
                            labelText: 'Analytics'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableSegments',
                            labelText: 'Segments'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableTrendline',
                            labelText: 'Trendline'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableVolatility',
                            labelText: 'Volatility'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableCorrelation',
                            labelText: 'Correlation'
                        }
                    ]
				};
                bar = {
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            name: 'discreteText',
                            width: '100%',
                            labelText: 'Analytics'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableClustering',
                            labelText: 'Clustering'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableDistribution',
                            labelText: 'Distribution'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableBarCorrelation',
                            labelText: 'Correlation'
                        }
                    ]
                };
                hist = {
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            name: 'histText',
                            width: '100%',
                            labelText: 'Analytics'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enablePopulation',
                            labelText: 'Cohort'
                        },
                        {
                            style: $WT.CHECKBOXANDLABEL,
                            propertyName: 'enableAggregation',
                            labelText: 'Time Series'
                        }
                    ]
                };
                if (myViz.getProperty('chartType') === 'linechart') {
                    driverProps.value.push(line);
                    
                    if(metricList.length > 0 && driverList.length > 0) {
                        var driverCtls = {
                            style: $WT.EDITORGROUP,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '100%',
                                    labelText: 'Metric Drivers'
                                }
                            ]
                        };
                        driverProps.value.push(driverCtls);
                        for (i = 0; i < metricList.length; i = i + 1) {
                            n = metricList[i].n;
                            g = {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        width: '100%',
                                        labelText: 'Drivers for ' + n
                                    }
                                ]
                            };
                            for (j = 0; j < driverList.length; j = j + 1) {
                                n1 = driverList[j].n;
                                c = {
                                    style: $WT.CHECKBOXANDLABEL,
                                    labelText: n1,
                                    propertyName: myViz.makeID(n + '' + n1)//n.replace(' ', '_')+n1.replace(' ', '_')
                                };
                                g.items.push(c);
                            }
                            driverProps.value.push(g);
                        }
                    }
                    
                } else if (!myViz.getProperty('chartType') || myViz.getProperty('chartType') === 'barchart') {
                    driverProps.value.push(bar);
                } else if (myViz.getProperty('chartType') === 'histogram') {
                    driverProps.value.push(hist);
                } else {
                    console.log('No analytics');
                }
                
                
                
                /*
                if (metricsNum > 1) {
                    for (i = 0; i < metricsNum; i = i + 1) {
                        n = myViz.gridData.gts.col[0].es[i].n;
                        g = {
                            style: $WT.EDITORGROUP,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '100%',
                                    labelText: 'Drivers for ' + n
                                }
                            ]
                        };
                        for (j = 0; j < metricsNum; j = j + 1) {
                            if (i !== j) {
                                n1 = myViz.gridData.gts.col[0].es[j].n;
                                c = {
                                    style: $WT.CHECKBOXANDLABEL,
                                    labelText: n1,
                                    propertyName: myViz.makeID(n + '' + n1),//n.replace(' ', '_')+n1.replace(' ', '_'),
                                    disabled: myViz.getProperty('chartType') !== 'linechart'
                                };
                                g.items.push(c);
                            }
                        }
                        driverProps.value.push(g);
                    }
                } else {
                    g1 = {
                        style: $WT.LABEL,
                        width: '100%',
                        labelText: 'Not enough metrics'
                    };

                    driverProps.value[0].items.push(g1);
                }
                */
                /*driverProps.value.push({
                    style: $WT.EDITORGROUP,
                    items: [
                        {
                            style: $WT.LABEL,
                            width: '100%',
                            labelText: 'Focus Filter Setting'
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Dimension'
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: 'focusDim',
                                    width: '50%',
                                    items: dimOptions,
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'linechart' && myViz.getProperty('chartType') !== 'barchart'
                                }
                            ]
                           
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Measure'
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: 'focusMea',
                                    width: '50%',
                                    items: options1,
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'linechart' && myViz.getProperty('chartType') !== 'barchart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Metrics (Continuous)'
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: 'focusMetricCon',
                                    width: '50%',
                                    items: [
                                        {
                                            name: 'Starting Value',
                                            value: 'starting_value'
                                        },
                                        {
                                            name: 'Ending Value',
                                            value: 'ending_value'
                                        },
                                        {
                                            name: 'Average',
                                            value: 'average'
                                        },
                                        {
                                            name: 'Median',
                                            value: 'median'
                                        },
                                        {
                                            name: 'Percent Difference',
                                            value: 'pct_diff'
                                        },
                                        {
                                            name: 'Absolute Change',
                                            value: 'absolute_change'
                                        },
                                        {
                                            name: 'Volatility',
                                            value: 'volatility'
                                        }
                                    ],
                                    disabled: myViz.getProperty('chartType') !== 'linechart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Metrics (Discrete)'
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: 'focusMetricDis',
                                    width: '50%',
                                    items: [
                                        {
                                            name: 'Total Value',
                                            value: 'total_value'
                                        },
                                        {
                                            name: 'Average',
                                            value: 'average'
                                        },
                                        {
                                            name: 'Median',
                                            value: 'median'
                                        }
                                    ],
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'barchart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Num of Items'
                                },
                                {
                                    style: $WT.STEPPER,
                                    propertyName: 'focusNum',
                                    width: '50%',
                                    min: 1,
                                    max: 1000,
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'linechart' && myViz.getProperty('chartType') !== 'barchart'
                                }
                            ]
                        },
                        {
                            style: $WT.TWOCOLUMN,
                            items: [
                                {
                                    style: $WT.LABEL,
                                    width: '50%',
                                    labelText: 'Rank Group'
                                },
                                {
                                    style: $WT.PULLDOWN,
                                    propertyName: 'focusRank',
                                    width: '50%',
                                    items: [
                                        {
                                            name: 'top',
                                            value: 'top'
                                        },
                                        {
                                            name: 'bottom',
                                            value: 'bottom'
                                        }
                                    ],
                                    disabled: (myViz.getProperty('chartType')) && myViz.getProperty('chartType') !== 'linechart' && myViz.getProperty('chartType') !== 'barchart'
                                }
                            ]
                        }
                    ]
                });*/
                
                
                
            
                props.push(driverProps);
                
                
				return props;
            }
        }
    );
}());
//@ sourceURL=NarrativeScienceNLGEditorModel.js
