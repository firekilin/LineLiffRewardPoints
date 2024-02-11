let user;

window.onload = function() {
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


};
    
/**
    * 
    * 驗證liff
    * @param {string} myLiffId The LIFF ID of the selected element
    */
function initializeLiffOrDie(myLiffId) {
  if (! myLiffId) {
    console.log ('程式失敗 LIFF連線代碼遺失');
  } else {
    initializeLiff (myLiffId);
  }
}
    
/**
    * Initialize LIFF
    * 設定初始LIFF
    * @param {string} myLiffId The LIFF ID of the selected element
    */
function initializeLiff(myLiffId) {
  
  liff
    .init ({ liffId: myLiffId })
    .then (() => {
      initializeApp ();
    })
    .catch ((err) => {
      console.log ('初始化失敗 可能不是冰塊的錯');

    });
}
    
/**
     * Initialize the app by calling functions handling individual app components
     */
function initializeApp() {
  
  liff.getProfile ().then (function(profile) {
    user = new User (profile);    
    loading.hide ();

    $ ('body').trigger ('liffReady'); 
  }).catch (function(error) {
    //登入失敗  dev測試用
    $.ajax (
      {
        url: '/dev',
        method: 'GET',
        type: 'GET', success: (jsonResponse) => {
          user = new User (jsonResponse); 
          loading.hide ();

          $ ('body').trigger ('liffReady'); 

        }, error: (error) => {
          console.log ('程式失敗 連線失敗');
        } 
      });
  
    
   
  });
}

// //登入狀態
// function displayLiffData() {
//   document.getElementById ('browserLanguage').textContent = liff.getLanguage ();
//   document.getElementById ('sdkVersion').textContent = liff.getVersion ();
//   document.getElementById ('lineVersion').textContent = liff.getLineVersion ();
//   document.getElementById ('isInClient').textContent = liff.isInClient ();
//   document.getElementById ('isLoggedIn').textContent = liff.isLoggedIn ();
//   document.getElementById ('deviceOS').textContent = liff.getOS ();
//   document.getElementById ('falseLiff').style = 'display:none;';
// }
    
    
      
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
    
    
// // closeWindow call 關閉liff視窗
// document.getElementById ('closeWindowButton').addEventListener ('click', function() {
//   if (! liff.isInClient ()) {
//     sendAlertIfNotInClient ();
//   } else {
//     liff.closeWindow ();
//   }
// });
    
// // sendMessages call  傳訊息
// document.getElementById ('sendMessageButton').addEventListener ('click', function() {
//   if (! liff.isInClient ()) {
//     sendAlertIfNotInClient ();
//   } else {
//     let getUrlString = location.href;
//     let url = new URL (getUrlString);
//     let gettext = url.searchParams.get ('text'); // 回傳 21
          
//     liff.sendMessages ([{ 'type': 'text',
//       'text': gettext }]).then (function() {
//       liff.closeWindow ();
//     }).catch (function(error) {
//       window.alert ('Error sending message: ' + error);
//     });
//   }
    
// });
    
    
// // get access token 取得access token
// document.getElementById ('getAccessToken').addEventListener ('click', function() {
//   if (! liff.isLoggedIn () && ! liff.isInClient ()) {
//     alert ('To get an access token, you need to be logged in. Please tap the "login" button below and try again.');
//   } else {
//     const accessToken = liff.getAccessToken ();
//     document.getElementById ('accessTokenField').textContent = accessToken;
//     toggleAccessToken ();
//   }
// });
    
    
// // get profile call 取得資訊
// document.getElementById ('getProfileButton').addEventListener ('click', function() {
//   liff.getProfile ().then (function(profile) {
//     document.getElementById ('userIdProfileField').textContent = profile.userId;
//     document.getElementById ('displayNameField').textContent = profile.displayName;
    
//     const profilePictureDiv = document.getElementById ('profilePictureDiv');
//     if (profilePictureDiv.firstElementChild) {
//       profilePictureDiv.removeChild (profilePictureDiv.firstElementChild);
//     }
//     const img = document.createElement ('img');
//     img.src = profile.pictureUrl;
//     img.alt = 'Profile Picture';
//     profilePictureDiv.appendChild (img);
    
//     document.getElementById ('statusMessageField').textContent = profile.statusMessage;
//     toggleProfileData ();
//   }).catch (function(error) {
//     window.alert ('Error getting profile: ' + error);
//   });
// });
    
    
// //分享訊息
// document.getElementById ('shareTargetPicker').addEventListener ('click', function () {
//   if (liff.isApiAvailable ('shareTargetPicker')) {
//     liff.shareTargetPicker ([{ 'type': 'text',
//       'text': 'Hello, World!' }]).then (
//       document.getElementById ('shareTargetPickerMessage').textContent = 'Share target picker was launched.'
//     ).catch (function (res) {
//       document.getElementById ('shareTargetPickerMessage').textContent = 'Failed to launch share target picker.';
//     });
//   } else {
//     document.getElementById ('shareTargetPickerMessage').innerHTML = '<div>Share target picker unavailable.<div><div>This is possibly because you haven\'t enabled the share target picker on <a href=\'https://developers.line.biz/console/\'>LINE Developers Console</a>.</div>';
//   }
// });
    
      
    
// // login call, only when external browser is used
// document.getElementById ('liffLoginButton').addEventListener ('click', function() {
//   if (! liff.isLoggedIn ()) {
//     // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
//     liff.login ();
//   }
// });
    
// // logout call only when external browse
// document.getElementById ('liffLogoutButton').addEventListener ('click', function() {
//   if (liff.isLoggedIn ()) {
//     liff.logout ();
//     window.location.reload ();
//   }
// });
    
    