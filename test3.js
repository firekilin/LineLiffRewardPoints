const crc = require ('crc'); // 引入crc库
class cunk{
  constructor(len, type, body){
    this.length = len;
    this.type = type;
    this.body;
    this.crc;
  }
  
}
/**
pngSignature
IHDR
acTL 圖案標頭 控制動畫
PLTE
tRNS
fcTL 第一張圖標頭
IDAT(fdAT) 第一張圖
fcTL 第二張圖標頭
fdAT 第二張圖
fcTL 第三張圖標頭
fdAT 第三張圖
 */
//step 1
const pngSignature = Buffer.from ([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);


//step 2 create IHDR
const width = 130; // 图像宽度
const height = 120; // 图像高度
const bitDepth = 8; // 位深度，通常为 8
const colorType = 3; // 颜色类型，通常为 6（真彩色）
const compressionMethod = 0; // 压缩方法，通常为 0（deflate/inflate 压缩）
const filterMethod = 0; // 滤波器方法，通常为 0（adaptive filtering）
const interlaceMethod = 0; // 隔行扫描方法，通常为 0（不使用隔行扫描）


const ihdrChunk = Buffer.alloc (17); // 建立 Buffer
ihdrChunk.write ('IHDR', 0, 'ascii'); // 類型
ihdrChunk.writeUInt32BE (width, 8); // 寬度
ihdrChunk.writeUInt32BE (height, 12); // 高度
ihdrChunk.writeUInt8 (bitDepth, 16); // 顏色深度
ihdrChunk.writeUInt8 (colorType, 17); // 顏色類型
ihdrChunk.writeUInt8 (compressionMethod, 18); // 壓縮方法
ihdrChunk.writeUInt8 (filterMethod, 19); // 濾波器
ihdrChunk.writeUInt8 (interlaceMethod, 20); // 隔行掃描方式



console.log (crc.crc32 ('hello').toString (16));

// 計算 CRC
const crc32 = crc.crc32 (ihdrChunk.toString ()); // 計算 CRC [包含類型]
console.log (crc32);
