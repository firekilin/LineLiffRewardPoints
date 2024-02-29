const crc = require ('crc'); // 引入crc库
const { Readable } = require ('stream');
const PNG = require ('pngjs').PNG;
const zlib = require ('zlib');
/**組成cunk*/
class cunk{
  /**cunk
     * @param {String} Type 類型 IHDR、acTL等等
     * @param {Buffer} Body 內容
     * @returns  含有數量大小 類型 內容 CRC 使用getBuffer()
    */
  constructor(Type, Body){
    this.len = Buffer.alloc (4); // 建立 Buffer
    this.len.writeUint32BE ( Body.length, 0);
    this.type = Buffer.alloc (4);
    this.type.write (Type, 0, 'ascii');
    this.body = Body;
    let crcTemp = Buffer.alloc ( this.type.length + this.body.length);
    this.type.copy (crcTemp, 0);
    this.body.copy (crcTemp, 4);
    let crcStr = crc.crc32 (crcTemp);
    this.crcBuffer = Buffer.alloc (4);
    this.crcBuffer.writeUInt32BE (crcStr, 0);
  }
  /**
     * @returns {Buffer}含有數量大小 類型 內容 CRC
     */
  getBuffer(){
    console.log (this.crcBuffer);
    return Buffer.concat ([this.len, this.type, this.body, this.crcBuffer]); 
  }
}

class BufferToStream extends Readable {
  constructor(buffer) {
    super ();
    this.buffer = buffer;
    this.pos = 0;
  }
  _read() {
    if (this.pos >= this.buffer.length) {
      this.push (null);
      return;
    }
    this.push (this.buffer.slice (this.pos, this.pos + 1));
    this.pos ++;
  }
}


let pngToApngRGB = (file) => {
  return new Promise ((resolve, reject) => {
    const imgStream = new BufferToStream (file);
    imgStream
      .pipe (new PNG ())
      .on ('parsed', function() {
        // PNG 文件已解析完成
        const pngBuffer = this.data;
        const modifiedData = [];
        const bytesPerRow = this.width * 4; // 每個點占用16字節

        // 將每行進行處理
        for (let i = 0; i < this.height; i ++) {
          const startIndex = i * bytesPerRow;
          const rowData = pngBuffer.slice (startIndex, startIndex + bytesPerRow);
          // 行首的 '00'  使用原始RGB 方式 #ffffffff
          let test = Buffer.alloc (1);
          test.writeUInt8 (3, 0);
          modifiedData.push (test);
          // 添加原始資料 #ffffffff
          modifiedData.push (rowData);
              
        }
          
        // 合并所有数据并创建新的 Buffer
        const modifiedBuffer = Buffer.concat (modifiedData);

        zlib.deflate (modifiedBuffer, (err, compressedData) => {
          if (err) {
            console.error ('壓縮錯誤:', err);
            return;
          }
          resolve (compressedData);
        });
          
      })
      .on ('error', function(err) {
        console.error ('Error:', err);
      });

  });
        
   
};

let pngToApngPETL = (file) => {
  /* 
    01 為左方點陣 加色票 色票從第0開始  第一行使用
	02 為上方點陣 加色票 色票與上方相同
	03 
	04 為上一行第一個顏色 加色票
     */
};


module.exports = { cunk: cunk,
  pngToApngRGB: pngToApngRGB };