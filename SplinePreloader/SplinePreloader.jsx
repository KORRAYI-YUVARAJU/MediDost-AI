'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import './Preloader.css';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SplinePreloader({ children }) {
    const [progress, setProgress] = useState(0);
    const [splineReady, setSplineReady] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const intervalRef = useRef(null);

    // Simulate incremental progress
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(intervalRef.current);
                    return 90; // hold at 90 until Spline fires onLoad
                }
                const step = (90 - prev) * 0.06 + 0.4;
                return Math.min(prev + step, 90);
            });
        }, 40);
        return () => clearInterval(intervalRef.current);
    }, []);

    // When Spline scene is fully loaded
    const handleSplineLoad = () => {
        clearInterval(intervalRef.current);
        setSplineReady(true);
        // Sprint to 100%
        let p = 90;
        const sprint = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
                clearInterval(sprint);
                setProgress(100);
                setTimeout(() => {
                    setFadeOut(true);
                    setTimeout(() => setIsLoaded(true), 900);
                }, 450);
            }
        }, 18);
    };

    return (
        <>
            {!isLoaded && (
                <div className={`spline-preloader ${fadeOut ? 'spline-preloader--out' : ''}`}>
                    {/* Spline scene fills the background */}
                    <Spline
                        scene="https://prod.spline.design/HzDYCSfpxj3pRpRT/scene.splinecode"
                        onLoad={handleSplineLoad}
                    />

                    {/* Loading bar — anchored to the bottom */}
                    <div className="preloader-bar-wrap">
                        <div className="preloader-bar-header">
                            <span className={`preloader-label ${splineReady ? 'preloader-label--done' : ''}`}>
                                {splineReady ? 'Ready' : 'Loading'}
                            </span>
                            <span className="preloader-pct">{Math.round(progress)}%</span>
                        </div>
                        <div className="preloader-track">
                            <div
                                className="preloader-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={`spline-main-content ${fadeOut ? 'spline-main-content--visible' : ''}`}>
                {children}
            </div>
        </>
    );
}
