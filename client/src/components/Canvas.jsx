import React, {useEffect, useRef} from 'react';
import './canvas.scss';
import {observer} from "mobx-react-lite";
import CanvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import canvasState from "../store/canvasState";
import {useParams} from "react-router-dom";
import axios from "axios";

const Canvas = observer(() => {
    const canvasRef = useRef()
    const params = useParams() // url params to get id of websocket id from page-url (room)

    useEffect(() => {
        CanvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:3001/image?id=${params.id}`).then(
            res => {
                const img = new Image()
                img.src = res.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            }
        )
    }, [])

    function mouseDownHandler() {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:3001/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(res => console.log(res.data))
    }

    const usernameRef = useRef('')

    function connectionHandler() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        usernameRef.current = result
        canvasState.setUsername(usernameRef.current)
    }

    useEffect(() => {
        connectionHandler()
    }, [])

    // websocket creation and handle
    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://localhost:3001/`)
            canvasState.setSocket(socket)
            canvasState.setSessionID(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id)) // set draw method (instrument)
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection'
                }))
            }
            socket.onmessage = (e) => {
                console.log(e.data)
                let msg = JSON.parse(e.data)
                switch (msg.method) {
                    case 'connection':
                        console.log(`user ${msg.username} connected!`)
                        break
                    case 'draw':
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username])

    function drawHandler(msg) {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch(figure.type) {
            case 'finish':
                ctx.beginPath() // break infinity drawing on not-main clients
                break
            case 'brush':
                Brush.draw(ctx, figure.x, figure.y)
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
        }
    }

    return (
        <div className={'canvas'}>
            <canvas ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={() => mouseDownHandler()} // for undo and redo actions
            ></canvas>
        </div>
    );
});

export default Canvas;

// rsc - react component