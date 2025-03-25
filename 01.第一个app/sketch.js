let depth = 9;
let angle = 25;
let reduction = 0.67;
let endStyle = 'leaf'; // 默认末端样式为叶子
let canvas;
let treeBuffer; // 用于缓存树的图形
let debounceTimer; // 用于防抖处理

// 颜色变量
let baseColor;
let gradientColor;
let endColor;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  treeBuffer = createGraphics(windowWidth, windowHeight);
  
  // 设置滑块事件监听
  document.getElementById('depth').addEventListener('input', function() {
    const newDepth = parseInt(this.value);
    if (isNaN(newDepth)) return;
    depth = newDepth;
    document.getElementById('depthValue').textContent = depth;
    debounceRedraw();
  });
  
  document.getElementById('angle').addEventListener('input', function() {
    const newAngle = parseInt(this.value);
    if (isNaN(newAngle)) return;
    angle = newAngle;
    document.getElementById('angleValue').textContent = angle;
    debounceRedraw();
  });
  
  document.getElementById('reduction').addEventListener('input', function() {
    const newReduction = parseInt(this.value) / 100;
    if (isNaN(newReduction) || newReduction <= 0 || newReduction >= 1) return;
    reduction = newReduction;
    document.getElementById('reductionValue').textContent = reduction.toFixed(2);
    debounceRedraw();
  });
  
  // 设置样式选择事件监听
  document.getElementById('style').addEventListener('change', function() {
    endStyle = this.value;
    debounceRedraw();
  });

  // 设置颜色选择事件监听
  document.getElementById('baseColor').addEventListener('input', function() {
    baseColor = color(this.value);
    debounceRedraw();
  });

  document.getElementById('gradientColor').addEventListener('input', function() {
    gradientColor = color(this.value);
    debounceRedraw();
  });

  document.getElementById('endColor').addEventListener('input', function() {
    endColor = color(this.value);
    debounceRedraw();
  });

  // 初始化颜色
  baseColor = color('#228B22');
  gradientColor = color('#32CD32');
  endColor = color('#8BC34A');
  
  noLoop();
}

function debounceRedraw() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => redraw(), 100);
}

function draw() {
  // 清空缓冲区并设置背景
  treeBuffer.background(240);
  treeBuffer.push();
  treeBuffer.translate(width / 2, height);
  
  // 在缓冲区中绘制树
  branch(height * 0.3, depth, treeBuffer);
  treeBuffer.pop();
  
  // 将缓冲区内容复制到主画布
  image(treeBuffer, 0, 0);
}

function branch(len, n, g) {
  // 计算当前层级的颜色
  const progress = n / depth;
  const currentColor = lerpColor(gradientColor, baseColor, progress);
  g.stroke(currentColor);
  g.strokeWeight(map(n, 0, depth, 1, 10));
  g.line(0, 0, 0, -len);
  
  // 移动到树枝末端
  g.translate(0, -len);
  
  // 如果还有递归层级，则继续分支
  if (n > 0) {
    // 左侧分支
    g.push();
    g.rotate(radians(-angle));
    branch(len * reduction, n - 1, g);
    g.pop();
    
    // 右侧分支
    g.push();
    g.rotate(radians(angle));
    branch(len * reduction, n - 1, g);
    g.pop();
  }
  // 如果是最后一层，根据选择的样式绘制末端
  else {
    g.noStroke();
    
    switch(endStyle) {
      case 'leaf':
        // 绘制叶子
        g.fill(endColor);
        g.ellipse(0, 0, 10, 10);
        break;
        
      case 'snowflake':
        // 绘制雪花
        g.fill(endColor);
        // 绘制六角雪花
        g.push();
        g.stroke(endColor);
        g.strokeWeight(1);
        for (let i = 0; i < 6; i++) {
          g.line(0, 0, 0, -8);
          g.line(0, -4, -3, -7);
          g.line(0, -4, 3, -7);
          g.rotate(PI/3);
        }
        g.pop();
        break;
        
      case 'circle':
        // 绘制圆形
        g.fill(endColor);
        g.ellipse(0, 0, 8, 8);
        break;
        
      case 'square':
        // 绘制方形
        g.fill(endColor);
        g.rectMode(CENTER);
        g.rect(0, 0, 8, 8);
        break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  treeBuffer = createGraphics(windowWidth, windowHeight);
  redraw();
}