(function () {
    if (!mstrmojo.plugins.SmartKPIWidget) {
        mstrmojo.plugins.SmartKPIWidget = {};
    }


    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.hash",
        "mstrmojo.css",
        "mstrmojo.VisUtility",
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.plugins.SmartKPIWidget.StackedKPIWidget",
        "mstrmojo.plugins.SmartKPIWidget.HorizontalLayoutKPIWidget",
        "mstrmojo.plugins.SmartKPIWidget.VerticalLayoutKPIWidget",
        "mstrmojo.plugins.SmartKPIWidget.SmartLayoutKPIWidget"
    );

    var $HASH = mstrmojo.hash,
        $CSS = mstrmojo.css,
        $VISUTIL = mstrmojo.VisUtility;

    var DROPZONE_NAME_MAP = {
        'metric': 'XAxis',
        'category': 'YAxis',
        'time': 'BreakBy'

    };

    var DISPLAY_MODE_CLASS_NAME = [
        'plugins.SmartKPIWidget.StackedKPIWidget',
        'plugins.SmartKPIWidget.SmartLayoutKPIWidget',
        'plugins.SmartKPIWidget.HorizontalLayoutKPIWidget',
        'plugins.SmartKPIWidget.VerticalLayoutKPIWidget'
    ];

    function isTrue(value) {
        return !!(value === 'true' || value === true);
    }


    mstrmojo.plugins.SmartKPIWidget.KPI_PROPERTIES = {
        ENABLE_AUTO_PLAY: 'enableAutoPlay',
        DISPLAY_MODE: 'displayMode',
        KPI_THEME: 'kpiTheme',
        INVERT_THRESHOLD_COLOR: 'invertThresholdColor'
    };

    mstrmojo.plugins.SmartKPIWidget.DISPLAY_MODE = {
        STACKED: 0,
        RESPONSIVE: 1,
        HORIZONTAL: 2,
        VERTICAL: 3
    };

    var $KPI_PROPERTIES = mstrmojo.plugins.SmartKPIWidget.KPI_PROPERTIES;

    mstrmojo.plugins.SmartKPIWidget.SmartKPIWidget = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.SmartKPIWidget.SmartKPIWidget",

            cssClass: "smart-kpi-widget",

            errorDetails: "This visualization requires one metric.",

            externalLibraries: [
                {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins/") + "SmartKPIWidget/libs/echarts.common.min.js"},
                {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins/") + "SmartKPIWidget/libs/jquery-1.11.0.min.js"},
                {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins/") + "SmartKPIWidget/libs/jquery-migrate-1.2.1.min.js"},
                {url: (mstrApp.getPluginsRoot && mstrApp.getPluginsRoot() || "../plugins/") + "SmartKPIWidget/libs/slick/slick.min.js"}],

            useRichTooltip: true,

            reuseDOMNode: true,

            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine

            markupString: '<div class="{@cssClass}" style="{@cssText}" >' +
            //'<div class="container"></div>' +
            '</div>',

            markupSlots: {
                containerNode: function () {
                    return this.domNode;
                }
            },

            getFormatPropertyValue: function (propertyName) {
                //mock up get value from property API

                var value = this.getProperty(propertyName);

                if (propertyName === $KPI_PROPERTIES.ENABLE_AUTO_PLAY || propertyName === $KPI_PROPERTIES.INVERT_THRESHOLD_COLOR) {
                    value = isTrue(value);
                }

                if (propertyName === $KPI_PROPERTIES.DISPLAY_MODE) {
                    value = parseInt(value, 10);
                }

                return value;
            },

            setFormatPropertyValue: function (propertyName, value) {
                this.setProperty(propertyName, value, {suppressData: true});
            },

            isEmpty: function isEmpty() {
                var modelData = this.model.data,
                    noData = modelData.eg !== undefined || !modelData.gts;
                if (noData) {
                    return true;
                }
                return false;
            },

            render: function render() {
                this.cssText = '';
                this._super();
            },

            postBuildRendering: function postBuildRendering() {


                this._super();

            },

            checkData: function checkData() {
                var data = this.model && this.model.data,
                    dz = data && data.dz,
                    metricZone = dz[DROPZONE_NAME_MAP['metric']];

                if (!metricZone || !metricZone.TemplateMetric || metricZone.TemplateMetric.length < 1) {
                    //must have metric
                    throw 'ERROR';
                }

            },

            plot: function () {

                this.setDefaultPropertyValues({
                    enableAutoPlay: 'true',
                    displayMode: '0',
                    kpiTheme: 'dark-theme',
                    invertThresholdColor: 'false'
                });

                this.checkData();

                this.createModelForSingleKPI();

                var containerNode = this.containerNode,
                    div = document.createElement('div'),
                    child,
                    children = [],
                    props,
                    className,
                    childClass;

                //clear prev content
                containerNode.innerHTML = '';

                containerNode.className = this.cssClass;

                $CSS.toggleClass(containerNode, this.getFormatPropertyValue($KPI_PROPERTIES.KPI_THEME), true);

                containerNode.appendChild(div);

                props = {
                    placeholder: div,
                    width: parseInt(this.width) + 'px',
                    height: parseInt(this.height) + 'px',
                    enableAutoPlay: this.getFormatPropertyValue($KPI_PROPERTIES.ENABLE_AUTO_PLAY),
                    singleKPIModels: this.singleKPIModels,
                    KPITemplateMode: this.KPITemplateMode,
                    invertThresholdColor: this.getFormatPropertyValue($KPI_PROPERTIES.INVERT_THRESHOLD_COLOR)
                };

                this.displayMode = this.getFormatPropertyValue($KPI_PROPERTIES.DISPLAY_MODE);

                className = DISPLAY_MODE_CLASS_NAME[this.displayMode];
                childClass = $HASH.walk(className, mstrmojo);

                child = new childClass(props);
                child.render();

                children.push(child);

                // raise event for New Export Engine
                this.raiseEvent({
                    name: 'renderFinished',
                    id: this.k
                });
            },

            getAttrID: function getAttrID(zoneName) {
                var data = this.model && this.model.data,
                    dz = data && data.dz,
                    zone = dz && dz[DROPZONE_NAME_MAP[zoneName]],
                    items = zone && zone.TemplateUnit,
                    item = items && items[0];

                return item && item.id;
            },

            getAttrIdx: function getAttrIdx(row, zoneName) {
                var attrID = this.getAttrID(zoneName),
                    attrIdx = -1;

                row.forEach(function(attr, idx) {
                    //if (attr.id === attrID) {
					if (attr.id && attr.id.indexOf(attrID) !== -1) {
                        attrIdx = idx;
                    }

                });

                return attrIdx;
            },

            createModelForSingleKPI: function createModelForSingleKPI() {
                var data = this.model.data,
                    nfs = data && $VISUTIL.getNumberFormat(data, 0),
                    gts = data && data.gts,
                    gvs = data && data.gvs && data.gvs.items,
                    col = gts && gts.col,
                    row = gts && gts.row,
                    ghs = data && data.ghs,
                    rhs = ghs && ghs.rhs.items,
                    metrics = col && col[0],
                    metricList = metrics && metrics.es,
                    metricIdx = 0,
                    metric = metricList[metricIdx],
                    timeAttrIdx = this.getAttrIdx(row, 'time'),
                    categoryAttrIdx = this.getAttrIdx(row, 'category'),
                    hasTimeAttr = timeAttrIdx > -1,
                    hasCategoryAttr = categoryAttrIdx > -1,
                    timeAttrName = hasTimeAttr && row[timeAttrIdx].n || "",
                    timeAttrElemList = hasTimeAttr && row[timeAttrIdx].es,
                    categoryAttrName = hasCategoryAttr && row[categoryAttrIdx].n || "",
                    categoryAttrElemList = hasCategoryAttr && row[categoryAttrIdx].es,
                    i,
                    rowCnt = gvs && gvs.length,
                    singleKPIModels = [],
                    singleKPIModel,
                    lastCategoryRhsIdx = -1,
                    currCategoryRhsIdx = -1,
                    currTimeRhsIdx,
                    chartData,
                    chartFormatData,
                    xAxisData,
                    checkIfCategoryChanged = function () {
                        if (hasCategoryAttr) {
                            currCategoryRhsIdx = rhs[i].items[categoryAttrIdx].idx;
                            if (currCategoryRhsIdx !== lastCategoryRhsIdx) {
                                //category changed , should begin a new single KPI
                                lastCategoryRhsIdx = currCategoryRhsIdx;
                                return true;
                            } else {
                                return false;
                            }

                        } else {
                            //no category attribute, only one single KPI, return true for first row
                            return i === 0;
                        }
                    },
                    finishCreateModelForSingleKPI = function() {
                        singleKPIModel.chartData = chartData;
                        singleKPIModel.chartFormatData = chartFormatData;

                        singleKPIModel.xAxisData = xAxisData;
                        singleKPIModel.periodName = timeAttrName;

                        //number format string
                        singleKPIModel.nfs = nfs;

                        singleKPIModels.push(singleKPIModel);
                    };


                this.KPITemplateMode = (hasTimeAttr ? 1 : 0) + (hasCategoryAttr ? 2 : 0);


                //parse each row
                for (i = 0; i < rowCnt; i++) {
                    if (checkIfCategoryChanged()) {
                        if (i > 0) {
                            finishCreateModelForSingleKPI();
                        }
                        singleKPIModel = {};
                        singleKPIModel.metricName = metric.n;
                        singleKPIModel.KPITemplateMode = this.KPITemplateMode;
                        singleKPIModel.parent = singleKPIModels;
                        if (hasCategoryAttr) {
                            singleKPIModel.categoryName = categoryAttrName;
                            singleKPIModel.categoryElemName = categoryAttrElemList[currCategoryRhsIdx].n;
                        }

                        chartData = [];
                        xAxisData = [];
                        chartFormatData = [];
                    }
                    if (hasTimeAttr) {
                        currTimeRhsIdx = rhs[i].items[timeAttrIdx].idx;
                        xAxisData.push(timeAttrElemList[currTimeRhsIdx].n);
                    }
                    chartData.push(parseFloat(gvs[i].items[metricIdx].rv))
                    chartFormatData.push(gvs[i].items[metricIdx].v);

                }

                finishCreateModelForSingleKPI();


                this.singleKPIModels = singleKPIModels;

            }

        }
    );

}());
//@ sourceURL=SmartKPIWidget.js
