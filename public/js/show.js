let showcard = (id) => {
  $.ajax (
    {
      url: '/api/manageCard',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify ({ cardSeq: id }),
      success: (json) => {
       
        let canvas = $ ('#canvas')[0];
        let ctx = canvas.getContext ('2d');
        let img1 = new Image ();
        img1.onload = () => {
          let scale = 1;
          if (img1.width > $ ('#main2').width ()) {
            scale = ($ ('#main2').width () / img1.width);
          }
          console.log (scale);
          canvas.width = (img1.width * scale);
          canvas.height = (img1.height * scale);
          ctx.drawImage (img1, 0, 0, canvas.width, canvas.height);
          let img2 = new Image ();
          img2.onload = () => {
            json.data.pointsList.forEach ((pos) => {
              ctx.drawImage (img2, pos.p.x * scale, pos.p.y * scale, pos.p.size, pos.p.size);
            });
          };
          const blob2 = base64ToBlob (json.data.pointImage.substring (json.data.pointImage.indexOf (',') + 1), 'image');
          const blobUrl2 = URL.createObjectURL (blob2);
          img2.src = blobUrl2;
  
        };
        const blob1 = base64ToBlob (json.data.bgImage.substring (json.data.bgImage.indexOf (',') + 1), 'image');
        const blobUrl1 = URL.createObjectURL (blob1);
        img1.src = blobUrl1;
      }, error: (error) => {
      } 
    });
  
  
  
};
