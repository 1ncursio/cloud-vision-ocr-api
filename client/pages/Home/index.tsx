import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import axios from 'axios';

const Home = () => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef(null);

  const CANVAS_WIDTH = 700;
  const CANVAS_HEIGHT = 700;

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
    context.strokeStyle = 'black';
    context.lineWidth = strokeWidth;
    // @ts-ignore
    contextRef.current = context;
  }, []);

  const startDrawing = useCallback(
    ({ nativeEvent }) => {
      const { offsetX, offsetY } = nativeEvent;
      // if (!contextRef) return;
      // @ts-ignore
      contextRef.current.beginPath();
      // @ts-ignore
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    },
    [contextRef.current, isDrawing]
  );

  const finishDrawing = useCallback(() => {
    // @ts-ignore
    contextRef.current.closePath();
    setIsDrawing(false);
  }, [contextRef.current, isDrawing]);

  const draw = useCallback(
    ({ nativeEvent }) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = nativeEvent;
      // @ts-ignore
      contextRef.current.lineTo(offsetX, offsetY);
      // @ts-ignore
      contextRef.current.stroke();
    },
    [contextRef.current, isDrawing]
  );

  const onReset = useCallback(() => {
    // @ts-ignore
    contextRef.current.fillStyle = 'white';
    // @ts-ignore
    contextRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [contextRef.current]);

  const onChangeRange = useCallback(
    (e) => {
      console.log(e.target);
      setStrokeWidth(e.target.value);
      // @ts-ignore
      contextRef.current.lineWidth = strokeWidth;
    },
    [contextRef.current, strokeWidth]
  );

  const save = useCallback(() => {
    // @ts-ignore
    const image = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'PaintJS';
    link.click();
    link.remove();
  }, [canvasRef.current]);

  const onDetect = useCallback(async () => {
    // @ts-ignore
    const imageUrl = canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('image', blob);
      const response = await axios.post('http://localhost:3005/detection', formData, { headers: { 'content-type': 'multipart/form-data' } });
      console.log(response.data);
    });
    // try {
    //   // Read a local image as a text document
    //   const [result] = await client.batchAnnotateImages({
    //     requests: [
    //       {
    //         image: {
    //           content: image,
    //         },
    //         features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
    //         imageContext: { languageHints: ['ja-t-i0-handwrit'] },
    //       },
    //     ],
    //   });
    //   const fullTextAnnotation = result?.responses?.[0].fullTextAnnotation;
    //   console.log(`Full text: ${fullTextAnnotation?.text}`);
    // } catch (error) {
    //   console.error(error);
    // }
    // const response = await axios.post('http://localhost:3005/detection', { imageUrl });
    // console.log(response.data);
  }, [canvasRef.current]);

  return (
    <>
      <canvas css={canvas} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} ref={canvasRef}></canvas>
      <div css={controls}>
        <div css={controlsRange}>
          <input type="range" min="5" max="10" value={strokeWidth} step="0.5" onChange={onChangeRange} />
        </div>
        <div css={controlButtons}>
          <button onClick={save}>Save</button>
          <button onClick={onReset}>Reset</button>
          <button onClick={onDetect}>Detect Text</button>
        </div>
      </div>
    </>
  );
};

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
