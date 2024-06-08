import React, { useState } from "react";
import './Clicker.css';

const Clicker = () => {
    const [score, setScore] = useState(0);
    const [energy, setEnergy] = useState(500);

    function ClickCoin() {
        if(energy >= 10) {
            setScore(score + 10);
            setEnergy(energy - 10);
        } else {
            alert('Out of energy')
        }
    }

    return (
        <div className="container">
            <div className="coin_container" onClick={ClickCoin}>
                <img src={require("../../assets/coin.png")} alt="coin" />
            </div>
            <div className="score">Score: {score}</div>
            <div className="energy">
                <div className="energy_score" style={{width: `${energy / 5}%`}}></div>
                <span style={{position: 'absolute'}}>{energy}</span>
            </div>
        </div>
    )
};

export default Clicker;