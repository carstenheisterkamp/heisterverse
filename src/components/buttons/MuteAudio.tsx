/* eslint-disable @typescript-eslint/no-loss-of-precision */
import React, { useRef, useEffect } from 'react';

const MuteAudioButton: React.FC = () => {
    const pathRef = useRef<SVGPathElement>(null);
    const m = 0.512286623256592433;

    const buildWave = (w: number, h: number) => {
        const a = h / 4;
        const y = h / 2;

        const pathData = [
            'M', w * 0, y + a / 2,
            'c',
            a * m, 0,
            -(1 - a) * m, -a,
            a, -a,
            's',
            -(1 - a) * m, a,
            a, a,
            's',
            -(1 - a) * m, -a,
            a, -a,
            's',
            -(1 - a) * m, a,
            a, a,
            's',
            -(1 - a) * m, -a,
            a, -a,
            's',
            -(1 - a) * m, a,
            a, a,
            's',
            -(1 - a) * m, -a,
            a, -a,
            's',
            -(1 - a) * m, a,
            a, a,
            's',
            -(1 - a) * m, -a,
            a, -a,
            's',
            -(1 - a) * m, a,
            a, a,
            's',
            -(1 - a) * m, -a,
            a, -a,
            's',
            -(1 - a) * m, a,
            a, a,
            's',
            -(1 - a) * m, -a,
            a, -a,
            's',
            -(1 - a) * m, a,
            a, a,
            's',
            -(1 - a) * m, -a,
            a, -a
        ].join(' ');

        if (pathRef.current) {
            pathRef.current.setAttribute('d', pathData);
        }
    };

    useEffect(() => {
        buildWave(64, 64); // Call the function with appropriate width and height
    }, []);

    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64px"
                height="64px"
                viewBox="0 0 64 64"
            >
                <path
                    ref={pathRef}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

export default MuteAudioButton;
