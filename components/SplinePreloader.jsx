'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Application } from '@splinetool/runtime';
import './Preloader.css';

/* Pages where the preloader should be completely skipped */
const SKIP_PATHS = ['/login', '/register'];

export default function SplinePreloader({ children }) {
    const pathname = usePathname();
    const skipPreloader = SKIP_PATHS.some(p => pathname?.startsWith(p));

    const [progress, setProgress] = useState(0);
    const [splineReady, setSplineReady] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const intervalRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (skipPreloader) return; // don't run progress timer on auth pages

        intervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(intervalRef.current);
                    return 90;
                }
                const step = (90 - prev) * 0.06 + 0.4;
                return Math.min(prev + step, 90);
            });
        }, 40);
        return () => clearInterval(intervalRef.current);
    }, [skipPreloader]);

    useEffect(() => {
        if (skipPreloader || !canvasRef.current) return;

        const app = new Application(canvasRef.current);
        app.load('https://prod.spline.design/HzDYCSfpxj3pRpRT/scene.splinecode')
            .then(() => {
                handleSplineLoad();
            })
            .catch((err) => {
                console.error('Spline load error:', err);
                // Finish loading even if Spline fails
                handleSplineLoad();
            });

        return () => {
            app.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skipPreloader]);

    const handleSplineLoad = () => {
        clearInterval(intervalRef.current);
        setSplineReady(true);
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

    /* ── Skip entirely on auth pages ── */
    if (skipPreloader) {
        return <>{children}</>;
    }

    return (
        <>
            {!isLoaded && (
                <div className={`spline-preloader ${fadeOut ? 'spline-preloader--out' : ''}`}>
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
                    <div className="preloader-bar-wrap">
                        <div className="preloader-bar-header">
                            <span className={`preloader-label ${splineReady ? 'preloader-label--done' : ''}`}>
                                {splineReady ? 'Ready' : 'Loading'}
                            </span>
                            <span className="preloader-pct">{Math.round(progress)}%</span>
                        </div>
                        <div className="preloader-track">
                            <div className="preloader-fill" style={{ width: `${progress}%` }} />
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
