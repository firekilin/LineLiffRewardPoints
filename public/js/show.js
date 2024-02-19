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

      }, error: (error) => {
      } 
    });
  
  
  
};
