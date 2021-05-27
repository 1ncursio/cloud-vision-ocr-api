import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import axios from 'axios';
import produce from 'immer';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CANVAS_SCALE = 1;

const Home = () => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(8);
  const [detectedText, setDetectedText] = useState<string>('');

  const [imageHistory, setImageHistory] = useState<HTMLImageElement[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasImageRef = useRef<HTMLImageElement | null>(null);

  const drawCrossLine = useCallback(() => {
    if (!contextRef.current) return;

    /* contextRef.current.lineWidth = 1;
    contextRef.current.strokeStyle = 'gray';

    contextRef.current.moveTo(CANVAS_WIDTH / 2, 0);
    contextRef.current.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    contextRef.current.stroke();

    contextRef.current.moveTo(0, CANVAS_HEIGHT / 2);
    contextRef.current.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
    contextRef.current.stroke();

    contextRef.current.strokeStyle = 'black';
    contextRef.current.lineWidth = strokeWidth; */
  }, [contextRef]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.width = CANVAS_WIDTH * CANVAS_SCALE;
    canvas.height = CANVAS_HEIGHT * CANVAS_SCALE;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(CANVAS_SCALE, CANVAS_SCALE);
    context.lineCap = 'round';
    context.beginPath();

    context.lineWidth = strokeWidth;

    contextRef.current = context;

    const canvasImage = new Image();
    canvasImage.src = canvas.toDataURL();

    canvasImageRef.current = canvasImage;

    setImageHistory((prev) => [...prev, canvasImage]);
    console.log(imageHistory);

    drawCrossLine();
  }, []);

  useEffect(() => {
    if (contextRef.current && historyIndex > 0) {
      contextRef.current.drawImage(imageHistory[historyIndex], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [contextRef, imageHistory, historyIndex]);

  const startDrawing = useCallback(
    (e) => {
      if (!contextRef.current) return;
      const { nativeEvent, target } = e;

      console.log('스타트');

      const { offsetX, offsetY } = nativeEvent;

      const rect = target.getBoundingClientRect();

      console.log({ nativeEvent, x: target.getBoundingClientRect() });

      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    },
    [contextRef, isDrawing],
  );

  const finishDrawing = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;

    console.log('끝');

    contextRef.current.closePath();
    setIsDrawing(false);

    if (historyIndex < imageHistory.length - 1) {
      // setImageHistory(
      //   produce((draft) => {
      //     // draft.splice(0, historyIndex - 2);
      //     draft.filter((v, i) => true);
      //   }),
      // );
      setImageHistory(imageHistory.filter((v, i) => i <= historyIndex));
      console.log('컷');
    }

    setHistoryIndex((prev) => prev + 1);

    const canvasImage = new Image();
    canvasImage.src = canvasRef.current.toDataURL();

    setImageHistory((prev) => [...prev, canvasImage]);
    console.log({ imageHistory, historyIndex });
  }, [contextRef, canvasRef, setIsDrawing, setImageHistory, imageHistory, setHistoryIndex, historyIndex]);

  const draw = useCallback(
    ({ nativeEvent }) => {
      if (!contextRef.current) return;
      if (!isDrawing) return;

      // console.log('그리는 중');

      const { offsetX, offsetY } = nativeEvent;

      // console.log({ nativeEvent });

      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    },
    [contextRef, isDrawing],
  );

  const onReset = useCallback(() => {
    if (!contextRef.current) return;

    contextRef.current.fillStyle = 'white';
    contextRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // drawCrossLine();

    // contextRef.current.lineWidth = strokeWidth;

    setDetectedText('');
  }, [contextRef, strokeWidth, setDetectedText]);

  const onUndo = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;
    if (historyIndex < 0) return;
    console.log({ imageHistory, historyIndex });

    setHistoryIndex((prev) => prev - 1);

    contextRef.current.fillStyle = 'white';
    contextRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [contextRef, canvasRef, setImageHistory, imageHistory, historyIndex, setHistoryIndex]);

  const onRedo = useCallback(() => {
    if (!contextRef.current || !canvasRef.current || historyIndex >= imageHistory.length - 1) return;
    setHistoryIndex((prev) => prev + 1);
  }, [contextRef, canvasRef, setHistoryIndex, historyIndex, imageHistory]);

  const onChangeRange = useCallback(
    (e) => {
      if (!contextRef.current) return;

      console.log(e.target);
      setStrokeWidth(e.target.value);
      contextRef.current.lineWidth = strokeWidth;
    },
    [contextRef, strokeWidth],
  );

  const save = useCallback(() => {
    if (!canvasRef.current) return;
    const image = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'PaintJS';
    link.click();
    link.remove();
  }, [canvasRef]);

  const onDetect = useCallback(async () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;

      const imageFormData = new FormData();
      imageFormData.append('image', blob);
      const { data } = await axios.post('http://localhost:3005/detection', imageFormData);

      console.log(data);
      setDetectedText(data.text);
    });
  }, [canvasRef, detectedText]);

  const onUploadImage = useCallback(async (e) => {
    const imageFormData = new FormData();
    imageFormData.append('image', e.target.files[0]);
    const { data } = await axios.post('http://localhost:3005/detection', imageFormData);
    console.log(data);
  }, []);

  const onKeyDownCanvas = useCallback(
    (e) => {
      console.log(e.key);
      if (e.key === 'Z') {
        console.log('z키 눌렀다');
        if (e.ctrlKey) {
          console.log('컨트롤도 눌렀다');
          onUndo();
        }
      }
    },
    [onUndo],
  );

  return (
    <div css={row}>
      <div>
        {detectedText && <h1>{detectedText}</h1>}
        <canvas
          css={canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          ref={canvasRef}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={finishDrawing}
          onKeyPress={onKeyDownCanvas}
        />
        <div css={controls}>
          <div>단어 추측 : {detectedText}</div>
          <div css={controlsRange}>
            <input type="range" min="5" max="10" value={strokeWidth} step="0.5" onChange={onChangeRange} />
          </div>
          <div css={controlButtons}>
            <button type="button" onClick={onUndo}>
              Undo
            </button>
            <button type="button" onClick={onRedo}>
              Redo
            </button>
            <button type="button" onClick={save}>
              Save
            </button>
            <button type="button" onClick={onReset}>
              Reset
            </button>
            <button type="button" onClick={onDetect}>
              Detect Text
            </button>
            <button type="button" onClick={() => console.log({ imageHistory, historyIndex })}>
              배열 확인
            </button>
            <input type="file" onChange={onUploadImage} />
          </div>
        </div>
      </div>
    </div>
  );
};

const row = css`
  display: flex;
  gap: 16px;
  text-align: center;
`;

const canvas = css`
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(50, 50, 90, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    cursor: crosshair;
  }
`;

const controls = css`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const controlButtons = css`
  margin-bottom: 30px;

  button {
    all: unset;
    cursor: pointer;
    background-color: white;
    padding: 5px 0;
    width: 80px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(50, 50, 90, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    border: 2px solid rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.7);
    text-transform: uppercase;
    font-weight: 800;
    font-size: 12px;
  }

  button:active {
    transform: scale(0.98);
  }
`;

const controlsRange = css`
  margin-bottom: 30px;
`;

export default Home;
