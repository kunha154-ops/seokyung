const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const input = '/Users/geonhagang/.gemini/antigravity/brain/ddc5fc8b-527b-4600-8ff5-df3ff6a620a1/media__1779969646245.jpg';
  
  const { data, info } = await sharp(input)
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const w = info.width;
  const h = info.height;
  
  // Create a binary mask: 1 if pixel is "white/grey", 0 otherwise
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * info.channels;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      
      // The background of the portraits is light grey/white.
      // Colorful gradient background usually has higher variance between channels.
      // Let's say if it's very light (r>230, g>230, b>230) OR if it's generally greyscale (abs(r-g)<15, abs(r-b)<15) and light enough (r>150).
      // Let's just find the first pixel in the top row that is the start of the first portrait.
      if (r > 230 && g > 230 && b > 230) {
         mask[y*w + x] = 1;
      } else {
         mask[y*w + x] = 0;
      }
    }
  }

  // Find column boundaries by projecting vertically
  let colProfile = new Int32Array(w);
  for (let x = 0; x < w; x++) {
    let sum = 0;
    // only check top half for top row
    for (let y = 100; y < 400; y++) {
      sum += mask[y*w + x];
    }
    colProfile[x] = sum;
  }
  
  // Find continuous segments of x where colProfile[x] > 200 (meaning there's a vertical block of white)
  let cols = [];
  let inCol = false;
  let start = 0;
  for (let x = 0; x < w; x++) {
    if (colProfile[x] > 200 && !inCol) {
      inCol = true;
      start = x;
    } else if (colProfile[x] <= 200 && inCol) {
      inCol = false;
      cols.push({ start, end: x, width: x - start });
    }
  }
  if (inCol) cols.push({ start, end: w - 1, width: w - 1 - start });
  
  console.log("Top row X boundaries:", cols);
  
  // Now project horizontally to find Y boundaries for the top row
  let rowProfile = new Int32Array(h);
  for (let y = 0; y < h; y++) {
    let sum = 0;
    for (let x = cols[0].start; x < cols[0].end; x++) {
      sum += mask[y*w + x];
    }
    rowProfile[y] = sum;
  }
  
  let rows = [];
  inCol = false;
  for (let y = 0; y < h; y++) {
    if (rowProfile[y] > (cols[0].width * 0.8) && !inCol) {
      inCol = true;
      start = y;
    } else if (rowProfile[y] <= (cols[0].width * 0.8) && inCol) {
      inCol = false;
      rows.push({ start, end: y, height: y - start });
    }
  }
  
  console.log("Top row Y boundaries for col 0:", rows);

}

processImage().catch(console.error);
