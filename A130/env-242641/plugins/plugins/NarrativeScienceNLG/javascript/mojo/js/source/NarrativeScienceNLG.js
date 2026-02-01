(function () {
    if (!mstrmojo.plugins.NarrativeScienceNLG) {
        mstrmojo.plugins.NarrativeScienceNLG = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
		"mstrmojo.VisUtility",
		"mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGConfig"
    );
	
	
	function isTrue(value) {
		return value === 'true' || value === true ? true : false;
	}
	
    var $VISUTIL = mstrmojo.VisUtility,
        
        narrativeData = {
            metadata: {
                platform: 'MicroStrategy'
            },
            api_version: 2,
            data: {
                dimensions: [],
                measures: [],
                rows: []
            },
            configuration: {
                authoring: {},
                analytics: {},
                drivers: {}//,
                //relationships: {}
            }//,
            //focus: null,
            //selections: null
        };

    mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLG = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLG",
            cssClass: "narrativesciencenlg",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
			supportNEE: true,
			initProperties: function () {
				var defaultKey = mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGConfig.apiKey,
				    defaultEndpoint = mstrmojo.plugins.NarrativeScienceNLG.NarrativeScienceNLGConfig.endpoint;
                this.setDefaultPropertyValues({
                    endpoint: defaultEndpoint,
                    apiKey: defaultKey,
                    chartType: 'barchart',
                    format: 'paragraph',
                    verbosity: 'medium',
                    runSupportStory: 'false',
                    isLinked2Chart: 'false',
                    selectionMade: 'false',
                    
                    metricName: 'all',
                    measureFormat: 'number',
                    currency: 'USD',
                    upSentiment: 'neutral',
                    cumulative: 'none',
                    outside: 'false',
                    parentmetric: 'none',
                    relationType: 'component',
                    numOfPeriods: '1',
                    timeUnit: 'year',
                    
                    allmeasureFormat: 'number',
                    allcurrency: 'USD',
                    allupSentiment: 'neutral',
                    allcumulative: 'none',
                    alloutside: 'false',
                    allparentmetric: 'none',
                    allrelationType: 'component',
                    allnumOfPeriods: '1',
                    alltimeUnit: 'year',
                    
                    segmentsIndex: '0',
                    trendlineIndex: '1',
                    volatilityIndex: '2',
                    correlationIndex: '3',
                    clusteringIndex: '0',
                    distributionIndex: '1',
                    barCorrelationIndex: '2',
                    populationIndex: '0',
                    aggregationIndex: '1',
                    
                    enableTrendline: 'true',
                    trendlineInclusion: '0.001',
                    trendlineFormatting: '0',
                    enableSegments: 'true',
                    segmentsInclusion: '0',
                    segmentsFormatting: '0',
                    enableVolatility: 'true',
                    enableCorrelation: 'false',
                    
                    enableClustering: 'true',
                    enableDistribution: 'true',
                    enableBarCorrelation: 'false',
                    
                    enablePopulation: 'true',
                    enableAggregation: 'true',
                    
                    focusDim: 'none',
                    focusMea: 'none',
                    focusMetricCon: 'starting_value',
                    focusMetricDis: 'total_value',
                    focusNum: '1',
                    focusRank: 'top',
                    
                    contentfont: {
                        fontSize: '11pt',
                        fontFamily: 'Helvetica',
                        fontColor: '#000000'
                    },
                    highlightFont : {
                        fontSize: '11pt',
                        fontFamily: 'Helvetica',
                        fontColor: '#000000',
                        fontWeight: true
                    },
                    highlightFontBad : {
                        fontSize: '11pt',
                        fontFamily: 'Helvetica',
                        fontColor: '#000000',
                        fontWeight: true
                    }
                });
            },
			
			fillMeasures: function () {
                narrativeData.data.measures = [];
				var $DI = this.dataInterface,
                    mCnt = $DI.getTotalCols(),
                    i,
                    m,
                    name,
                    parentMetric,
                    relationType,
                    numOfPeriods,
                    timeUnit,
                    chartType,
                    d,
                    j,
                    name1,
                    driverList = this.zonesModel.getDropZoneObjectsByName('Drivers'),
                    driverFlag = false,
                    metricID;
				narrativeData.configuration.drivers = {};
				for (i = 0; i < mCnt; i = i + 1) {
					m = {};
					m.name = $DI.getColHeaders(0).getHeader(i).getName();
					m.id = this.makeID(m.name); //m.name.replace(' ', '_');
					name = this.makeID(m.name);//m.name.replace(' ', '_');
					driverFlag = false;
                    for (j = 0; j < driverList.length; j = j + 1) {
                        metricID = $DI.getColHeaders(0).getHeader(i).getObjectId();
                        if (metricID === driverList[j].id) {
                            m.outside = true;
                            driverFlag = true;
                            break;
                        }
                    }
                    if (!driverFlag) {
                        m.format = this.getProperty(name + 'measureFormat') || this.getProperty('allmeasureFormat');
                        if (m.format === 'money') {
                            m.format_options = {};
                            m.format_options.money_locale = this.getProperty(name + 'currency') || this.getProperty('allcurrency');
                        }
                        
                        m.up_sentiment = this.getProperty(name + 'upSentiment') || this.getProperty('allupSentiment');
                        m.cumulative = this.getProperty(name + 'cumulative') || this.getProperty('allcumulative');
                   
                    //m.outside = this.getProperty(name + 'outside') || isTrue(this.getProperty('alloutside'));
					
                    //metric relation
                    /* remove metric relation
                    parentMetric = this.getProperty(name + 'parentmetric') || this.getProperty('allparentmetric');
                    relationType = this.getProperty(name + 'relationType') || this.getProperty('allrelationType');
                    narrativeData.configuration.relationships[name] = {};
                    if (parentMetric && parentMetric !== 'none' && parentMetric !== name) {
                        narrativeData.configuration.relationships[name] = {
                            parent: parentMetric,
                            relation_type: relationType
                        };
                            
                        if (relationType === 'previous') {
                            numOfPeriods = this.getProperty(name + 'numOfPeriods') || this.getProperty('allnumOfPeriods');
                            timeUnit = this.getProperty(name + 'timeUnit') || this.getProperty('alltimeUnit');
                            narrativeData.configuration.relationships[name].config = {
                                num_of_periods: parseInt(numOfPeriods, 10),
                                time_unit: timeUnit
                            };
                        }
                    }
                    */
                    
                    //drivers metric
                        chartType = this.getProperty('chartType');
                        if (chartType === 'linechart') {
                            d = [];
                            j = 0;
                            for (j = 0; j < mCnt; j = j + 1) {
                                if (i !== j) {
                                    name1 = this.makeID($DI.getColHeaders(0).getHeader(j).getName());
                                    if (isTrue(this.getProperty(name + name1))) {
                                        d.push(name1);
                                    }
                                }
                            }
                            if (d.length > 0) {
                                narrativeData.configuration.drivers[name] = {drivers: d};
                            }
                        }
                    }
                    narrativeData.data.measures.push(m);
				}
			},
			
			fillDemensions: function () {
				narrativeData.data.dimensions = [];
				var $DI = this.dataInterface,
                    attrCnt = $DI.getRowTitles().titles.length,
                    chartType = this.getProperty('chartType'),
                    i,
                    a,
                    l,
                    singular,
                    plural,
                    singularTerms,
                    pluralTerms,
                    minLen,
                    j,
                    rawData,
                    order;
				for (i = 0; i < attrCnt; i = i + 1) {
					a = {};
					a.name = $DI.getRowTitles().getTitle(i).getName();
					a.id = this.makeID(a.name);//a.name.replace(' ', '_');
                    a.labels = [];
                    
                    singular = this.getProperty(a.id + 'singular');
                    plural = this.getProperty(a.id + 'plural');
                    
                    if (singular && singular.trim().length > 0) {
                        singularTerms = singular.split(';');
                        //l.singular = singular.trim()
                    }
                    if (plural && plural.trim().length > 0) {
                        pluralTerms = plural.split(';');
                        //l.plural = plural.trim();
                    }
                    
                    if (singularTerms && pluralTerms) {
                        minLen = singularTerms.length <= pluralTerms.length ? singularTerms.length : pluralTerms.length;
                        for (j = 0; j < minLen; j = j + 1) {
                            l = {};
                            l.singular = singularTerms[j].trim();
                            l.plural = pluralTerms[j].trim();
                            a.labels.push(l);
                        }
                    }
                    
                    //a.labels.push(l);
					
                    //order field for histogram
                    if (chartType === 'histogram' && i === 0) {
                        rawData = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
                        order = [];
                        rawData.children.forEach(function (child) {
                            order.push(child.name);
                        });
                        a.order = order;
                    }
                    
					narrativeData.data.dimensions.push(a);
				}
			},
			
			fillDataRows: function () {
                narrativeData.data.rows = [];
				
				var $DI = this.dataInterface,
                    rawData = $DI.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV),
                    rowCount = $DI.getTotalRows(),
                    attrCnt = $DI.getRowTitles().titles.length,
                    mCnt = $DI.getTotalCols(),
                    row,
                    i,
                    j,
                    att,
                    k,
                    m;
				
				for (i = 0; i < rowCount; i = i + 1) {
					row = [];
					for (j = 0; j < attrCnt; j = j + 1) {
						att = {};
						att.value = rawData[i].headers[j].name;
						att.id = $DI.getRowTitles().getTitle(j).getName() + '_' + att.value;
						row.push(att);
					}
					
					for (k = 0; k < mCnt; k = k + 1) {
						m = {};
						m.value = rawData[i].values[k].rv;
						m.id = 'm' + k + '_' + i;
						row.push(m);
					}
					
					narrativeData.data.rows.push(row);
				}
            },
			
			fillConfiguration: function () {
				narrativeData.configuration.authoring.verbosity = this.getProperty('verbosity');
				narrativeData.configuration.authoring.format = this.getProperty('format');
				narrativeData.configuration.authoring.run_support_story = false;//isTrue(this.getProperty('runSupportStory'));
				narrativeData.configuration.authoring.is_linked_to_chart = isTrue(this.getProperty('isLinked2Chart'));
				narrativeData.configuration.authoring.selection_made = isTrue(this.getProperty('selectionMade'));
                
                
                var chartType = this.getProperty('chartType'),
                    segmentsInclusion,
                    segmentsFormatting,
                    trendlineInclusion,
                    trendlineFormatting,
                    trendlinePrediction,
                    focusDim,
                    focusMea,
                    $DI = this.dataInterface,
                    rowCount = $DI.getTotalRows();
                
                narrativeData.configuration.analytics = {};
                if (chartType === 'linechart') {
                    if (isTrue(this.getProperty('enableSegments'))) {
                        narrativeData.configuration.analytics.segments = {
                            enabled: true,
                            index: parseInt(this.getProperty('segmentsIndex'), 10)
                        };
                        
                        narrativeData.configuration.analytics.segments.thresholds = {};
                        segmentsInclusion = this.getProperty('segmentsInclusion');
                        segmentsFormatting = this.getProperty('segmentsFormatting');
                        if (segmentsInclusion && segmentsInclusion.length > 0) {
                            narrativeData.configuration.analytics.segments.thresholds.inclusion = {
                                value: parseFloat(segmentsInclusion)
                            };
                        }
                        if (segmentsFormatting && segmentsFormatting.length > 0) {
                            narrativeData.configuration.analytics.segments.thresholds.formatting = {
                                value: parseFloat(segmentsFormatting)
                            };
                        }
                        
                    } else {
                        narrativeData.configuration.analytics.segments = {
                            enabled: false
                        };
                    }
                    
                    if (isTrue(this.getProperty('enableTrendline'))) {
                        narrativeData.configuration.analytics.trendline = {
                            enabled: true,
                            index: parseInt(this.getProperty('trendlineIndex'), 10)
                        };
                        
                        narrativeData.configuration.analytics.trendline.thresholds = {};
                        trendlineInclusion = this.getProperty('trendlineInclusion');
                        trendlineFormatting = this.getProperty('trendlineFormatting');
                        trendlinePrediction = this.getProperty('trendlinePrediction');
                        if (trendlineInclusion && trendlineInclusion.length > 0) {
                            narrativeData.configuration.analytics.trendline.thresholds.inclusion = {
                                value: parseFloat(trendlineInclusion)
                            };
                        }
                        if (trendlineFormatting && trendlineFormatting.length > 0) {
                            narrativeData.configuration.analytics.trendline.thresholds.formatting = {
                                value: parseFloat(trendlineFormatting)
                            };
                        }
                        //set the prediction period to be 10% of total row count
                        if (rowCount >= 30) {
                            narrativeData.configuration.analytics.trendline.options = {
                                prediction_periods: Math.min(14, Math.floor(0.1 * rowCount))
                            };   
                        }
                        /*
                        if (trendlinePrediction && trendlinePrediction.length > 0) {
                            narrativeData.configuration.analytics.trendline.options = {
                                prediction_periods: parseInt(trendlinePrediction, 10)
                            };
                        }
                        */
                    } else {
                        narrativeData.configuration.analytics.trendline = {
                            enabled: false
                        };
                    }
                    
                    if (isTrue(this.getProperty('enableVolatility'))) {
                        narrativeData.configuration.analytics.volatility = {
                            enabled: true,
                            index: parseInt(this.getProperty('volatilityIndex'), 10)
                        };
                    } else {
                        narrativeData.configuration.analytics.volatility = {
                            enabled: false
                        };
                    }
                    
                    if (isTrue(this.getProperty('enableCorrelation'))) {
                        narrativeData.configuration.analytics.correlation = {
                            enabled: true,
                            index: parseInt(this.getProperty('correlationIndex'), 10)
                        };
                    } else {
                        narrativeData.configuration.analytics.correlation = {
                            enabled: false
                        };
                    }
                }
                if (chartType === 'barchart') {
                    narrativeData.configuration.authoring.run_support_story = true;
                    if (isTrue(this.getProperty('enableClustering'))) {
                        narrativeData.configuration.analytics.clustering = {
                            enabled: true,
                            index: parseInt(this.getProperty('clusteringIndex'), 10)
                        };
                    } else {
                        narrativeData.configuration.analytics.clustering = {
                            enabled: false
                        };
                    }
                    if (isTrue(this.getProperty('enableDistribution'))) {
                        narrativeData.configuration.analytics.distribution = {
                            enabled: true,
                            index: parseInt(this.getProperty('distributionIndex'), 10)
                        };
                    } else {
                        narrativeData.configuration.analytics.distribution = {
                            enabled: false
                        };
                    }
                    if (isTrue(this.getProperty('enableBarCorrelation'))) {
                        narrativeData.configuration.analytics.correlation = {
                            enabled: true,
                            index: parseInt(this.getProperty('barCorrelationIndex'), 10)
                        };
                    } else {
                        narrativeData.configuration.analytics.correlation = {
                            enabled: false
                        };
                    }
                }
                if (chartType === 'histogram') {
                    if (isTrue(this.getProperty('enablePopulation'))) {
                        narrativeData.configuration.analytics.population = {
                            enabled: true,
                            index: parseInt(this.getProperty('populationIndex'), 10)
                        };
                    } else {
                        narrativeData.configuration.analytics.population = {
                            enabled: false
                        };
                    }
                    if (isTrue(this.getProperty('enableAggregation'))) {
                        narrativeData.configuration.analytics.aggregation = {
                            enabled: true,
                            index: parseInt(this.getProperty('aggregationIndex'), 10)
                        };
                    } else {
                        narrativeData.configuration.analytics.aggregation = {
                            enabled: false
                        };
                    }
                }
                
                //Focus Filter
                /*
                focusDim = this.getProperty('focusDim');
                focusMea = this.getProperty('focusMea');
                if ((chartType === 'linechart' || chartType === 'barchart') && (focusDim && focusDim !== 'none') && (focusMea && focusMea !== 'none')) {
                    narrativeData.focus = {
                        dimension_id: focusDim,
                        measure_id: focusMea,
                        num_items: parseInt(this.getProperty('focusNum'), 10),
                        rank_group: this.getProperty('focusRank')
                    };
                    if (chartType === 'linechart') {
                        narrativeData.focus.metric = this.getProperty('focusMetricCon');
                    }
                    if (chartType === 'barchart') {
                        narrativeData.focus.metric = this.getProperty('focusMetricDis');
                    }
                } else {
                    narrativeData.focus = null;
                }
                */
			},
			
			drawStory: function () {
				var fontStyle = this.getFontStyle('contentfont'),
                    highlightfont = this.getFontStyle('highlightFont'),
                    highlightfontBad = this.getFontStyle('highlightFontBad'),
                    dnode = this.domNode,
                    endpoint = this.getProperty('endpoint'),
                    chartType = this.getProperty('chartType'),
                    apiKey = this.getProperty('apiKey'),
                    me = this;
				while (this.domNode.lastChild) {
                    this.domNode.removeChild(this.domNode.lastChild)
                }
				
				d3.xhr(endpoint + chartType + '?user_key=' + apiKey)
                    .header('Content-Type', 'text/plain')
                    .post(JSON.stringify(narrativeData), function (err, data) {
                        var e = document.createElement('div'),
                            tt,
                            i,
                            eleList = document.getElementsByClassName('highlight');
					    $VISUTIL.applyStyles2DomNode(e, fontStyle);
					    if (err) {
                            if (err.status === 0 || err.status === 403) { //without a key
                                tt = 'Cannot connect to NarrativeScience API or you don\'t have a valid API key';
                            } else {
                                try {
                                    tt = 'Error: ' + JSON.parse(err.responseText).error;
                                } catch (e) {
                                    tt = err.responseText;
                                }
                            }
                        } else {
                            tt = data.responseText;
                        }
                        e.innerHTML = tt;
                        dnode.appendChild(e);

                        for (i = 0; i < eleList.length; i = i + 1) {
                            if (eleList[i].getAttribute('data-sentiment') === 'good') {
                                $VISUTIL.applyStyles2DomNode(eleList[i], highlightfont);
                            }
                            if (eleList[i].getAttribute('data-sentiment') === 'bad') {
                                $VISUTIL.applyStyles2DomNode(eleList[i], highlightfontBad);
                            }
                        }
                        
                        me.raiseEvent({
                            name: 'renderFinished',
                            id: me.k
                        });
                    });
			},
			
			getFontStyle: function getFontStyle(p) {
                var fontProps = this.getProperty(p),
                    fontStyle = {};
				fontStyle.fontFamily = fontProps.fontFamily;
				fontStyle.fontStyle = isTrue(fontProps.fontItalic) ? 'italic' : 'normal';
				fontStyle.fontWeight = isTrue(fontProps.fontWeight) ? 'bold' : 'normal';
	
				fontStyle.color = fontProps.fontColor;
				fontStyle.fontSize = fontProps.fontSize;
				fontStyle.textDecoration = "";
				if (isTrue(fontProps.fontUnderline)) {
					fontStyle.textDecoration += ' underline';
				}
				if (isTrue(fontProps.fontLineThrough)) {
					fontStyle.textDecoration += ' line-through';
				}
				if (fontStyle.textDecoration === "") {
					fontStyle.textDecoration = "none";
				}
				return fontStyle;
			},
            
            applyHighlightFont: function () {
                var style = this.getFontStyle('highlightFont'),
                    styleBad = this.getFontStyle('highlightFontBad'),
                    eleList = document.getElementsByClassName('highlight'),
                    i;
                for (i = 0; i < eleList.length; i = i + 1) {
                    if (eleList[i].getAttribute('data-sentiment') === 'good') {
                        $VISUTIL.applyStyles2DomNode(eleList[i], style);
                    }
                    if (eleList[i].getAttribute('data-sentiment') === 'bad') {
                        $VISUTIL.applyStyles2DomNode(eleList[i], styleBad);
                    }
                }
            },
			
			applyFontStyle: function () {
				$VISUTIL.applyStyles2DomNode(this.domNode.firstChild, this.getFontStyle('contentfont'));
			},
			
            plot : function () {
				this.fillDataRows();
				
				this.domNode.className += " hasVertical mstrmojo-scrollNode";
				
				
				this.initProperties();
				this.fillDemensions();
				this.fillMeasures();
				this.fillConfiguration();
				//console.log("data", JSON.stringify(narrativeData));
				this.drawStory();
			},
			
			applyMeasureProperty: function () {
				var mn = this.getProperty('metricName'),
                    i,
                    m,
                    name,
                    parentMetric,
                    relationType,
                    numOfPeriods,
                    timeUnit;
				
				for (i = 0; i < narrativeData.data.measures.length; i = i + 1) {
					m = narrativeData.data.measures[i];
					name = this.makeID(m.name);//
					if ((name === mn || mn === 'all') && !m.outside) {
						m.format = this.getProperty(name + 'measureFormat') || this.getProperty('allmeasureFormat');
						if (m.format === 'money') {
							m.format_options = {};
							m.format_options.money_locale = this.getProperty(name + 'currency') || this.getProperty('allcurrency');
						}
						m.up_sentiment = this.getProperty(name + 'upSentiment') || this.getProperty('allupSentiment');
						m.cumulative = this.getProperty(name + 'cumulative') || this.getProperty('allcumulative');
                        m.outside = this.getProperty(name + 'outside') ? isTrue(this.getProperty(name + 'outside')) : isTrue(this.getProperty('alloutside'));
                        /* remove measure relationship 
                        parentMetric = this.getProperty(name + 'parentmetric') || this.getProperty('allparentmetric');
                        relationType = this.getProperty(name + 'relationType') || this.getProperty('allrelationType');
                        narrativeData.configuration.relationships[name] = {};
                        if (parentMetric && parentMetric !== 'none' && parentMetric !== name) {
                            narrativeData.configuration.relationships[name] = {
                                parent: parentMetric,
                                relation_type: relationType
                            };
                            
                            if (relationType === 'previous') {
                                numOfPeriods = this.getProperty(name + 'numOfPeriods') || this.getProperty('allnumOfPeriods');
                                timeUnit = this.getProperty(name + 'timeUnit') || this.getProperty('alltimeUnit');
                                narrativeData.configuration.relationships[name].config = {
                                    num_of_periods: parseInt(numOfPeriods, 10),
                                    time_unit: timeUnit
                                };
                            }
                        }
                        */
					}
				}
				this.drawStory();
			},
            
            makeID: function (str) {
                var ss = str.replace(/\W/g, '_');
                if (/^\d/.test(ss)) {
                    ss = 'a' + ss;
                }
                return ss;
            }

        }
    );
}());
//@ sourceURL=NarrativeScienceNLG.js