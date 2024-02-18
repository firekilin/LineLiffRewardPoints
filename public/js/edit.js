/**
 * 設定相連
 */
let setDepend = (obj1, obj2) => {
  $ (obj1).on ('input', () => {
    $ (obj2).val ($ (obj1).val ());
    $ (obj2).trigger ('change');
  });
  $ (obj2).on ('input', () => {
    $ (obj1).val ($ (obj2).val ());
    $ (obj1).trigger ('change');
  });
};


class GUIObject {
  constructor(args) {
    let def = {
      p: { x: 0,
        y: 0 },
      lastPos: { x: 0,
        y: 0 },
      size: 10,
      isHovering: false, // 新增一個 isHovering 參數，預設為false
      isDraggable: true, //判斷是否被觸碰
      dragging: false,
      ctx: undefined,
      pointname: ''
    };
    Object.assign (def, args);
    Object.assign (this, def);
  }
  draw() {
    this.ctx.strokeStyle = 'red';
    if (this.isHovering) {
      this.ctx.strokeStyle = 'black';
    }
    this.ctx.beginPath ();
    if (this.pointname == '0') {
      this.ctx.drawImage (this.pointimg, this.p.x, this.p.y, this.size, this.size);
    } else {
      this.ctx.rect (this.p.x, this.p.y, this.size, this.size);

      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText (
        (parseInt (this.pointname) + 1),
        this.p.x + this.size / 2,
        this.p.y + this.size / 2
      );
    }
    //  this.ctx.arc(this.p.x, this.p.y, this.size, 0, 2 * Math.PI, true);
    this.ctx.closePath ();
    this.ctx.stroke ();
  }
  handleMouseMove(pos) {
    if (this.inRange (pos)) {
      this.isHovering = true;
    } else {
      this.isHovering = false;
    }
    if (this.dragging) {
      this.p.x = this.p.x + (pos.x - this.lastPos.x);
      this.p.y = this.p.y + (pos.y - this.lastPos.y);
      this.lastPos = { x: pos.x,
        y: pos.y };
    }
  }
  handleMouseDown(pos) {
    if (this.inRange (pos)) {
      this.lastPos = pos;
      if (this.isDraggable) {
        this.dragging = true;
      }
    }
  }
  inRange(pos) {
    let point1 = { x: this.p.x,
        y: this.p.y },
      point2 = { x: this.p.x + this.size,
        y: this.p.y + this.size };

    return (
      pos.x > point1.x &&
            pos.x < point2.x &&
            pos.y > point1.y &&
            pos.y < point2.y
    );
  }
}

class Scene {
  constructor(args) {
    let def = {
      children: [],
      el: null, // 要知道是哪個document, 在new的時候指定
      flag: false,
      canvasw: 500,
      canvash: 500,
      ctx: null
    };
    Object.assign (def, args);
    Object.assign (this, def);
    this.init ();
  }
  update() {
    if (this.flag) {
      this.el.style.cursor = 'pointer';
    } else {
      this.el.style.cursor = 'initial';
    }
    this.draw ();
  }
  init() {
    let flag = false;

    this.el.addEventListener (
      'mousemove',
      evt => {
        this.flag = false;
        var mouseX = evt.pageX - evt.target.getBoundingClientRect ().left;
        var mouseY =
                    evt.pageY -
                    (document.documentElement.scrollTop +
                        evt.target.getBoundingClientRect ().top);
        let mousePos = { x: mouseX,
          y: mouseY }; // 拿滑鼠位置
        this.children.forEach (obj => {
          if (obj.inRange (mousePos)) {
            this.flag = true;
          }
        });
      }, { passive: true }
    );
    // 事件偵測
    this.el.addEventListener (
      'mousemove',
      evt => {
        var mouseX = evt.pageX - evt.target.getBoundingClientRect ().left;
        var mouseY =
                    evt.pageY -
                    (document.documentElement.scrollTop +
                        evt.target.getBoundingClientRect ().top);
        let mousePos = { x: mouseX,
          y: mouseY }; // 拿滑鼠位置
        // 處理滑鼠移動
        this.children.forEach (obj => {
          obj.handleMouseMove (mousePos); //傳入滑鼠位置
        });
      }, { passive: true }
    );
    this.el.addEventListener (
      'mousedown',
      evt => {
        var mouseX = evt.pageX - evt.target.getBoundingClientRect ().left;
        var mouseY =
                    evt.pageY -
                    (document.documentElement.scrollTop +
                        evt.target.getBoundingClientRect ().top);
        let mousePos = { x: mouseX,
          y: mouseY }; // 拿滑鼠位置
        this.children.forEach (obj => {
          obj.handleMouseDown (mousePos);
        });
      }, { passive: true }
    );
    // 放開滑鼠按鍵
    this.el.addEventListener (
      'mouseup',
      evt => {
        this.children.forEach (obj => {
          obj.lastPos = null;
          obj.dragging = false;
        });
      }, { passive: true }
    );
    this.el.addEventListener (
      'mousemove',
      evt => {
        this.flag = false;
        var mouseX = evt.pageX - evt.target.getBoundingClientRect ().left;
        var mouseY =
                    evt.pageY -
                    (document.documentElement.scrollTop +
                        evt.target.getBoundingClientRect ().top);
        let mousePos = { x: mouseX,
          y: mouseY }; // 拿滑鼠位置
        this.children.forEach (obj => {
          if (obj.inRange (mousePos)) {
            this.flag = true;
          }
        });
      }, { passive: true }
    );
    // 事件偵測
    this.el.addEventListener (
      'touchmove',
      e => {
        var toucheX = e.touches[0].pageX - e.target.getBoundingClientRect ().left;
        var toucheY =
                    e.touches[0].pageY -
                    (document.documentElement.scrollTop +
                        e.target.getBoundingClientRect ().top);
        let mousePos = { x: toucheX,
          y: toucheY }; // 拿滑鼠位置
        // 處理滑鼠移動
        this.children.forEach (obj => {
          obj.handleMouseMove (mousePos); //傳入滑鼠位置
        });
      }, { passive: true }
    );
    this.el.addEventListener (
      'touchstart',
      e => {
        var toucheX = e.touches[0].pageX - e.target.getBoundingClientRect ().left;
        var toucheY =
                    e.touches[0].pageY -
                    (document.documentElement.scrollTop +
                        e.target.getBoundingClientRect ().top);
        let mousePos = { x: toucheX,
          y: toucheY }; // 拿滑鼠位置

        this.children.forEach (obj => {
          obj.handleMouseDown (mousePos);
        });
      }, { passive: true }
    );
    // 放開滑鼠按鍵
    this.el.addEventListener (
      'touchend',
      e => {
        this.children.forEach (obj => {
          obj.lastPos = null;
          obj.dragging = false;
        });
      }, { passive: true }
    );
  }
  addChild(children) {
    this.children = children;
  }
  getall() {
    return this.children;
  }
  draw() {
    this.children.forEach (obj => {
      obj.draw ();
    });
  }
}

class editimg {
    
  constructor(args) {
    let def = {
      canvasw: 500,
      canvash: 500,
      eleid: '',
      bgupload: '',
      pointupload: '',
      scene: null,
      scale: 1,
      ctx: {},
      img: {},
      points: $ ('<input>').val ('1'),
      pointsize: $ ('<input>').val ('30')
    };
    Object.assign (def, args);
    Object.assign (this, def);
    // JS setting
    this.canvas = document.getElementById (this.eleid);
    let onDocumentTouchMove = event => {
      if (event.touches.length == 1) {
        event.preventDefault ();
      }
    };
    this.canvas.addEventListener ('touchmove', onDocumentTouchMove, { passive: false });
    //更換背景
    $ ('#' + this.bgupload).on ('change', async evt => {
      let tgt = evt.target;
      let files = tgt.files[0];
      var image = new Image ();
      image.onload = () => {
        this.img = image;
        let setw = image.width;
        let seth = image.height;
        if (image.width > $ ('#main').width ()) {
          this.scale = ($ ('#main').width () / image.width);
          setw = image.width * this.scale;
          seth = image.height * this.scale;
        } else {
          this.scale = 1;
        }
        this.canvasw = setw;
        this.canvash = seth;
        this.canvas.width = this.canvasw;
        this.canvas.height = this.canvash;

        this.init ();
      };
      image.src = await blobtobase64 (files);
    });
    //更換貼紙
    $ ('#' + this.pointupload).on ('change', async evt => {
      let tgt = evt.target;
      let files = tgt.files[0];
      var image = new Image ();
      image.onload = () => {
        this.pointimg = image;
        this.init ();
      };
      image.src = await blobtobase64 (files);
    });
    this.points.on ('change', () => {
      this.init ();
    });
    this.pointsize.on ('change', () => {
      this.init ();
    });
    this.init ();
  }
  init() {
    clearInterval (this.refresh);

    if (this.canvas) {
      this.ctx = this.canvas.getContext ('2d');
      if (this.ctx) {
        this.scene = new Scene ({
          el: document.querySelector ('canvas'),
          ctx: this.ctx,
          canvasw: this.canvasw,
          canvash: this.canvash,
          canvasp: this.canvasp
        });
        let pointList = [];
        for (let i = 0; i < this.points.val (); i ++) {

          var rect = new GUIObject ({
            p: { x: (i % 5) * 30 + 30,
              y: Math.floor (i / 5) * 30 + 30 },
            pointimg: this.pointimg,
            size: parseInt (this.pointsize.val ()),
            ctx: this.ctx,
            pointname: i
          });
          pointList.push (rect);
        }
        this.scene.addChild (pointList);

        let update = () => {
          this.ctx.drawImage (this.img, 0, 0, this.canvasw, this.canvash);

          this.scene.update ();
        };
        this.refresh = setInterval (update, 30);
      }
    }
  }
  getCanvasp() {
    let pointsList = [];

    this.scene.getall ().forEach (e =>
    {return pointsList.push ({ p: {
      x: (e.p.x / this.scale),
      y: (e.p.y / this.scale),
      size: (e.size / this.scale)
    },
    index: e.pointname });}
    );
    return {
      cardPosition: pointsList,
      cardNum: this.scene.getall ().length,
      bgImage: imgToBase64 (this.img),
      pointImage: imgToBase64 (this.pointimg),
    };
  }
   
}


//初始
$ (() => {

  //綁定大小
  setDepend ($ ('#pointsize'), $ ('#pointsize2'));
  //新增貼紙
  $ ('#pointAdd').on ('click', () => {
    $ ('#pointMore').append ($ ('<input name="pointfile" class="form-control" type="file" accept="image/png, image/gif, image/jpeg" >'));
  });
  let myeditcanvas;


  //建立背景及貼紙
  var bgImage = new Image ();
  bgImage.onload = () => {
    //建立貼紙
    var pointImage = new Image ();
    pointImage.onload = () => {
      //初始化
      myeditcanvas = new editimg ({
        canvasw: bgImage.width,
        canvash: bgImage.height,
        eleid: 'myCanvas',
        bgupload: 'bgupload',
        pointupload: 'pointupload',
        img: bgImage,
        pointimg: pointImage,
        points: $ ('#points'),
        pointsize: $ ('#pointsize')
      });
      loading.hide();
    };
    pointImage.src = 'public/img/point.png';
  };
  bgImage.src = 'public/img/bg.png';

  $ ('#send').on ('click', async () => {
    let saveData = myeditcanvas.getCanvasp ();
    saveData.cardName = $ ('#cardName').val ();
    if ($ ('#cardExp').val () != ''){
      saveData.cardExp = $ ('#cardExp').val () + ' 23:59:59';
    }
    saveData.cardGift = $ ('#cardGift').prop ('checked') ? 'e' : 'd';
    let pointImgs = [];
    for (let i = 0;i < $ ('input[name=pointfile]').length;i ++ ){
      pointImgs.push (await fileToBase64 ($ ('input[name=pointfile]')[i].files[0]));
    }

    saveData.pointOver = await fileToBase64 ($ ('#pointOver')[0].files[0]);

    saveData.pointImgs = pointImgs;

    console.log (saveData);
    $.ajax (
      {
        url: '/api/createCard',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',          
        data: JSON.stringify (saveData),
        success: (json) => {
          if (json.code == '0000'){
            window.location = '/';
          } else {
            alert ('失敗');
          }
        }, error: (error) => {
          console.log (error);

        } 
      });
  });
});
