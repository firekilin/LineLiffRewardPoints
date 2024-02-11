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