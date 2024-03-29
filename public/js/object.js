//line 登入內容
class User{
  constructor(args){
    let def = {
      'userId': '',
      'displayName': '',
      'statusMessage': '',
      'pictureUrl': ''
    };
    Object.assign (def, args);
    Object.assign (this, def);
  }
  getId(){
    return this.userId;
  }
  getName(){
    return this.displayName;
  }
}

//loading畫面
class Loading{
  constructor(imgPath){
    this.src = imgPath;
    this.isShow = false;
  }
  show(){
    if (! this.isShow){
      this.loadBlock = $ ('<div class="loading">');
      this.loadBlock.append ($ (`<img src="${this.src}" class="loadingImg">`));
      $ ('body').append (this.loadBlock);
    }
    this.isShow = true;
  }
  hide(){
    this.loadBlock.remove ();
    this.isShow = false;

  }
}
//設定loading
let loading = new Loading ('/public/img/loading.gif');
$ (document).ajaxStart (function(){
  loading.show ();
});
$ (document).ajaxComplete (function(){
  loading.hide ();
});

loading.show ();

//設定彈出視窗
class modal{
  constructor(){
    this.main = $ ('<div class="modal">');
    let dialog = $ ('<div class="modal-dialog modal-dialog-centered modal-fullscreen ">');
    this.main.append (dialog);
    let mainBox = $ ('<div class="modal-content">');
    dialog.append (mainBox);
    //標題
    this.header = $ ('<div class="modal-header">');
    this.header.append ( $ ('<h5 class="modal-title">通知</h5>'));
    this.topclose = $ (' <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>');
    this.header.append (this.topclose);
    //內容
    this.body = $ ('<div class="modal-body overflow-y-auto overflow-x-hidden d-flex flex-column align-items-center">').text ('test');
    //按鈕
    this.footer = $ ('<div class="modal-footer">');
    this.closebtn = $ ('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>');
    this.footer.append (this.closebtn);

    //整合全部
    mainBox.append (this.header);
    mainBox.append (this.body);
    mainBox.append ( this.footer);
    return this;
  }
  getModal(){
    return this.main;
  }
  setHeaderText(text){
    this.header.empty ();
    this.header.append ( $ ('<h5 class="modal-title">' + text + '</h5>'));
    this.header.append (this.topclose);
  }
  getHeader(){
    return this.header;
  }
  setBodyText(text){
    this.body.text (text);
  }
  getBody(){
    return this.body;
  }
  setFooterText(text){
    this.footer.empty ();
    this.footer.append ($ ('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">' + text + '</button>'));
  }
  getFooter(){
    return this.footer;
  }
  getTopClose(){
    return this.topclose;
  }
  getCloseBtn(){
    return this.closebtn;
  }
  show(){
    this.main.modal ('show');
  }
  hide(){
    this.main.modal ('hide');
  }
}
let alertModal = new modal ();
$ ('body').append (alertModal.getModal ());


class checkRequire{
  constructor(){
    this.checkMsg = [];
  }
  /** 
   * @item obj <input>
   * @String msg 未輸入之錯誤訊息
   */
  checkItem(obj, msg){
    if ($ (obj).val ().length === 0 ){
      this.checkMsg.push (msg);
    }
  }
  /**
   * 驗證並彈出視窗
   * @function 成功後執行
   */
  checkAlert(fn){
    if (this.check ()){
      fn ();
    } else {
      alertModal.setHeaderText ('錯誤');
      alertModal.getBody ().empty ();
      for (let i = 0;i < this.checkMsg.length;i ++){
        alertModal.getBody ().append ($ ('<p>').text (this.checkMsg[i]));
      }
      alertModal.show ();
    }
  };
  /**
   * 純驗證
   *  */  
  check(){
    if (this.checkMsg.length > 0){
      return false;
    } else {
      return true;
    }
  };
}


//新增工作人員訊息
let sendGroup = (json) => {
  if (liff.isApiAvailable ('shareTargetPicker')) {
    liff.shareTargetPicker ([{
      'type': 'flex',
      'altText': '冰塊 集點站 員工加入',
      'contents':

      {
        'type': 'bubble',
        'body': {
          'type': 'box',
          'layout': 'vertical',
          'contents': [
            {
              'type': 'text',
              'text': '冰塊 集點站',
              'weight': 'bold',
              'size': 'xxl',
              'margin': 'md',
              'align': 'center'
            },
            { 'type': 'separator',
              'margin': 'xxl' },
            {
              'type': 'text',
              'text': json.cardName,
              'align': 'center',
              'margin': 'md',
              'size': 'xl'
            },
            {
              'type': 'text',
              'text': '成為發點數人員',
              'align': 'center',
              'size': 'xl',
              'margin': 'md',
              'color': '#000000'
            },
            {
              'type': 'text',
              'text': '將會清除您此卡所有點數',
              'align': 'center',
              'size': 'xl',
              'margin': 'md',
              'color': '#FF0000'
            },
            { 'type': 'separator',
              'margin': 'xxl' },
            {
              'type': 'box',
              'layout': 'horizontal',
              'margin': 'md',
              'contents': [
                { 'type': 'button',
                  'action': {
                    'type': 'uri',
                    'label': '加入',
                    'uri': json.url
                  } }
              ],
              'borderColor': '#0080FF',
              'borderWidth': '1px',
              'cornerRadius': '50px'
            }
          ]
        },
        'styles': { 'footer': { 'separator': true } }
      }
          
    }]);
  } else {
    alertModal.setBodyText ('未允許此程式使用分享功能');
    alertModal.show ();
  }
};

//送點數訊息
let sharePoint = (point) => {
  if (liff.isApiAvailable ('shareTargetPicker')) {
    liff.shareTargetPicker ([{
      'type': 'flex',
      'altText': '冰塊 集點站 傳送點數',
      'contents':

      {
        'type': 'bubble',
        'body': {
          'type': 'box',
          'layout': 'vertical',
          'contents': [
            {
              'type': 'text',
              'text': '冰塊 集點站',
              'weight': 'bold',
              'size': 'xxl',
              'margin': 'md',
              'align': 'center'
            },
            { 'type': 'separator',
              'margin': 'xxl' },
            {
              'type': 'text',
              'text': point.cardName,
              'align': 'center',
              'margin': 'md',
              'size': 'xl'
            },
            {
              'type': 'text',
              'text': point.pointNum + ' 點',
              'align': 'center',
              'size': 'xl',
              'margin': 'md',
              'color': '#FF0000'
            },
            { 'type': 'separator',
              'margin': 'xxl' },
            {
              'type': 'box',
              'layout': 'horizontal',
              'margin': 'md',
              'contents': [
                { 'type': 'button',
                  'action': {
                    'type': 'uri',
                    'label': '領取',
                    'uri': point.url
                  } }
              ],
              'borderColor': '#0080FF',
              'borderWidth': '1px',
              'cornerRadius': '50px'
            }
          ]
        },
        'styles': { 'footer': { 'separator': true } }
      }
          
    }]);
  } else {
    alertModal.setBodyText ('未允許此程式使用分享功能');
    alertModal.show ();
  }
};

//換獎訊息
let wantWard = (point) => {
  if (liff.isApiAvailable ('shareTargetPicker')) {
    liff.shareTargetPicker ([{
      'type': 'flex',
      'altText': '冰塊 集點站 兌換獎品',
      'contents':

      {
        'type': 'bubble',
        'body': {
          'type': 'box',
          'layout': 'vertical',
          'contents': [
            {
              'type': 'text',
              'text': '冰塊 集點站',
              'weight': 'bold',
              'size': 'xxl',
              'margin': 'md',
              'align': 'center'
            },
            { 'type': 'separator',
              'margin': 'xxl' },
            {
              'type': 'text',
              'text': point.cardName,
              'align': 'center',
              'margin': 'md',
              'size': 'xl'
            },
            {
              'type': 'text',
              'text': '我要兌換!!',
              'align': 'center',
              'size': 'xl',
              'margin': 'md',
              'color': '#FF0000'
            },
            { 'type': 'separator',
              'margin': 'xxl' },
            {
              'type': 'box',
              'layout': 'horizontal',
              'margin': 'md',
              'contents': [
                { 'type': 'button',
                  'action': {
                    'type': 'uri',
                    'label': '兌換',
                    'uri': point.url
                  } }
              ],
              'borderColor': '#0080FF',
              'borderWidth': '1px',
              'cornerRadius': '50px'
            }
          ]
        },
        'styles': { 'footer': { 'separator': true } }
      }
          
    }]);
  } else {
    alertModal.setBodyText ('未允許此程式使用分享功能');
    alertModal.show ();
  }
};

//分享此app
let shareLiff = () => {
  if (liff.isInClient ()) {
 
    liff.shareTargetPicker ([{
      'type': 'flex',
      'altText': '冰塊 集點站 兌換獎品',
      'contents':
        {
          'type': 'bubble',
          'hero': {
            'type': 'image',
            'url': 'https://points.oou.tw/public/img/poohGiveMe.gif',
            'size': 'full',
            'aspectRatio': '2:1',
            'aspectMode': 'fit',
            'animated': true,
            'action': { 'type': 'uri',
              'uri': 'https://liff.line.me/1656461762-Gq9B5Oz9' }
          },
          'body': {
            'type': 'box',
            'layout': 'vertical',
            'contents': [
              {
                'type': 'text',
                'text': '冰塊 集點站',
                'weight': 'bold',
                'size': 'xl'
              },
              {
                'type': 'box',
                'layout': 'vertical',
                'margin': 'lg',
                'spacing': 'sm',
                'contents': [
                  {
                    'type': 'box',
                    'layout': 'baseline',
                    'spacing': 'sm',
                    'contents': [
                      {
                        'type': 'text',
                        'text': '用途',
                        'color': '#aaaaaa',
                        'size': 'sm',
                        'flex': 1
                      },
                      {
                        'type': 'text',
                        'wrap': true,
                        'color': '#666666',
                        'size': 'sm',
                        'flex': 5,
                        'text': '自製自己與朋友間專屬集點卡'
                      }
                    ]
                  },
                  {
                    'type': 'box',
                    'layout': 'baseline',
                    'spacing': 'sm',
                    'contents': [
                      {
                        'type': 'text',
                        'text': '介紹',
                        'color': '#aaaaaa',
                        'size': 'sm',
                        'flex': 1
                      },
                      {
                        'type': 'text',
                        'text': '冰塊製作 \n ',
                        'wrap': true,
                        'color': '#666666',
                        'size': 'sm',
                        'flex': 5
                      }
                    ]
                  }
                ]
              }
            ]
          },
          'footer': {
            'type': 'box',
            'layout': 'vertical',
            'spacing': 'sm',
            'contents': [
              {
                'type': 'button',
                'style': 'primary',
                'height': 'sm',
                'action': {
                  'type': 'uri',
                  'label': '前往',
                  'uri': 'https://liff.line.me/1656461762-Gq9B5Oz9'
                }
              }
            ],
            'flex': 0
          }
        }
            
    }]);
  }
};

  
 