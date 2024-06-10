import React, { useEffect, useState } from "react";
import './Clicker.css';

const Clicker = () => {
    const zero = 0;
    const energyValue = 500;
    const [score, setScore] = useState(zero.toFixed(2));
    const [energy, setEnergy] = useState(energyValue.toFixed(2));

    function ClickCoin() {
        if(energy >= 10) {
            const changeScore = Number(score) + 5;
            const changeEnergy = Number(energy - 5);
            setScore(changeScore.toFixed(2));
            setEnergy(changeEnergy.toFixed(2));
        } else {
            alert('Out of energy')
        }
    }

    const hours = 3;
    const minutes = 0;
    const seconds = 0;

    const [paused, setPaused] = useState(true);
    const [over, setOver] = useState(false);
    const [[h, m, s], setTime] = useState([hours, minutes, seconds]);

    const tick = () => {
        if (paused || over) return;

        if (h === 0 & m === 0 & s === 0) {
            setOver(true);
        } else if (m === 0 && s === 0) {
            setTime([h - 1, 59, 59]);
        } else if (s == 0) {
            setTime([h, m - 1, 59]);
        } else {
            setTime([h, m, s - 1]);
        }
    };

    const reset = () => {
        setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
        setPaused(true);
        setOver(false);
    };

    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000);
        return () => clearInterval(timerID);
    })

    return (
        <div className="container">
            <div className="score">{score}</div>
            <div className="coin__container" onClick={ClickCoin}>
                <img className="coin__img" src={require("../../assets/coin.png")} alt="coin" />
            </div>
            <div className="energy__container">
                <h3 className="energy__title">Energy: </h3> 
                <div className="energy__pb">
                    <div className="energy__scale" style={{width: `${energy / 5}%`}}></div>
                    <span className="energy__score">{Number(energy).toFixed(2)}</span>
                </div>
            </div>
            <div className="autofarm">
                <p className="autofarmTimer">
                    {`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
                </p>
                <div>{over ? "Time's up!" : ""}</div>
                <button onClick={() => setPaused(false)}>Start</button>
                <button onClick={() => reset()}>Pause</button>
            </div>
        </div>
    )
};

export default Clicker;