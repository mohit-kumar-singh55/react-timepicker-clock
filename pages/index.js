/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

const CENTER = { x: 150, y: 150 };
const BASEPOINT = { x: 150, y: 0 };

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0];

const TimePickerClock = () => {
    const clockRef = useRef(null);
    const hourRef = useRef(null);
    const minuteRef = useRef(null);
    const [hour, setHour] = useState(0);                            // degrees
    const [minute, setMinute] = useState(0);                       // degrees
    const [containerPOS, setContainerPOS] = useState({});
    const [selected, setSelected] = useState({
        hour: true,
        minute: false
    })
    const [original, setOriginal] = useState({ hour: 0, minute: 0 });
    const [noon, setNoon] = useState('AM');                             // default

    // function returning original val to outside
    // useEffect(() => {
    //     let hh = original?.hour < 10 ? '0' + original?.hour : original?.hour;
    //     let mm = original?.minute < 10 ? '0' + original?.minute : original?.minute;

    //     onChange(hh + ':' + mm + ' ' + noon);
    // }, [original, noon])

    useEffect(() => {
        const maskPosition = clockRef?.current?.getBoundingClientRect();
        setContainerPOS({
            y: maskPosition.top,
            x: maskPosition.left
        })
    }, [])

    // calculating original hour & minute using their degrees hours -> (degree/6) & minutes -> (degree/30)
    useEffect(() => {
        if (selected?.hour) {
            hourRef.current.style.transform = `rotate(${hour}deg)`;

            setOriginal({ ...original, hour: parseInt(hour / 30) })
        }
        else {
            minuteRef.current.style.transform = `rotate(${minute}deg)`;

            setOriginal({ ...original, minute: parseInt(minute / 6) === 60 ? 0 : parseInt(minute / 6) })
        }
    }, [hour, minute, selected])

    const getDegree = (offsetX, offsetY) => {
        const x = offsetX - CENTER.x;
        const y = offsetY - CENTER.y;
        const cx = BASEPOINT.x - CENTER.x;
        const cy = BASEPOINT.y - CENTER.y;
        const atan = Math.atan2(cx, cy) - Math.atan2(x, y);
        return (atan * 57.29577951308232) % 360;
    }

    function isMousePressed(event) {
        if (typeof event.buttons === 'undefined') {
            return event.nativeEvent.which !== 1;
        }

        return event.buttons !== 1;
    }

    const changeClock = (clientX, clientY) => {
        const x = clientX - containerPOS.x;
        const y = clientY - containerPOS.y;

        if (selected?.hour) {
            let hourDegree = getDegree(x, y);

            setHour(hourDegree % 30 === 0 ? hourDegree : hourDegree + 30 - (hourDegree % 30))
        }
        else setMinute(getDegree(x, y));
    };

    const handleTouchMove = (event) => {
        event?.preventDefault();
        changeClock(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    };

    const handleTouchUp = (event) => {
        if (event.target === clockRef?.current) return;
        changeClock(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    };

    const handleMove = (event) => {
        event.preventDefault();
        if (isMousePressed(event)) return;
        changeClock(event.nativeEvent.clientX, event.nativeEvent.clientY);
    };

    const handleMoveUp = (event) => {
        if (event.target === clockRef?.current) return;
        changeClock(event.nativeEvent.clientX, event.nativeEvent.clientY);
    };

    return (
        <div className='flex flex-col items-center gap-3 max-w-[300px] w-full'>
            {/* input */}
            <div className="flex items-center gap-3 text-[17px] cursor-default">
                <span
                    onClick={() => setSelected({ ...false, hour: true })}
                    className={`font-medium cursor-pointer ${selected?.hour ? 'text-[#f65a54]' : 'text-[#f6595490]'}`}
                >
                    {original?.hour < 10 ? '0' + original?.hour : original?.hour}
                </span>
                {' : '}
                <span
                    onClick={() => setSelected({ ...false, minute: true })}
                    className={`font-medium cursor-pointer ${selected?.minute ? 'text-[#f65a54]' : 'text-[#f6595490]'}`}
                >
                    {original?.minute < 10 ? '0' + original?.minute : original?.minute}
                </span>

                <span onClick={() => setNoon('AM')} className={`text-center px-1 rounded-sm font-medium cursor-pointer transition-all duration-200 ${noon === 'AM' ? 'bg-[#f65a54] text-white' : 'bg-[#f659545a] text-[#f65a54]'}`}>
                    AM
                </span>

                <span onClick={() => setNoon('PM')} className={`text-center px-1 rounded-sm font-medium cursor-pointer transition-all duration-200 ${noon === 'PM' ? 'bg-[#f65a54] text-white' : 'bg-[#f659545a] text-[#f65a54]'}`}>
                    PM
                </span>
            </div>

            {/* clock */}
            <div
                className="clock"
                ref={clockRef}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchUp}
                onMouseMove={handleMove}
                onMouseUp={handleMoveUp}
            >
                {selected?.hour ? (
                    <>
                        <div className="hourHand" ref={hourRef} />
                        <div className="center" />
                        <ul>
                            {HOURS?.map((x, i) => (
                                <li
                                    key={i}
                                    onClick={() => setHour(30 * (i + 1))}
                                    className={original?.hour === x ? 'bg-[#f65a54] text-white' : 'bg-transparent text-black'}
                                >
                                    <span>
                                        {x}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <span className="minuteHand" ref={minuteRef} />
                        <div className="center" />
                        <ul>
                            {MINUTES?.map((x, i) => (
                                <li
                                    key={i}
                                    onClick={() => setMinute(30 * (i + 1))}
                                    className={original?.minute === x ? 'bg-[#f65a54] text-white' : 'bg-transparent text-black'}
                                >
                                    <span>
                                        {x}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    )
}

export default TimePickerClock;