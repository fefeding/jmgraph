YAHOO.env.classMap = {"jmBezier": "jmGraph", "jmUtils.cache": "jmUtils", "jmConnectLine": "jmEditor", "jmCell": "jmEditor", "jmPrismatic": "jmGraph", "jmCircle": "jmGraph", "jmArc": "jmGraph", "jmArrowLine": "jmGraph", "jmLabel": "jmGraph", "jmGraph": "jmGraph", "jmPath": "jmGraph", "jmGradient": "jmGraph", "jmLine": "jmGraph", "jmEditor": "jmEditor", "jmImage": "jmGraph", "jmArraw": "jmGraph", "jmEditorDefaultStyle": "jmEditor", "jmEvents": "jmGraph", "jmRect": "jmGraph", "jmUtils": "jmUtils", "jmProperty": "jmGraph", "jmShadow": "jmGraph", "jmHArc": "jmGraph", "jmObject": "jmGraph", "jmControl": "jmGraph", "jmUtils.list": "jmUtils", "jmShape": "jmGraph"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
