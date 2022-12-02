import React from 'react';
import './toolbar.scss';
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";

const ToolBar = () => {

    function onchangeColor(e) {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    /** download file */
    function download() {
        const dataUrl = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionId + '.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className={'toolbar'}>
            <button className={'toolbar__btn brush'}
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}
            >&#128397;</button>
            <button className={'toolbar__btn rect'}
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}
            >&#128306;</button>
            <button className={'toolbar__btn circle'}>&#128280;</button>
            <button className={'toolbar__btn eraser'}
                    onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}
            >&#9937;</button>
            <button className={'toolbar__btn line'}>&#9999;</button>
            <input type="color"
                   onChange={(e) => {onchangeColor(e)}}
            />
            <button className={'toolbar__btn undo'}
                    onClick={() => canvasState.undo()}
            >&#128072;</button>
            <button className={'toolbar__btn redo'}
                    onClick={() => canvasState.redo()}
            >&#128073;</button>
            <button className={'toolbar__btn save'}
                    onClick={() => {download()}}
            >&#128190;</button>
        </div>
    );
};

export default ToolBar;