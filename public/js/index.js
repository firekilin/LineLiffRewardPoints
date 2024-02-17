let indexReady = () => {

  $.ajax (
    {
      url: '/api/manageCardList',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      success: (json) => {
        for (let i = 0;i < json.data.length;i ++){
          $ ('#cardManageList').append ($ (`
                <div class="card">
                <div class="card-header">
                  ${json.data[i].cardName}
                </div>
                <div class="card-body row">
                  <div class="col-4">
                    <p class="card-text">總點數： ${json.data[i].cardNum}</p>
                  </div>
                  <div class="col-4">
                    <p class="card-text">截止日： ${json.data[i].cardExp}</p>
                  </div>
                  <div class="col-4">
                    <p class="card-text">是否可轉送： ${json.data[i].cardGift == 'e' ? '可以' : '不可'}</p>
                  </div>
                  <a href="/manage/${json.data[i].cardSeq}" class="btn btn-primary">管理卡片</a>
                </div>
              </div>
          `));
          
        }
        
      }, error: (error) => {
      } 
    });
  
};