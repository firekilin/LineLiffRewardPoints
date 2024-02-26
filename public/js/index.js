let indexReady = () => {

  $.ajax (
    {
      url: '/api/manageCardList',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      success: (json) => {
        for (let i = 0;i < json.data.length;i ++){
          let card = $ ('<div class="card mb-3 mb-sm-0">');
          let cardHeader = $ ('<div class="card-header">').text (json.data[i].cardName);
          let cardBody = $ ('<div class="card-body row">');
          cardBody.append ($ ('<div class="col-sm-4">').text ('總點數：' + json.data[i].cardNum));
          cardBody.append ($ ('<div class="col-sm-4">').text ('截止日：' + (json.data[i].cardExp == null ? '' : (new Date (json.data[i].cardExp)).toLocaleDateString ())));
          cardBody.append ($ ('<div class="col-sm-4 mb-3 mb-sm-0">').text ('是否可轉送：' + (json.data[i].cardGift == 'e' ? '可以' : '不可')));
          cardBody.append ($ ('<a  class="col-sm-6 btn btn-secondary mb-3 mb-sm-0">').text ('管理卡片').on ('click', () => {
            window.location = '/manage/' + json.data[i].cardSeq;
          }));
          let setpoint = $ ('<div class="col-sm-6 row mb-3 mb-sm-0">');
          //設定發送數值
          let pointNum = $ ('<div class="col-sm-4">');
          let pointSelect = $ ('<select class="form-select">');
          for (let j = 1;j <= json.data[i].cardNum;j ++){
            pointSelect.append ($ (`<option value="${j}">${j}</option>`));
          }
          pointNum.append (pointSelect);
          //設定發送按鈕
          let pointSend = $ ('<div class="col-sm-8">');
          pointSend.append ($ ('<a  class="form-control btn btn-info">').text ('發送點數').on ('click', () => {
            
            $.ajax (
              {
                url: '/api/sendPoint',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',          
                data: JSON.stringify ({
                  cardSeq: json.data[i].cardSeq,
                  cardName: json.data[i].cardName,
                  pointNum: pointSelect.val () 
                }),
                success: async (json) => {
                  if (json.code == '0000'){
                    let img = await base64ToImage (json.data.img);
                    alertModal.getBody ().empty ();
                    alertModal.getBody ().append (img);
                    alertModal.getFooter ().empty ();
                    alertModal.getFooter ().append (alertModal.getCloseBtn ());
                    
                    //分享
                    let share = $ ('<button type="button" class="btn btn-success" data-bs-dismiss="modal">LINE分享</button>');
                    share.on ('click', () => {
                      sharePoint (json.data);
                    });
                    alertModal.getFooter ().append (share);
                    alertModal.show ();
                    
                  } else {
                    alertModal.setBodyText (json.data);
                    alertModal.show ();
                  }
                }, error: (error) => {
                  console.log (error);
        
                } 
              });


            
          }));
          //介面加入
          setpoint.append (pointSend);
          setpoint.append (pointNum);
          //加入發送點數功能
          cardBody.append (setpoint);
          card.append (cardHeader);
          card.append (cardBody);
          $ ('#cardManageList').append (card);  
        }
    
        
      }, error: (error) => {
      } 
    });
      
  // sendMessages call  傳訊息
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

  
 
  $ ('#share').on ('click', () => {
    shareLiff ();
  });
};



