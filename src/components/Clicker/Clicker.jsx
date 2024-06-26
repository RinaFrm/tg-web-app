import React, { useEffect, useState } from "react";
import './Clicker.css';
import { Progress } from "@nextui-org/progress";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, Spinner, Switch, useDisclosure } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { addPoints, updateEnergy, updateSliceAutofarmStatus } from "../../store/slices/users";
import { putEnergyStatus, putPoints, updateAutofarmStatus } from "../../App";

const Clicker = () => {
    const dispatch = useDispatch();
    const { currentUser, loadingUser } = useSelector((state) => state.users);
    const userPoints = Number(currentUser.points).toFixed(2);
    const userEnergy = currentUser.farm_params.energy;
    const maxEnergy = currentUser.farm_params.max_energy;
    const pointsPerClick = currentUser.farm_params.points_per_click;
    const [energyStatus, setEnergyStatus] = useState(currentUser.farm_params.status);
    const energyRecTime = currentUser.farm_params.recovery_time;

    // const formatTime = (time) => {
    //     const hours = time.slice(-1) === 'h' ? time.slice(0, -1) : 8;
    //     const minutes = time.slice(-1) === 'm' ? time.slice(0, -1) : 0;
    //     const seconds = time.slice(-1) === 's' ? time.slice(0, -1) : 0;
        
    //     return [hours, minutes, seconds]
    // }

    const formatTime = (time) => {
        const hours = Math.floor(time / 60 / 60);
        const minutes = Math.floor(time / 60) - (hours * 60);
        const seconds = time % 60;

        return [hours, minutes, seconds];
    }

    //TAP
    const date = new Date();
    const timeLeftInSec =  Math.round((new Date(date.getTime() + date.getTimezoneOffset() * 60000) - (new Date(currentUser.farm_params.recovery_start_time).getTime())) / 1000);
    // const [hoursE, minutesE, secondsE] = timeLeftInSec > 3600 ? formatTime(currentUser.farm_params.recovery_time) : formatMinTime(3600 - timeLeftInSec);
    const [hoursE, minutesE, secondsE] = timeLeftInSec > energyRecTime ? formatTime(energyRecTime) : formatTime(energyRecTime - timeLeftInSec);
    const [[hE, mE, sE], setEnergyTime] = useState([hoursE, minutesE, secondsE]);

    //modal for energy out
    const {isOpen, onOpen, onClose} = useDisclosure();

    function ClickCoin() {
        if(userEnergy >= pointsPerClick) {
            if(userEnergy === maxEnergy) {
                putEnergyStatus(currentUser.username, 'Recovery');
                setEnergyStatus('Recovery');
            }

            const changeScore = Number(userPoints) + Number(pointsPerClick);
            const changeEnergy = Number(userEnergy) - Number(pointsPerClick);
            dispatch(updateEnergy(changeEnergy));
            dispatch(addPoints(Number(changeScore.toFixed(2))));
            putPoints(currentUser.username, changeScore, changeEnergy);
        } else {
            onOpen();
        }
    }

    const energyTick = () => {
        if (hE === 0 & mE === 0 & sE === 0) {
            dispatch(updateEnergy(maxEnergy));
            putEnergyStatus(currentUser.username, 'Full');
            setEnergyStatus('Full');
            setEnergyTime(formatTime(energyRecTime))
        } else if (mE === 0 && sE === 0) {
            setEnergyTime([hE - 1, 59, 59]);
        } else if (sE == 0) {
            setEnergyTime([hE, mE - 1, 59]);
        } else {
            setEnergyTime([hE, mE, sE - 1]);
        }
    };

    useEffect(() => {
        const energyTimer = setInterval(() => {
            if (energyStatus === "Recovery") {
                energyTick();
            } else {
                clearInterval(energyTimer);
            }

        }, 1000)

        return () => clearInterval(energyTimer);
    });

    //AUTOFARMING
    const farmTime = currentUser.autofarm_params.farm_time;
    const farmTimeLeftInSec =  Math.round((new Date(date.getTime() + date.getTimezoneOffset() * 60000) - (new Date(currentUser.autofarm_params.farm_time_start).getTime())) / 1000);
    // const [hours, minutes, seconds] = currentUser.autofarm_params.farm_time_start === 0 ? formatTime(farmTime) : formatMinTime(28800 - farmTimeLeftInSec);
    const [hours, minutes, seconds] = farmTimeLeftInSec > farmTime ? formatTime(farmTime) : formatTime(farmTime - farmTimeLeftInSec);
    const [[h, m, s], setTime] = useState([hours, minutes, seconds]);
    const autofarmStatus = currentUser.autofarm_params.status;
    const farmPointsPerMin = currentUser.autofarm_params.farm_points_per_min;
    const userFarmingScore = autofarmStatus === 'Not farming' || autofarmStatus === 'Full' ? Number(currentUser.autofarm_params.auto_farm_points).toFixed(2) : ((farmTimeLeftInSec / 60 * Number(farmPointsPerMin)).toFixed(2));
    const [btnState, setBtnState] = useState(autofarmStatus === 'Farming' ? 'farming' : autofarmStatus === 'Full' ? 'claim' : 'idle');
    const [farmingScore, setFarmingScore] = useState(userFarmingScore);
    const farmingScaleProcent = 100 - (h*3600 + m*60 + s) / (farmTime / 100);

    const tick = (hours, minutes, seconds) => {
        if (hours === 0 & minutes === 0 & seconds === 0) {
            setBtnState('claim');
        } else if (minutes === 0 && seconds === 0) {
            setTime([hours - 1, 59, 59]);
            setFarmingScore(Number(farmingScore) + farmPointsPerMin / 60);
        } else if (seconds == 0) {
            setTime([hours, minutes - 1, 59]);
            setFarmingScore(Number(farmingScore) + farmPointsPerMin / 60);
        } else {
            setFarmingScore(Number(farmingScore) + farmPointsPerMin / 60);
            setTime([hours, minutes, seconds - 1]);
        }
    };

    useEffect(() => {
        const farmingTimer = setInterval(() => {
            if(btnState === 'farming') {
                tick(h, m, s);
            } else {
                clearInterval(farmingTimer);
            }
        }, 1000);

        return () => clearInterval(farmingTimer);
    })

    const startAutoFarming = () => {
        setBtnState('farming');
        updateAutofarmStatus(currentUser.username, 'Start farming');
        dispatch(updateSliceAutofarmStatus('Farming'))
    };

    const claim = () => {
        setFarmingScore(0);
        setBtnState('idle');
        updateAutofarmStatus(currentUser.username, 'Claim');
        dispatch(updateSliceAutofarmStatus('Not farming'));
        setTime(formatTime(farmTime));
    }

    const fullBarMultiplier = currentUser.autofarm_params.full_bar_multiplier;

    const claimMultiply = () => {
        const multiplyScore = Number(farmingScore) * Number(fullBarMultiplier);
        dispatch(addPoints(Number(userPoints) + Number(farmingScore) * multiplyScore));
        putPoints(currentUser.username, (Number(userPoints) + Number(farmingScore) * Number(multiplyScore)), currentUser.farm_params.energy);
        claim();
    }

    const claimAndStop = () => {
        dispatch(addPoints((Number(userPoints) + Number(farmingScore))));
        putPoints(currentUser.username, (Number(userPoints) + Number(farmingScore)), currentUser.farm_params.energy);
        claim();
    }

    //MODE 
    const [mode, setMode] = useState('none');
    useEffect(() => {
        if (energyStatus === 'Recovery') {
            setMode('tap');
        } else if (autofarmStatus === 'Farming') {
            setMode('farming');
        } else {
            setMode('none');
        }
    }, [energyStatus, autofarmStatus])

    return (
        <div className="container">
            {loadingUser === 'loading' ? 
            <Spinner label="Loading" color="warning" labelColor="warning" size="lg"/>
            :
            <>
            <div className="tap" style={mode === 'farming' ? {pointerEvents: 'none', opacity: '0.5'} : {}}>
                <div className="score">{userPoints}</div>
                <div className="coin__container" onClick={ClickCoin}>
                    <img className="coin__img" src={require("../../assets/coin.png")} alt="coin" />
                </div>
                <Progress 
                    label="Energy"
                    size="sm"
                    radius="sm"
                    value={userEnergy}
                    maxValue={maxEnergy}
                    classNames={{
                        base: "max-m-md",
                        track: "drop-shadow-md",
                        indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                        label: "tracking-wider text-zinc-200",
                        value: "text-zinc-300"
                    }}
                />
                <div className="energy__index">
                    <span className="energy__value">{userEnergy}</span>
                    <div className="energy__timer">
                        {`Recovery time: ${hE.toString().padStart(2, '0')}:${mE.toString().padStart(2, '0')}:${sE.toString().padStart(2, '0')}`}
                    </div>
                </div>
            </div>
            <div className="autofarm" style={mode === 'tap' ? {pointerEvents: 'none', opacity: '0.5'} : {}}>
                {btnState === 'idle' &&
                    <Button 
                    color="primary" 
                    variant="faded" 
                    className="autofarm__btn text-lg text-primary-900"
                    onClick={() => startAutoFarming()}
                    >
                        Start farming
                    </Button>
                }
                {btnState === 'farming' &&
                    <div onClick={() => claimAndStop()} className="autofarm__container">
                        <div style={{width: `${farmingScaleProcent}%`}} className="autofarm__scale"/>
                        <div className="autofarm_text">
                            <p className="autofarm__title">Farming: <span className="autofarm__score">{Number(farmingScore).toFixed(2)}</span></p>
                            <div className="autofarm__timer">
                                {`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
                            </div>
                        </div>
                    </div>
                }
                {btnState === 'claim' &&
                    <Button 
                        color="primary" 
                        variant="faded" 
                        className="autofarm__btn text-lg text-primary-900"
                        onClick={() => claimMultiply()}
                    >
                        Claim {Number(farmingScore).toFixed(2)} * {fullBarMultiplier}
                    </Button>
                }
            </div>
            <Modal 
                size="sm" 
                isOpen={isOpen} 
                onClose={onClose}
                placement="center"
                classNames={{
                    body: 'py-5',
                    base: "bg-[#CCE3FD] text-[#001731]",
                }}          
            >
                <ModalContent>
                    {(onClose) => (
                        <ModalBody>
                            <p>Out of energy! Wait for recovery.</p>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
            </>
            }
        </div>
    )
};

export default Clicker;