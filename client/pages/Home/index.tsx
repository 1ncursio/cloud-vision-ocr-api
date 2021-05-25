import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import axios from 'axios';
import SearchResult from '@components/SearchResult';
import { ISearchResult } from '@typings/ISearchResult';

const Home = () => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const [detectedText, setDetectedText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ISearchResult>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;

  const drawCrossLine = useCallback(() => {
    if (!contextRef.current) return;

    contextRef.current.lineWidth = 1;
    contextRef.current.strokeStyle = 'gray';

    contextRef.current.moveTo(CANVAS_WIDTH / 2, 0);
    contextRef.current.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    contextRef.current.stroke();

    contextRef.current.moveTo(0, CANVAS_HEIGHT / 2);
    contextRef.current.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
    contextRef.current.stroke();

    contextRef.current.strokeStyle = 'black';
    contextRef.current.lineWidth = strokeWidth;
  }, [contextRef]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.width = CANVAS_WIDTH * 2;
    canvas.height = CANVAS_HEIGHT * 2;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = 'round';
    context.beginPath();

    contextRef.current = context;

    drawCrossLine();
  }, []);

  useEffect(() => {
    if (searchResults) console.log(searchResults);
  }, [searchResults]);

  const startDrawing = useCallback(
    ({ nativeEvent }) => {
      if (!contextRef.current) return;

      const { offsetX, offsetY } = nativeEvent;
      // if (!contextRef) return;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    },
    [contextRef, isDrawing],
  );

  const finishDrawing = useCallback(() => {
    if (!contextRef.current) return;

    contextRef.current.closePath();
    console.log(contextRef.current);
    setIsDrawing(false);
  }, [contextRef, isDrawing]);

  const draw = useCallback(
    ({ nativeEvent }) => {
      if (!contextRef.current) return;
      if (!isDrawing) return;

      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    },
    [contextRef, isDrawing],
  );

  const onReset = useCallback(() => {
    if (!contextRef.current) return;

    contextRef.current.beginPath();

    contextRef.current.fillStyle = 'white';
    contextRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawCrossLine();

    setDetectedText('');
  }, [contextRef]);

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

      setDetectedText(data.text.replace(/\n/g, ''));
    });
  }, [canvasRef, detectedText]);

  const apiTest = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:3005/search?keyword=${encodeURIComponent(detectedText)}`);
    setSearchResults(data);
  }, [detectedText, searchResults]);

  return (
    <div css={row}>
      <div>
        <canvas css={canvas} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} ref={canvasRef} />
        <div css={controls}>
          <div>단어 추측 : {detectedText}</div>
          <div css={controlsRange}>
            <input type="range" min="5" max="10" value={strokeWidth} step="0.5" onChange={onChangeRange} />
          </div>
          <div css={controlButtons}>
            <button type="button" onClick={save}>
              Save
            </button>
            <button type="button" onClick={onReset}>
              Reset
            </button>
            <button type="button" onClick={onDetect}>
              Detect Text
            </button>
            <button type="button" onClick={apiTest}>
              사전 검색
            </button>
          </div>
        </div>
      </div>
      <div>{searchResults && <SearchResult data={searchResults} key={searchResults.slug} />}</div>
    </div>
  );
};

const row = css`
  display: flex;
  gap: 16px;
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
