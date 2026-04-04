// ═══════════════════════════════════════════════════════════
// COMPUTER VISION PIPELINE — Real palm line detection
// Uses canvas-based image processing (Canny + ridge detection)
// ═══════════════════════════════════════════════════════════

export function compressImage(dataUrl, maxSize=800) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
        else { w = Math.round(w * maxSize / h); h = maxSize; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = dataUrl;
  });
}

function gaussianKernel(sigma, size) {
  const k = [];
  const half = Math.floor(size / 2);
  let sum = 0;
  for (let i = 0; i < size; i++) {
    k[i] = [];
    for (let j = 0; j < size; j++) {
      const x = i - half, y = j - half;
      k[i][j] = Math.exp(-(x*x + y*y) / (2*sigma*sigma));
      sum += k[i][j];
    }
  }
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++) k[i][j] /= sum;
  return k;
}

function convolve(data, width, height, kernel) {
  const kSize = kernel.length;
  const half = Math.floor(kSize / 2);
  const out = new Float32Array(width * height);
  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      let sum = 0;
      for (let ky = 0; ky < kSize; ky++)
        for (let kx = 0; kx < kSize; kx++)
          sum += data[(y + ky - half) * width + (x + kx - half)] * kernel[ky][kx];
      out[y * width + x] = sum;
    }
  }
  return out;
}

function sobelEdges(gray, width, height) {
  const Gx = [[-1,0,1],[-2,0,2],[-1,0,1]];
  const Gy = [[-1,-2,-1],[0,0,0],[1,2,1]];
  const gxArr = convolve(gray, width, height, Gx);
  const gyArr = convolve(gray, width, height, Gy);
  const mag = new Float32Array(width * height);
  const dir = new Float32Array(width * height);
  for (let i = 0; i < mag.length; i++) {
    mag[i] = Math.sqrt(gxArr[i]*gxArr[i] + gyArr[i]*gyArr[i]);
    dir[i] = Math.atan2(gyArr[i], gxArr[i]);
  }
  return { mag, dir };
}

function nonMaxSuppression(mag, dir, width, height) {
  const out = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const angle = ((dir[i] * 180 / Math.PI) + 180) % 180;
      let n1, n2;
      if (angle < 22.5 || angle >= 157.5) {
        n1 = mag[y * width + (x-1)]; n2 = mag[y * width + (x+1)];
      } else if (angle < 67.5) {
        n1 = mag[(y-1) * width + (x-1)]; n2 = mag[(y+1) * width + (x+1)];
      } else if (angle < 112.5) {
        n1 = mag[(y-1) * width + x]; n2 = mag[(y+1) * width + x];
      } else {
        n1 = mag[(y-1) * width + (x+1)]; n2 = mag[(y+1) * width + (x-1)];
      }
      out[i] = (mag[i] >= n1 && mag[i] >= n2) ? mag[i] : 0;
    }
  }
  return out;
}

function hysteresisThreshold(nms, width, height, low, high) {
  const edges = new Uint8Array(width * height);
  for (let i = 0; i < nms.length; i++) {
    if (nms[i] >= high) edges[i] = 2;
    else if (nms[i] >= low) edges[i] = 1;
  }
  // Connect weak to strong
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (edges[y*width+x] === 1) {
        let hasStrong = false;
        for (let dy = -1; dy <= 1 && !hasStrong; dy++)
          for (let dx = -1; dx <= 1 && !hasStrong; dx++)
            if (edges[(y+dy)*width+(x+dx)] === 2) hasStrong = true;
        edges[y*width+x] = hasStrong ? 2 : 0;
      }
    }
  }
  return edges;
}

function cannyEdges(imgData, width, height, sigma=1.2, low=15, high=35) {
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    gray[i] = 0.299 * imgData[p] + 0.587 * imgData[p+1] + 0.114 * imgData[p+2];
  }
  const kernel = gaussianKernel(sigma, 5);
  const blurred = convolve(gray, width, height, kernel);
  const { mag, dir } = sobelEdges(blurred, width, height);
  const nms = nonMaxSuppression(mag, dir, width, height);
  return hysteresisThreshold(nms, width, height, low, high);
}

// Trace connected edge pixels into polyline paths
function traceEdgePaths(edges, width, height, minLen = 18) {
  const visited = new Uint8Array(width * height);
  const paths = [];

  const neighbors8 = (x, y) => {
    const ns = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x+dx, ny = y+dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height)
          ns.push([nx, ny]);
      }
    return ns;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (edges[i] !== 2 || visited[i]) continue;
      const path = [];
      const queue = [[x, y]];
      visited[i] = 1;
      while (queue.length) {
        const [cx, cy] = queue.shift();
        path.push([cx, cy]);
        for (const [nx, ny] of neighbors8(cx, cy)) {
          const ni = ny * width + nx;
          if (edges[ni] === 2 && !visited[ni]) {
            visited[ni] = 1;
            queue.push([nx, ny]);
          }
        }
      }
      if (path.length >= minLen) paths.push(path);
    }
  }
  return paths;
}

// Smooth a path using moving average
function smoothPath(path, windowSize = 5) {
  const half = Math.floor(windowSize / 2);
  return path.map((_, i) => {
    let sx = 0, sy = 0, count = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(path.length-1, i + half); j++) {
      sx += path[j][0]; sy += path[j][1]; count++;
    }
    return [sx/count, sy/count];
  });
}

// Extract palm region using MediaPipe landmarks, crop & preprocess
export async function extractPalmLines(imageDataUrl, landmarks, imgW, imgH) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const WORK_W = 200, WORK_H = 160;
      const canvas = document.createElement("canvas");
      canvas.width = WORK_W; canvas.height = WORK_H;
      const ctx = canvas.getContext("2d");

      const palmIdxs = [0,1,2,5,6,9,10,13,14,17,18];
      let minX = 1, minY = 1, maxX = 0, maxY = 0;
      palmIdxs.forEach(i => {
        minX = Math.min(minX, landmarks[i].x);
        minY = Math.min(minY, landmarks[i].y);
        maxX = Math.max(maxX, landmarks[i].x);
        maxY = Math.max(maxY, landmarks[i].y);
      });
      const pad = 0.08;
      minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
      maxX = Math.min(1, maxX + pad); maxY = Math.min(1, maxY + pad);

      const srcX = minX * imgW, srcY = minY * imgH;
      const srcW = (maxX - minX) * imgW, srcH = (maxY - minY) * imgH;

      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, WORK_W, WORK_H);

      const imageData = ctx.getImageData(0, 0, WORK_W, WORK_H);
      const d = imageData.data;
      // CLAHE-lite: stretch histogram
      let minV = 255, maxV = 0;
      for (let i = 0; i < d.length; i += 4) {
        const v = 0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
        if (v < minV) minV = v;
        if (v > maxV) maxV = v;
      }
      const range = maxV - minV || 1;
      for (let i = 0; i < d.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          d[i+c] = Math.min(255, ((d[i+c] - minV) / range) * 280);
        }
      }
      ctx.putImageData(imageData, 0, 0);

      const enhanced = ctx.getImageData(0, 0, WORK_W, WORK_H);
      const edges = cannyEdges(enhanced.data, WORK_W, WORK_H, 1.0, 12, 30);
      const rawPaths = traceEdgePaths(edges, WORK_W, WORK_H, 14);

      const scaleX = srcW / WORK_W, scaleY = srcH / WORK_H;
      const scaledPaths = rawPaths.map(path =>
        smoothPath(path, 6).map(([x, y]) => [
          (x * scaleX + srcX) / imgW,
          (y * scaleY + srcY) / imgH,
        ])
      );

      const identified = identifyPalmLines(scaledPaths, landmarks);
      resolve(identified);
    };
    img.onerror = () => resolve(null);
    img.src = imageDataUrl;
  });
}

// Use landmark positions to classify detected edge paths into named palm lines
export function identifyPalmLines(paths, lm) {
  if (!paths.length || !lm) return null;

  const wrist = lm[0];
  const indexMCP = lm[5], pinkyMCP = lm[17], middleMCP = lm[9];
  const thumbBase = lm[2];

  const scoreLife = (path) => {
    let score = 0;
    const centerX = (thumbBase.x + indexMCP.x) / 2;
    const centerY = (wrist.y + indexMCP.y) / 2;
    path.forEach(([x, y]) => {
      const dx = x - centerX, dy = y - centerY;
      if (Math.sqrt(dx*dx + dy*dy) < 0.18) score++;
      if (x < (thumbBase.x + 0.15) && y > indexMCP.y && y < wrist.y) score += 2;
    });
    return score / path.length;
  };

  const scoreHeart = (path) => {
    const targetY = (indexMCP.y + middleMCP.y) / 2 * 0.85 + wrist.y * 0.15;
    let score = 0;
    path.forEach(([x, y]) => {
      if (Math.abs(y - targetY) < 0.08) score += 3;
      if (y < indexMCP.y * 0.9 + wrist.y * 0.1 && y > indexMCP.y * 0.6 + wrist.y * 0.4) score++;
    });
    const ys = path.map(p => p[1]);
    const yVar = Math.max(...ys) - Math.min(...ys);
    if (yVar < 0.12) score += path.length;
    return score / path.length;
  };

  const scoreHead = (path) => {
    const targetY = (indexMCP.y + wrist.y) * 0.5;
    let score = 0;
    path.forEach(([x, y]) => {
      if (Math.abs(y - targetY) < 0.1) score += 2;
    });
    const ys = path.map(p => p[1]);
    const yVar = Math.max(...ys) - Math.min(...ys);
    if (yVar < 0.15) score += path.length * 0.5;
    return score / path.length;
  };

  const ranked = paths.map((p, i) => ({
    path: p, idx: i,
    lifeScore: scoreLife(p),
    heartScore: scoreHeart(p),
    headScore: scoreHead(p),
  })).sort((a,b) => b.path.length - a.path.length).slice(0, 20);

  const pickBest = (scoreFn, used) => {
    const best = ranked
      .filter(r => !used.has(r.idx))
      .sort((a,b) => scoreFn(b) - scoreFn(a))[0];
    if (best) used.add(best.idx);
    return best ? best.path : null;
  };

  const used = new Set();
  const heart = pickBest(r => r.heartScore, used);
  const life  = pickBest(r => r.lifeScore, used);
  const head  = pickBest(r => r.headScore, used);

  return { life, heart, head };
}
