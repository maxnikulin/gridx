//>>built
define("dojox/charting/plot2d/StackedBars",["dojo/_base/declare","./Bars","./commonStacked"],function(c,f,d){return c("dojox.charting.plot2d.StackedBars",f,{getSeriesStats:function(){var a=d.collectStats(this.series),b;a.hmin-=0.5;a.hmax+=0.5;b=a.hmin;a.hmin=a.vmin;a.vmin=b;b=a.hmax;a.hmax=a.vmax;a.vmax=b;return a},getValue:function(a,b,e,c){c?a=d.getIndexValue(this.series,e,b):(b=a.x-1,a=d.getValue(this.series,e,a.x),a=[a[0]?a[0].y:null,a[1]?a[1]:null]);return{x:b,y:a[0],py:a[1]}}})});
//@ sourceMappingURL=StackedBars.js.map