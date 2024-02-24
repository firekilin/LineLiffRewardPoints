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
  
};



