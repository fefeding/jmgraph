const fs = require('fs');
const jmGraph = require("../../dist/jmgraph.js");
const { createCanvas, Image, registerFont } = require('canvas');

registerFont('msyh.ttf', { family: '微软雅黑' });

const mycanvas = createCanvas(800, 600);
console.log(mycanvas.type);
const g = jmGraph.create(mycanvas, {
    width: 800,
    height: 600,
    mode: '2d',
    style: {
        fill: '#000'
    }
});
init(g);

const img = new Image();
img.onload = () => {
    //创建一个image
    var imgControl = g.createShape('image',{
        style: {
            shadow: '0,0,10,#fff'
        },
        position: {x:300, y:300},
        image: img
    });	
    g.children.add(imgControl);	
    
    saveToImage();
}
img.onerror = err => { throw err }
img.src = 'https://mat1.gtimg.com/www/qq2018/imgs/qq_logo_2018x2.png'

// 导出为图片
function saveToImage() {
    g.redraw();
    const out = fs.createWriteStream(__dirname + '/test.png');
    const stream = mycanvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () =>  console.log('The PNG file was created.'));
}

function init(g){
    g.style.fill = '#000'; //画布背景
    var style = {
        stroke:'#46BF86',
        fill: '#556662',
        lineWidth: 1.5
    };
    style.shadow = '0,0,10,#fff';
    style.opacity = 0.2;			
    //style.lineCap = 'round';

    //创建一个方块
    
    var rect = g.createShape('rect',{
        style:style,
        position: {x:300,y:100},
        width:100,
        height:100
    });

    var rect2 = g.createShape('rect',{
        style:style,
        position: {x:'50%',y:'50%'},
        width:50,
        height:50
    });
    rect.children.add(rect2);

    g.children.add(rect);
    rect.canMove(true);

    // 画二个五角星
    var coordinates = [
        {x:50,y:100},
        {x:250,y:100},
        {x:250,y:50},
        {x:300,y:200},
        {x:200,y:200},
        {x:50,y:300},
    ];
    style = g.utils.clone(style);
    var star1 = g.createShape('path',{
        style:style,
        points: coordinates
    });
    g.children.add(star1);
    star1.canMove(true);

    var coordinates2 = [
        {x:50,y:300},
        {x:250,y:300},
        {x:100,y:350},
        {x:150,y:250},
        {x:200,y:350},
        {x:50,y:300},
    ];
    style = g.utils.clone(style);
    delete style.fill;
    var star2 = g.createShape('path',{
        style:style,
        points: coordinates2
    });
    g.children.add(star2);

    style = {
        stroke: '#effaaa',
        fill: '#fff',
        textAlign: 'right',
        textBaseline: 'middle',
        font: '24px "微软雅黑"', // 需要加载字体
        border: {
            left:1,
            top:1,
            right:1,
            bottom:1,
            style: {
                stroke: 'red'
            }
        },
        shadow: '0,0,10,#fff'
    };
    //style.opacity = 0.2;		

    //创建一个label
    var label = g.createShape('label',{
        style:style,
        //position:{x:200,y:150},
        center: {x: 250, y: 250},
        text:'test label 中文',
        //width:120,
        height:80
    });	
    g.children.add(label);	
}