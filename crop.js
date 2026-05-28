const sharp = require('sharp');

// 1024 x 870
// We will crop 9 regions.
const regions = [
  { id: '김정일', left: 105, top: 120, width: 148, height: 197 },
  { id: '황태성', left: 350, top: 120, width: 148, height: 197 },
  { id: '마석홍', left: 520, top: 120, width: 148, height: 197 },
  { id: '전수창', left: 670, top: 120, width: 148, height: 197 },
  { id: '정신조', left: 820, top: 120, width: 148, height: 197 },
];

// Let's refine the numbers after seeing a quick debug image.
