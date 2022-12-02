import React, {useEffect, useRef, useState} from 'react';
import './toolbar.scss';
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";

const SettingsBar = () => {

    const [username, setUsername] = useState('')
    useEffect(() => {
        setUsername(canvasState.username)
    }, [])

    return (
        <div className={'toolbar'}>
            <label htmlFor="line-width">line width</label>
            <input
                id={'line-width'}
                type="number"
                min={1}
                max={20}
                defaultValue={1}
                onChange={(e) => {
                    toolState.setLineWidth(e.target.value)
                }}
            />

            <label htmlFor="stroke-color">stroke color</label>
            <input
                id={'stroke-color'}
                type="color"
                defaultValue={"#000"}
                onChange={(e) => {
                    toolState.setStrokeColor(e.target.value)
                }}
            />

            <p className={'username'}>username: {username}</p>
        </div>
    );
};

export default SettingsBar;