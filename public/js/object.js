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
    this.body = $ ('<div class="modal-body overflow-y-auto overflow-x-hidden">').text ('test');
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