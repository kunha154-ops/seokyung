const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const input = '/Users/geonhagang/.gemini/antigravity/brain/ddc5fc8b-527b-4600-8ff5-df3ff6a620a1/media__1779969646245.jpg';
  
  const width = 156;
  const height = 208; // 3:4 aspect ratio
  
  const lefts = [97, 264, 432, 600, 767];
  const top1 = 150;
  const top2 = 500;
  
  const names = [
    { name: '김정일', row: 1, col: 0 },
    { name: '황태성', row: 1, col: 1 },
    { name: '마석홍', row: 1, col: 2 },
    { name: '전수창', row: 1, col: 3 },
    { name: '정신조', row: 1, col: 4 },
    { name: '남궁현우', row: 2, col: 1 },
    { name: '김영주', row: 2, col: 2 },
    { name: '주영석', row: 2, col: 3 },
    { name: '이병구', row: 2, col: 4 },
  ];
  
  for (const person of names) {
    const left = lefts[person.col];
    const top = person.row === 1 ? top1 : top2;
    
    await sharp(input)
      .extract({ left, top, width, height })
      .toFile(`/Users/geonhagang/seokyung/public/images/officers/${person.name}.png`);
      
    console.log(`Saved ${person.name}.png`);
  }
}

processImage().catch(console.error);
