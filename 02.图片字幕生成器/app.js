// 初始化变量
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
let currentImage = null;

// 图片上传处理
imageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    currentImage = new Image();
    currentImage.onload = () => {
      canvas.width = currentImage.width;
      canvas.height = currentImage.height;
      ctx.drawImage(currentImage, 0, 0);
    };
    currentImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// 生成字幕图片
window.generateSubtitle = function() {
  if (!currentImage) {
    alert('请先上传图片');
    return;
  }

  const textLines = document.getElementById('subtitleText').value.split('\n').filter(t => t);
  if (!textLines.length) {
    alert('请输入字幕内容');
    return;
  }

  // 清空画布重新绘制
  ctx.drawImage(currentImage, 0, 0);
  
  // 获取样式参数
  const subHeight = parseInt(document.getElementById('subHeight').value);
  const fontSize = parseInt(document.getElementById('fontSize').value);
  const textColor = document.getElementById('textColor').value;
  const strokeColor = document.getElementById('strokeColor').value;
  const borderColor = document.getElementById('borderColor').value;
  const borderWidth = parseInt(document.getElementById('borderWidth').value);

  // 设置文字样式
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'center';

  // 精确底部对齐计算
  const totalHeight = subHeight * textLines.length;
  // 从图片底部开始向上排列
  const startY = canvas.height;
  ctx.textBaseline = 'middle';

  textLines.reverse().forEach((text, index) => {
    const yPos = startY - subHeight * (index + 1);
    
    // 绘制背景条
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, yPos, canvas.width, subHeight);
    
    // 绘制边框
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(0, yPos, canvas.width, subHeight);
    
    // 文字垂直居中
    const textY = yPos + subHeight / 2;
    
    // 绘制文字描边
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.strokeText(text, canvas.width/2, textY);
    
    // 绘制文字填充
    ctx.fillStyle = textColor;
    ctx.fillText(text, canvas.width/2, textY);
  });
};

// 保存图片
window.saveImage = function() {
  if (!currentImage) {
    alert('请先生成字幕图片');
    return;
  }

  const link = document.createElement('a');
  link.download = 'subtitle-image.png';
  link.href = canvas.toDataURL();
  link.click();
};

// 实时预览样式更新
['subHeight', 'fontSize', 'textColor', 'strokeColor'].forEach(id => {
  document.getElementById(id).addEventListener('input', generateSubtitle);
});