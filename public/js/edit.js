let showcard = (id) => {
  $.ajax (
    {
      url: '/api/manageCard',
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

        
        let notGet = 0;
        let get = 0;
        for (let i = 0;i < json.data.sendPoint.length;i ++){
          let tableTr = $ ('<tr>');
          tableTr.append ($ ('<td>').text (json.data.sendPoint[i].pointNum));
          let status = json.data.sendPoint[i].status;
          if (status == 'w'){
            status = '待收取';
            notGet += parseInt (json.data.sendPoint[i].pointNum);
          } else {
            status = '已收取';
            get += parseInt (json.data.sendPoint[i].pointNum);
          }
          tableTr.append ($ ('<td>').text (status));
          tableTr.append ($ ('<td>').text ((new Date (json.data.sendPoint[i].createdate)).toLocaleDateString ()));
          $ ('#pointTable').append (tableTr);
        }
        $ ('#content').text (`待收取:${notGet}    已收取:${get} `);
      }, error: (error) => {
      } 
    });
  
  
  
};
