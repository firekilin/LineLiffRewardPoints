let showcard = (id) => {
  $.ajax (
    {
      url: '/api/showCard',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify ({ cardSeq: id }),
      success: async(json) => {
        let canvas = $ ('#canvas')[0];
        let ctx = canvas.getContext ('2d');
        let bgImage = await base64ToImage (json.data.bgImage);
        let scale = 1;
        if (bgImage.width > $ ('#main').width ()) {
          scale = ($ ('#main').width () / bgImage.width);
        }
        canvas.width = (bgImage.width * scale);
        canvas.height = (bgImage.height * scale);
        ctx.drawImage (bgImage, 0, 0, canvas.width, canvas.height); 
        let pointImage = [];
        for (let i = 0;i < json.data.pointImage.length;i ++){
          pointImage.push (await base64ToImage (json.data.pointImage[i]));
        }
        let position = JSON.parse (json.data.cardPosition);
        position.forEach ((pos) => {
          ctx.drawImage (pointImage[parseInt (Math.random () * json.data.pointImage.length)], pos.p.x * scale, pos.p.y * scale, pos.p.size * scale, pos.p.size * scale);
        });

        let point = {
          notGet: 0, get: 0, complete: 0
        };

        for (let i = 0;i < json.data.sendPoint.length;i ++){
          let tableTr = $ ('<tr>');
          let status = json.data.sendPoint[i].status;
          if (status == 'w'){
            status = '待收取';
            point.notGet += parseInt (json.data.sendPoint[i].pointNum);
          } else if (status == 'e') {
            status = '已發送';
            point.get += parseInt (json.data.sendPoint[i].pointNum);
          } else if (status == 'u'){
            status = '已兌換';
            point.complete += parseInt (json.data.sendPoint[i].pointNum); 
            json.data.sendPoint[i].pointNum = '-' + json.data.sendPoint[i].pointNum;
          }
          tableTr.append ($ ('<td>').text (json.data.sendPoint[i].pointNum));
          tableTr.append ($ ('<td>').text (status));
          tableTr.append ($ ('<td>').text ((new Date (json.data.sendPoint[i].createdate)).toLocaleDateString ()));
          $ ('#pointTable').append (tableTr);
        }
        $ ('#content').text (`待收取:${point.notGet}    已發送:${point.get}  已兌換:${point.complete}  待兌換:${point.get - point.complete} `);
      }, error: (error) => {
      } 
    });
};

let showGroupList = (id) => {
  $.ajax (
    {
      url: '/api/groupList',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',          
      data: JSON.stringify ({ cardSeq: id }),
      success: async (json) => {
        if (json.code == '0000'){
          let flexdiv = $ ('<div class="d-flex">');
          let addGroup = $ ('<a class="btn btn-success m-3 mb-3">').text ('新增人員');
          addGroup.on ('click', () => {
            $.ajax (
              {
                url: '/api/addGroup',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',          
                data: JSON.stringify ({ cardSeq: id }),
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
          });
          flexdiv.append (addGroup);
          let delCard = $ ('<a class="btn btn-danger m-3 mb-3 ms-auto">').text ('刪除卡片');
          delCard.on ('click', () => {
            alertModal.setHeaderText ('通知');
            alertModal.setBodyText ('是否完全刪除卡片');
            alertModal.getFooter ().empty ();
            $ (alertModal.getCloseBtn ()).on ('click', () => {
              window.location.reload ();
            });
            alertModal.getFooter ().append (alertModal.getCloseBtn ());
            let justDoIt = $ ('<a class="btn btn-danger">').text ('刪除一切');
            justDoIt.on ('click', () => {
              $.ajax (
                {
                  url: '/api/delCard',
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json;charset=utf-8',          
                  data: JSON.stringify ({ cardSeq: id }),
                  success: async (json) => {
                    if (json.code == '0000'){
                      window.location = '/';
                    } else {
                      window.location = '/';
                    }
                  }, error: (error) => {
                    console.log (error);
            
                  } 
                });
            });
            alertModal.getFooter ().append (justDoIt);
            alertModal.show ();
           
          });
          flexdiv.append (delCard);
          $ ('#groupList').append (flexdiv);

          let groupThead = $ (`<thead>
                              <tr>
                                <th scope="col">刪除</th>
                                <th scope="col">人員名稱</th>
                              </tr>
                            </thead>`);
          let groupTable = $ ('<table class="table  table-striped">');
          groupTable.append (groupThead);
          let groupTbody = $ ('<tbody>');
          for (let i = 0;i < json.data.length;i ++){
            let deletebtn = $ (`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">刪除</button>`);
            deletebtn.on ('click', () => {
              $.ajax (
                {
                  url: '/api/deleteGroup',
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json;charset=utf-8',          
                  data: JSON.stringify ({ cardSeq: id, groupSeq: json.data[i].groupSeq }),
                  success: async (json) => {
                    if (json.code == '0000'){
                      alertModal.setHeaderText ('通知');
                      alertModal.setBodyText ('完成');
                      alertModal.getFooter ().empty ();
                      $ (alertModal.getCloseBtn ()).on ('click', () => {
                        window.location.reload ();
                      });
                      alertModal.getFooter ().append (alertModal.getCloseBtn ());
                      alertModal.show ();
                    } else {
                      alertModal.setHeaderText ('通知');
                      alertModal.setBodyText (json.data);
                      alertModal.getFooter ().empty ();
                      $ (alertModal.getCloseBtn ()).on ('click', () => {
                        window.location.reload ();
                      });
                      alertModal.getFooter ().append (alertModal.getCloseBtn ());
                      alertModal.show ();
                    }
                  }, error: (error) => {
                    console.log (error);
                  } 
                });
            });
            let tableTr = $ ('<tr>');
            tableTr.append ($ ('<td>').append (deletebtn));
            if (json.data[i].groupCode != null){
              //分享
              let share = $ ('<button type="button" class="btn btn-success" data-bs-dismiss="modal">LINE分享</button>');
              share.on ('click', () => {
                sharePoint (json.data[i]);
              });
              tableTr.append ($ ('<td>').append (share));

            } else {
              tableTr.append ($ ('<td>').text (json.data[i].groupUser));
            }
            groupTbody.append (tableTr);
          }
          groupTable.append (groupTbody);
          $ ('#groupList').append (groupTable);
    
        }
       
      }, error: (error) => {
        console.log (error);

      } 
    });
};



