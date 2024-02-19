/** blob to base64 */
let blobtobase64 = (blob) => {
  let fr = new FileReader ();
  if (blob != null) {
    fr.readAsDataURL (blob);
  } else {
    return null;
  }
  return new Promise (resolve => {
    fr.onloadend = () => {
      resolve (fr.result);
    };
  });
};


/*
  *
  * 轉blob
  */
let base64ToBlob = (base64, type) => {
  const byteCharacters = window.atob (base64);
  const byNumbers = new Array (byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i ++) {
    byNumbers[i] = byteCharacters.charCodeAt (i);
  }
  const byteArray = new Uint8Array (byNumbers);
  return new Blob ([byteArray], { type: 'application/' + type });
};

/** 
 * 
 * 
*/
let base64ToImage = (base64) => {
  return new Promise ((resolve, reject) => {
    const blob = base64ToBlob (base64.substring (base64.indexOf (',') + 1), 'image');
    const blobUrl = URL.createObjectURL (blob);
    let img = new Image ();
    img.onload = () => {
      resolve (img);
    };
    img.src = blobUrl;

  });
};



/*
  * bloburl轉base64
  *
  */
let bloburltobase64 = (blobUrl) => {
  if (blobUrl == null || blobUrl.trim () == '') {
    return null;
  } else {
    return new Promise (resolve => {
      fetch (blobUrl).then (res => {return res.blob ();})
        .then (res => {return this.blobtobase64 (res);})
        .then (res => {return resolve (res);});
    });
  }

};

/**img to base64 */
let imgToBase64 = (img) => {
  // Create a canvas element to draw the image
  var canvas = document.createElement ('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext ('2d');
  ctx.drawImage (img, 0, 0);
  return canvas.toDataURL ('image/png');
};

/** file to base64 */
let fileToBase64 = (file) => {
  return new Promise ((resolve, reject) => {
    const reader = new FileReader ();
  
    reader.onload = function(event) {
      const base64 = event.target.result;
      resolve (base64);
    };
    
    reader.readAsDataURL (file);
  });
  
};
