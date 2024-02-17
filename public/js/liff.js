
let user;

$ (() => {
  //載入開始
  loading.show ();
  $.ajax (
    {
      url: '/send-id',
      method: 'GET',
      type: 'GET', success: (jsonResponse) => {
        let myLiffId = jsonResponse.id;
        initializeLiffOrDie (myLiffId);
      }, error: (error) => {
        console.log ('程式失敗 連線失敗');
      } 
    });

});

    
/**
    * 
    * 驗證liff
    * @param {string} myLiffId The LIFF ID of the selected element
    */
let initializeLiffOrDie = (myLiffId) => {
  if (! myLiffId) {
    console.log ('程式失敗 LIFF連線代碼遺失');
  } else {
    initializeLiff (myLiffId);
  }
};
    
/**
    * Initialize LIFF
    * 設定初始LIFF
    * @param {string} myLiffId The LIFF ID of the selected element
    */
let initializeLiff = (myLiffId) => {
  
  liff
    .init ({ liffId: myLiffId })
    .then (() => {
      initializeApp ();
    })
    .catch ((err) => {
      //使用非手機
      console.log ('初始化失敗 可能不是冰塊的錯');

    });
};
    
/**
     * Initialize the app by calling functions handling individual app components
     */
let initializeApp = () => {
  $.ajax (
    {
      url: '/login',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',          
      data: JSON.stringify (
        { IDtoken: liff.getIDToken () }), 
      success: (jsonResponse) => {
        user = new User (jsonResponse.data); 
        loading.hide ();
        $ ('#LineStatus').find ('.card-body').text ('登入成功');
        $ ('body').trigger ('liffReady'); 

      }, error: (error) => {
        $ ('#LineStatus').find ('.card-body').text ('登入失敗');
      } 
    });
  user = new User (profile);    
   
};

    
    
      
// //登入登出
// function displayIsInClientInfo() {
//   if (liff.isInClient ()) {
//     document.getElementById ('liffLoginButton').classList.toggle ('hidden');
//     document.getElementById ('liffLogoutButton').classList.toggle ('hidden');
//     document.getElementById ('isInClientMessage').textContent = 'You are opening the app in the in-app browser of LINE.';
//   } else {
//     document.getElementById ('isInClientMessage').textContent = 'You are opening the app in an external browser.';
//     document.getElementById ('shareTargetPicker').classList.toggle ('hidden');
//   }
// }
    
    
    
// sendMessages call  傳訊息
let sendMessage = (gettext) => {
  if (liff.isInClient ()) {
 
    liff.sendMessages ([{ 'type': 'text',
      'text': gettext }]).then (function() {
      liff.closeWindow ();
    }).catch (function(error) {
      window.alert ('Error sending message: ' + error);
    });
  }
};
 
    
    
    
    
//分享訊息
let shareMessage = (mes) => {
  if (liff.isApiAvailable ('shareTargetPicker')) {
    liff.shareTargetPicker ([{ 'type': 'text',
      'text': mes }]).then (
      window.alert ('分享成功')
    ).catch (function (res) {
      window.alert ('分享失敗');
    });
  } else {
    window.alert ('未允許此程式使用分享功能');
  }
};
 

    
    
    
    