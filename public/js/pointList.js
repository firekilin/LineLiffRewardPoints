let testgif;
let showcard = (id, pointNum) => {
  $.ajax (
    {
      url: '/api/showCard',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify ({ cardSeq: id }),
      success: async(json) => {
        alertModal.getBody ().empty ();
        alertModal.show ();
        let cardPage = Math.ceil (pointNum / json.data.cardNum);
        for (let i = 0;i < cardPage;i ++){
          let canvas = $ ('<canvas id="canvas" width="400" height="400"></canvas>')[0];
          alertModal.getBody ().append (canvas);
          let maxWidth = alertModal.getBody ().width ();
          let ctx = canvas.getContext ('2d');
          let bgImage = await base64ToImage (json.data.bgImage);
          let scale = 1;
          if (bgImage.width > maxWidth) {
            scale = (maxWidth / bgImage.width);
          }
          canvas.width = (bgImage.width * scale);
          canvas.height = (bgImage.height * scale);
          ctx.drawImage (bgImage, 0, 0, canvas.width, canvas.height); 
          let pointImage = [];
          for (let j = 0;j < json.data.pointImage.length;j ++){
            pointImage.push (await base64ToImage (json.data.pointImage[j]));
          }
          let position = JSON.parse (json.data.cardPosition);
          if (pointNum > json.data.cardNum){
            for (let j = 0;j < json.data.cardNum;j ++){
              let pos = position[j];
              ctx.drawImage (pointImage[parseInt (Math.random () * json.data.pointImage.length)], pos.p.x * scale, pos.p.y * scale, pos.p.size * scale, pos.p.size * scale);
            }
          } else {
            for (let j = 0;j < pointNum;j ++){
              let pos = position[j];
              ctx.drawImage (pointImage[parseInt (Math.random () * json.data.pointImage.length)], pos.p.x * scale, pos.p.y * scale, pos.p.size * scale, pos.p.size * scale);
            }
          }
          pointNum = pointNum - json.data.cardNum;
        }
       

      
        $.ajax (
          {
            url: '/api/pointDetail',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify ({ cardSeq: id }),
            success: async(json) => {
              let table = $ (' <table class="table  table-striped">');
              table.append ($ (`<thead>
                                <tr>
                                  <th scope="col">點數</th>
                                  <th scope="col">狀態</th>
                                  <th scope="col">時間</th>
                                </tr>
                              </thead>`));
              let tbody = $ ('<tbody>');
              let point = {
                get: 0, getShare: 0, waitShare: 0, sendShare: 0, ward: 0
              };
              for (let i = 0;i < json.data.length;i ++){
                if (json.data[i].status == '接收'){
                  point.get += parseInt (json.data[i].pointNum);
                  json.data[i].pointNum = '+' + json.data[i].pointNum;
                } else if (json.data[i].status == '轉收'){
                  point.getShare += parseInt (json.data[i].pointNum);
                  json.data[i].pointNum = '+' + json.data[i].pointNum;
                } else if (json.data[i].status == '待轉送'){
                  point.waitShare += parseInt (json.data[i].pointNum);
                } else if (json.data[i].status == '已轉送'){
                  point.sendShare += parseInt (json.data[i].pointNum);
                  json.data[i].pointNum = '-' + json.data[i].pointNum;
                } else if (json.data[i].status == '已兌換'){
                  point.ward += parseInt (json.data[i].pointNum);
                  json.data[i].pointNum = '-' + json.data[i].pointNum;

                } 
                tbody.append ($ (`
                  <tr>
                    <td>${json.data[i].pointNum}</td>
                    <td>${json.data[i].status}</td>
                    <td>${(new Date (json.data[i].date)).toLocaleDateString ()}</td>
                  </tr>
                `));
              }
              table.append (tbody);
              let nowPoint = point.get + point.getShare - point.sendShare - point.ward;
              alertModal.getBody ().append (`目前點數:${nowPoint}  接收: ${point.get}   轉收: ${point.getShare}   待轉收: ${point.waitShare}   已轉送: ${point.sendShare}   已兌換: ${point.ward}`);
              alertModal.getBody ().append (table);

              let delShare = $ ('<button type="button" class="btn btn-danger">刪除進行中</button>');
              delShare.on ('click', () => {
                $.ajax (
                  {
                    url: '/api/delShare',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify ({ cardSeq: id }),
                    success: async(json) => {
                      if (json.code == '0000'){
                        alertModal.getBody ().empty ();
                        alertModal.getBody ().append ('完成');
                        alertModal.getFooter ().empty ();
                        alertModal.getFooter ().append (alertModal.getCloseBtn ());
                        alertModal.show ();
             
                      } else {
                        alertModal.setBodyText (json.data);
                        alertModal.getFooter ().empty ();
                        alertModal.getFooter ().append (alertModal.getCloseBtn ());
                        alertModal.show ();

                      }
                    }, error: (error) => {
                    } 
                  });
              });


              alertModal.getFooter ().empty ();
              alertModal.getFooter ().append (delShare);
              alertModal.getFooter ().append (alertModal.getCloseBtn ());

            }, error: (error) => {
            } 
          });
        
      }, error: (error) => {
      } 
    });
};




/** showDoWard */
let showDoWard = (data) => {
  $.ajax (
    {
      url: '/api/wantWard',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',          
      data: JSON.stringify ({ cardSeq: data.cardSeq,
        cardName: data.cardName }),
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
            wantWard (json.data);
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
  $.ajax (
    {
      url: '/api/showCard',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify ({ cardSeq: data.cardSeq }),
      success: async(json) => {

     
        let canvas = $ ('<canvas id="canvas" width="400" height="400"></canvas>')[0];
        alertModal.getBody ().append (canvas);
        let maxWidth = alertModal.getBody ().width ();
        let ctx = canvas.getContext ('2d');
        let bgImage = await base64ToImage (json.data.bgImage);
        let scale = 1;
        if (bgImage.width > maxWidth) {
          scale = (maxWidth / bgImage.width);
        }
        canvas.width = (bgImage.width * scale);
        canvas.height = (bgImage.height * scale);
        let pointImage = [];
        for (let j = 0;j < json.data.pointImage.length;j ++){
          pointImage.push (await base64ToImage (json.data.pointImage[j]));
        }

        let getWardImage = await base64ToGif (json.data.getWardImage);
        if (getWardImage == null){
          ctx.clearRect (0, 0, canvas.width, canvas.height);
          ctx.drawImage (bgImage, 0, 0, canvas.width, canvas.height); 
          let position = JSON.parse (json.data.cardPosition);
          for (let j = 0;j < json.data.cardNum;j ++){
            let pos = position[j];
            ctx.drawImage (pointImage[parseInt (Math.random () * json.data.pointImage.length)], pos.p.x * scale, pos.p.y * scale, pos.p.size * scale, pos.p.size * scale);
          }
        } else {
          let frameIndex = 0;
          let frameCount = testgif.frameCount; 
          let times = 0;
          // 開始
          var animation = setInterval (() => {
            ctx.clearRect (0, 0, canvas.width, canvas.height);
            ctx.drawImage (bgImage, 0, 0, canvas.width, canvas.height); 
            let position = JSON.parse (json.data.cardPosition);
            for (let j = 0;j < json.data.cardNum;j ++){
              let pos = position[j];
              ctx.drawImage (pointImage[parseInt (Math.random () * json.data.pointImage.length)], pos.p.x * scale, pos.p.y * scale, pos.p.size * scale, pos.p.size * scale);
            }
            ctx.drawImage (getWardImage.frames[frameIndex].image, 0, 0, canvas.width, canvas.height);
            if (times < 2){
              if (frameIndex < (frameCount - 1)) {
                frameIndex ++;
              } else {
                times ++;
                if (times != 2){
                  frameIndex = 0;
                }
              }
            } else {
              frameIndex = (frameCount - 1);
              clearInterval (animation);
            }
          
          }, 100);
        }
      
      }, error: (error) => {
      } 
    });
};






let indexReady = () => {

  $.ajax (
    {
      url: '/api/pointList',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      success: (json) => {
        if (json.code == '0000'){
          for (let i = 0;i < json.data.length;i ++){
            let card = $ ('<div class="card mb-3 mb-sm-1">');
            let cardHeader = $ ('<div class="card-header">').text (json.data[i].cardName);
            let cardBody = $ ('<div class="card-body row">');
            cardBody.append ($ ('<div class="col-sm-4">').text ('目前點數：' + json.data[i].pointNum + '/' + json.data[i].cardNum));
            cardBody.append ($ ('<div class="col-sm-4">').text ('截止日：' + (json.data[i].cardExp == null ? '' : (new Date (json.data[i].cardExp)).toLocaleDateString ())));
            cardBody.append ($ ('<a  class="col-sm-6 btn btn-secondary mb-3 mb-sm-1">').text ('查看').on ('click', () => {
              showcard (json.data[i].cardSeq, json.data[i].pointNum);
            }));
            let setpoint = $ ('<div class="col-sm-6 row mb-3 mb-sm-1">');
            if (json.data[i].cardGift == 'e'){
              //設定發送數值
              let pointNum = $ ('<div class="col-sm-4">');
              let pointSelect = $ ('<select class="form-select">');
              for (let j = 1;j <= json.data[i].pointNum;j ++){
                pointSelect.append ($ (`<option value="${j}">${j}</option>`));
              }
              pointNum.append (pointSelect);
              //設定發送按鈕
              let pointSend = $ ('<div class="col-sm-8">');
              pointSend.append ($ ('<a  class="form-control btn btn-info">').text ('轉送').on ('click', () => {
                $.ajax (
                  {
                    url: '/api/sharePoint',
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
            }
            if (json.data[i].pointNum >= json.data[i].cardNum){
              cardBody.append ($ ('<a  class="col-sm-6 btn btn-success mb-3 mb-sm-1">').text ('兌換').on ('click', () => {
                showDoWard (json.data[i]);
              }));
            }
            card.append (cardHeader);
            card.append (cardBody);
            $ ('#cardList').append (card);  
          }
      
        } else {
          $ ('#cardList').append ('無');  
        }
      }, error: (error) => {
      } 
    });
  
};
