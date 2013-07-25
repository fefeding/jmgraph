YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "jmArc",
        "jmArraw",
        "jmArrawLine",
        "jmBezier",
        "jmCell",
        "jmCircle",
        "jmConnectLine",
        "jmControl",
        "jmEditor",
        "jmEditorDefaultStyle",
        "jmEvents",
        "jmGradient",
        "jmGraph",
        "jmHArc",
        "jmImage",
        "jmLabel",
        "jmLine",
        "jmObject",
        "jmPath",
        "jmPrismatic",
        "jmProperty",
        "jmRect",
        "jmResize",
        "jmSVG",
        "jmSVGElement",
        "jmShape",
        "jmUtils",
        "jmUtils.cache",
        "jmUtils.list",
        "jmVML",
        "list",
        "menus",
        "toGlow"
    ],
    "modules": [
        "jmEditor",
        "jmGraph",
        "jmSVG",
        "jmUtils"
    ],
    "allModules": [
        {
            "displayName": "jmEditor",
            "name": "jmEditor",
            "description": "流程编辑器单元,继承自jmControl\n参数说明:resizable=是否可改变大小，connectable=是否可连线,value =当前显示字符串,position=单元位置,editor=当前单元所属编辑器,graph=画布,style=样式对象或名称"
        },
        {
            "displayName": "jmGraph",
            "name": "jmGraph",
            "description": "圆弧图型 继承自jmPath\n参数params说明:center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=是否为顺时针"
        },
        {
            "displayName": "jmSVG",
            "name": "jmSVG",
            "description": "SVG基础封装"
        },
        {
            "displayName": "jmUtils",
            "name": "jmUtils",
            "description": "画图基础对象\n当前库的工具类"
        }
    ]
} };
});