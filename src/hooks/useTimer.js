import { useEffect, useState } from "react"

export const useTimer = () => {


    const [intervalId, setIntervalId] = useState('');
    const [timerDiff, setTimerDiff] = useState(0);

    useEffect(() => {
        return () => {
            clearTimer();
        }
    }, []);


    const setTimer = (time) => {

        let interval = setInterval(() => {
            let currentDate = new Date();
            let diff = time - currentDate.getTime();
            if (diff <= 0) {
                clearInterval(interval);
                setTimerDiff(0);
            } else {
                setTimerDiff(diff);
            }
        });
        setIntervalId(interval);
    }

    const clearTimer = () => {
        clearInterval(intervalId);
        setTimerDiff(0);
    }


    return [timerDiff, setTimerDiff, setTimer, clearTimer, intervalId]
}