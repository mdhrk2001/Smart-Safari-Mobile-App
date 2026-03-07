// src/utils/ObjectDetection.ts

export interface Detection {
  classIndex: number;
  confidence: number;
  box: {
    x: number; // Top-left x
    y: number; // Top-left y
    w: number; // Width
    h: number; // Height
  };
}

const NUM_ANCHORS = 8400; 
const NUM_CLASSES = 2; // Sri Lankan Elephant & Sri Lankan Leopard model
const CONFIDENCE_THRESHOLD = 0.50; 
const IOU_THRESHOLD = 0.45; 

// 1. MOVED TO TOP: Ensures the Worklet thread initializes it first
const calculateIoU = (box1: any, box2: any): number => {
  'worklet';
  const x1 = Math.max(box1.x, box2.x);
  const y1 = Math.max(box1.y, box2.y);
  const x2 = Math.min(box1.x + box1.w, box2.x + box2.w);
  const y2 = Math.min(box1.y + box1.h, box2.y + box2.h);

  const intersectionW = Math.max(0, x2 - x1);
  const intersectionH = Math.max(0, y2 - y1);
  const intersectionArea = intersectionW * intersectionH;

  const area1 = box1.w * box1.h;
  const area2 = box2.w * box2.h;

  return intersectionArea / (area1 + area2 - intersectionArea);
};

// 2. MOVED TO TOP: Ensures the Worklet thread initializes it first
const nonMaxSuppression = (detections: Detection[]): Detection[] => {
  'worklet';
  
  detections.sort((a, b) => b.confidence - a.confidence);

  const selected: Detection[] = [];
  const active = new Array(detections.length).fill(true);

  for (let i = 0; i < detections.length; i++) {
    if (active[i]) {
      selected.push(detections[i]);

      for (let j = i + 1; j < detections.length; j++) {
        if (active[j]) {
          const iou = calculateIoU(detections[i].box, detections[j].box);
          if (iou > IOU_THRESHOLD) {
            active[j] = false; 
          }
        }
      }
    }
  }

  return selected;
};

// 3. MAIN FUNCTION
export const postProcessYOLO = (
  data: Float32Array, 
  imgWidth: number, 
  imgHeight: number
): Detection[] => {
  'worklet'; 

  const detections: Detection[] = [];
  const stride = NUM_ANCHORS; 

  for (let i = 0; i < NUM_ANCHORS; i++) {
    let maxScore = 0;
    let maxClassIndex = -1;

    for (let c = 0; c < NUM_CLASSES; c++) {
      const score = data[(4 + c) * stride + i];
      if (score > maxScore) {
        maxScore = score;
        maxClassIndex = c;
      }
    }

    if (maxScore > CONFIDENCE_THRESHOLD) {
      const cx = data[0 * stride + i];
      const cy = data[1 * stride + i];
      const w = data[2 * stride + i];
      const h = data[3 * stride + i];

      const x = cx - w / 2;
      const y = cy - h / 2;

      detections.push({
        classIndex: maxClassIndex,
        confidence: maxScore,
        box: { x, y, w, h },
      });
    }
  }

  return nonMaxSuppression(detections);
};