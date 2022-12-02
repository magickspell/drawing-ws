import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

const WrongPage = () => {

    /**
     *  This page just redirect you to root path with its own id
    * */

    const navigate = useNavigate()

    useEffect(() => {
        navigate(`/f${(+new Date).toString(16)}`)
    }, [])

    return (
        <div>
            <p>404</p>
        </div>
    );
};

export default WrongPage;