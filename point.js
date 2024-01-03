
class GUIObject {
    p = { x: 0, y: 0 };
    lastPos = { x: 0, y: 0 };
    pointname = "";
    size = 10;
    isHovering = false; // 新增一個 isHovering 參數，預設為false
    isDraggable = true; //判斷是否被觸碰
    dragging = false;
    ctx = undefined;
    constructor(args) {
        let def = {
            p: { x: 0, y: 0 },
            lastPos: { x: 0, y: 0 },
            size: 10,
            isHovering: false, // 新增一個 isHovering 參數，預設為false
            isDraggable: true, //判斷是否被觸碰
            dragging: false,
            ctx: undefined,
            pointname: ""
        }
        Object.assign(def, args)
        Object.assign(this, def)
    }
    draw() {

        this.ctx.strokeStyle = "red";
        if (this.isHovering) {
            this.ctx.strokeStyle = "black";
        }
        this.ctx.beginPath();
        this.ctx.rect(this.p.x, this.p.y, this.size, this.size);
        
        this.ctx.fillStyle =  this.ctx.strokeStyle; 
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.pointname, this.p.x+this.size/2, this.p.y+this.size/2);

      //  this.ctx.arc(this.p.x, this.p.y, this.size, 0, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.stroke();
        

    }
    handleMouseMove(pos) {
        if (this.inRange(pos)) {
            this.isHovering = true
        } else {
            this.isHovering = false
        }
        if (this.dragging) {
            this.p.x = this.p.x + (pos.x - this.lastPos.x);
            this.p.y = this.p.y + (pos.y - this.lastPos.y);
            this.lastPos = { x: pos.x, y: pos.y };
        }

    }
    handleMouseDown(pos) {
        if (this.inRange(pos)) {
            this.lastPos = pos
            if (this.isDraggable) {
                this.dragging = true
            }
        }
    }
    inRange(pos) {
        let point1 = { x: this.p.x , y: this.p.y },
            point2 = { x: this.p.x + this.size, y: this.p.y + this.size }

        return pos.x > point1.x && pos.x < point2.x &&
            pos.y > point1.y && pos.y < point2.y;
    }
}

class Scene {
    children = [];
    el; // 要知道是哪個document, 在new的時候指定
    flag = false;
    canvasw = 500;
    canvash = 500;
    ctx;
    constructor(args) {
        let def = {
            children: [],
            el: null, // 要知道是哪個document, 在new的時候指定
            flag: false,
            canvasw: 500,
            canvash: 500,
            ctx: null
        }
        Object.assign(def, args);
        Object.assign(this, def);
        this.init();
    }
    update() {
        if (this.flag) {
            this.el.style.cursor = "pointer"
        } else {
            this.el.style.cursor = "initial"
        }
        this.draw();
    }
    init() {
        let flag = false;

        this.el.addEventListener("mousemove", (evt) => {
            this.flag = false
            var mouseX = evt.pageX - evt.target.getBoundingClientRect().left;
            var mouseY = evt.pageY - (document.documentElement.scrollTop+evt.target.getBoundingClientRect().top);
            let mousePos = { x: mouseX, y: mouseY } // 拿滑鼠位置
            this.children.forEach(obj => {
                if (obj.inRange(mousePos)) {
                    this.flag = true
                }
            })
        }, { passive: true })
        // 事件偵測
        this.el.addEventListener("mousemove", (evt) => {
            var mouseX = evt.pageX - evt.target.getBoundingClientRect().left;
            var mouseY = evt.pageY - (document.documentElement.scrollTop+evt.target.getBoundingClientRect().top);
            let mousePos = { x: mouseX, y: mouseY } // 拿滑鼠位置
            // 處理滑鼠移動
            this.children.forEach(obj => {
                obj.handleMouseMove(mousePos) //傳入滑鼠位置
            })
        }, { passive: true })
        this.el.addEventListener("mousedown", (evt) => {
            var mouseX = evt.pageX - evt.target.getBoundingClientRect().left;
            var mouseY = evt.pageY - (document.documentElement.scrollTop+evt.target.getBoundingClientRect().top);
            let mousePos = { x: mouseX, y: mouseY } // 拿滑鼠位置
            this.children.forEach(obj => {
                obj.handleMouseDown(mousePos)
            })
        }, { passive: true })
        // 放開滑鼠按鍵
        this.el.addEventListener("mouseup", (evt) => {
            this.children.forEach(obj => {
                obj.lastPos = null;
                obj.dragging = false;
            })
        }, { passive: true })
        this.el.addEventListener("mousemove", (evt) => {
            this.flag = false
            var mouseX = evt.pageX - evt.target.getBoundingClientRect().left;
            var mouseY = evt.pageY - (document.documentElement.scrollTop+evt.target.getBoundingClientRect().top);
            let mousePos = { x: mouseX, y: mouseY } // 拿滑鼠位置
            this.children.forEach(obj => {
                if (obj.inRange(mousePos)) {
                    this.flag = true
                }
            })
        }, { passive: true })
        // 事件偵測
        this.el.addEventListener("touchmove", (e) => {
            var toucheX = e.touches[0].pageX - e.target.getBoundingClientRect().left;
            var toucheY = e.touches[0].pageY - (document.documentElement.scrollTop+e.target.getBoundingClientRect().top);
            let mousePos = { x: toucheX, y: toucheY } // 拿滑鼠位置
            // 處理滑鼠移動
            this.children.forEach(obj => {
                obj.handleMouseMove(mousePos) //傳入滑鼠位置
            })
        }, { passive: true })
        this.el.addEventListener("touchstart", (e) => {
            var toucheX = e.touches[0].pageX - e.target.getBoundingClientRect().left;
            var toucheY = e.touches[0].pageY -(document.documentElement.scrollTop+e.target.getBoundingClientRect().top);
            let mousePos = { x: toucheX, y: toucheY } // 拿滑鼠位置
            
            this.children.forEach(obj => {
                obj.handleMouseDown(mousePos)
            })
        }, { passive: true })
        // 放開滑鼠按鍵
        this.el.addEventListener("touchend", (e) => {
            this.children.forEach(obj => {
                obj.lastPos = null;
                obj.dragging = false;

            })
        }, { passive: true })
    }
    addChild(children) {
        this.children=children;
    }
    getall(){
        return this.children;
    }
    draw() {
        this.children.forEach(obj => {
            obj.draw();
        })
    }
}

 class editimg {
    eleid = "";
    ctx;
    canvasw = 500;
    canvash = 500;
    naturalw = 1000;
    naturalh = 1000;
    scene;
    img;
    points = 1;
    pointsize = 15;
    constructor(args) {
        let def = {
            canvasw: 500,
            canvash: 500,
            naturalw: 1000,
            naturalh: 1000,
            eleid: "",
            scene: null,
            ctx: {},
            img:{},
            points: 1,
            pointsize: 15
        }
        Object.assign(def, args);
        Object.assign(this, def);
        this.init();
    }
    init() {
        // JS setting
        let canvas = document.getElementById(this.eleid);
        
        function onDocumentTouchMove(event) {
                
            if (event.touches.length == 1) {
                event.preventDefault();
            
            }
        }
        canvas.addEventListener('touchmove', onDocumentTouchMove, { passive: false })
 
        if (canvas) {
            this.ctx = canvas.getContext("2d");
            if (this.ctx) {
                this.scene = new Scene({ el: document.querySelector("canvas"), ctx: this.ctx, canvasw: this.canvasw, canvash: this.canvash, canvasp: this.canvasp });
                let pointList=[];
                for(let i=0;i<this.points;i++){
                    var rect = new GUIObject({
                        p: { x: i*10+30, y: 30 },
                        size: this.pointsize,
                        ctx: this.ctx,
                        pointname:i
                    })
                    pointList.push(rect);
                }
               
              
                this.scene.addChild(pointList);

                let update = () => {
                    this.ctx.drawImage(this.img,0,0, this.canvasw, this.canvash);
                   
                    this.scene.update();
                }
                setInterval(update, 30);
            }

        }

    }
    getCanvasp() {
        
      
        return this.scene.getall();
    }
    getCanvasSize() {
        let resizex = this.naturalw;
        let resizey = this.naturalh;
        let size=resizex>resizey?resizex:resizey;

        return size;
    }
}



let myeditcanvas = new editimg({
    canvasw: $("#myCanvas")[0].width,
    canvash: $("#myCanvas")[0].height,
    naturalw: $("#myCanvas")[0].naturalWidth,
    naturalh: $("#myCanvas")[0].naturalHeight,
    eleid: "myCanvas",
    img: $("#ice")[0],
    points:15,
    pointsize:30
  });
  myeditcanvas.getCanvasp();