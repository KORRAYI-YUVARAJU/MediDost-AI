'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

/* ─── Load heavy 3D bits client-only ───────────────────────────── */
const GLBCanvas = dynamic(() => import('./GLBCanvas'), {
    ssr: false,
    loading: () => (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
            gap: 16,
        }}>
            {/* Skeleton silhouette */}
            <div style={{
                width: 80, height: 200,
                background: 'linear-gradient(180deg, rgba(34,211,238,0.15) 0%, rgba(167,139,250,0.08) 100%)',
                borderRadius: 40,
                animation: 'anatomyPulse 1.6s ease-in-out infinite',
            }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(34,211,238,0.6)', letterSpacing: '0.1em' }}>
                Loading 3D Model…
            </div>
        </div>
    ),
});

/* ─────────────────────────────────────────────────────────────────
   Zone annotation data
   Each annotation has:
     bodyPct  : { x, y }  ← % position ON the viewport
     side     : 'left' | 'right'
     color    : accent hex
     icon     : emoji
     title    : short label
     problem  : clinical finding
     advice   : next-step guidance
     severity : 'high' | 'medium' | 'low'
───────────────────────────────────────────────────────────────── */
const ANNOTATIONS = {
    cardiovascular: [
        {
            bodyPct: { x: 45, y: 28 },
            side: 'left',
            color: '#ef4444',
            icon: '🫀',
            title: 'Pectoralis / Heart Zone',
            problem: 'LDL Cholesterol: 180 mg/dL (↑ high). Risk of arterial plaque buildup.',
            advice: 'Consult a Cardiologist · Reduce saturated fats',
            severity: 'high',
        },
        {
            bodyPct: { x: 55, y: 34 },
            side: 'right',
            color: '#f87171',
            icon: '💓',
            title: 'Left Ventricle Region',
            problem: 'Blood Pressure: 148/96 mmHg. Mildly hypertensive pattern detected.',
            advice: 'Monitor BP daily · DASH diet recommended',
            severity: 'medium',
        },
    ],
    renal: [
        {
            bodyPct: { x: 40, y: 44 },
            side: 'left',
            color: '#f97316',
            icon: '🫁',
            title: 'Left Kidney Zone',
            problem: 'Creatinine: 1.4 mg/dL (↑ elevated). Possible early kidney stress.',
            advice: 'Increase water intake · Consult Nephrologist',
            severity: 'medium',
        },
        {
            bodyPct: { x: 60, y: 44 },
            side: 'right',
            color: '#fb923c',
            icon: '⚗️',
            title: 'Right Kidney / Ureter',
            problem: 'GFR: 68 mL/min (borderline). Protein slightly elevated in urine.',
            advice: 'Reduce sodium & protein load · Follow-up in 4 weeks',
            severity: 'low',
        },
    ],
    skeletal: [
        {
            bodyPct: { x: 28, y: 22 },
            side: 'left',
            color: '#60a5fa',
            icon: '🦴',
            title: 'Left Shoulder Joint',
            problem: 'Uric Acid: 7.2 mg/dL (↑ high). Gout inflammation risk in joint.',
            advice: 'Avoid purine-rich foods · Consult Rheumatologist',
            severity: 'high',
        },
        {
            bodyPct: { x: 58, y: 72 },
            side: 'right',
            color: '#3b82f6',
            icon: '🦵',
            title: 'Right Knee Joint',
            problem: 'Calcium: 8.0 mg/dL (↓ low). Cartilage wear risk & bone density loss.',
            advice: 'Vitamin D3 + K2 supplement · Physiotherapy',
            severity: 'medium',
        },
    ],
};

const SEVERITY_COLORS = {
    high: { bg: '#ef444420', text: '#fca5a5', dot: '#ef4444' },
    medium: { bg: '#f9731620', text: '#fdba74', dot: '#f97316' },
    low: { bg: '#22c55e20', text: '#86efac', dot: '#22c55e' },
};

export default function AnatomyViewer({ activeZone = 'default' }) {
    const [visible, setVisible] = useState(false);
    const [rotating, setRotating] = useState(true);
    const canvasRef = useRef();
    const annotations = ANNOTATIONS[activeZone] || [];

    useEffect(() => {
        setVisible(false);
        if (annotations.length === 0) return;
        const t = setTimeout(() => setVisible(true), 180);
        return () => clearTimeout(t);
    }, [activeZone]);

    /* ── Button handlers ── */
    const zoomIn = () => canvasRef.current?.zoomIn();
    const zoomOut = () => canvasRef.current?.zoomOut();
    const resetView = () => canvasRef.current?.resetView();
    const rotateLeft = () => canvasRef.current?.rotateLeft();
    const rotateRight = () => canvasRef.current?.rotateRight();
    const toggleRot = () => { canvasRef.current?.toggleRotate(); setRotating(r => !r); };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* ── 3D canvas — fills all space ── */}
            <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
                <GLBCanvas ref={canvasRef} activeZone={activeZone} />

                {/* Annotation overlay */}
                {annotations.length > 0 && (
                    <AnnotationLayer annotations={annotations} visible={visible} activeZone={activeZone} />
                )}
            </div>

            {/* ── Control bar ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 16px 14px',
                background: 'linear-gradient(to top, rgba(3,7,18,0.9) 0%, transparent 100%)',
                flexShrink: 0,
                zIndex: 20,
            }}>
                <CtrlBtn onClick={zoomIn} icon="🔍" label="+" tip="Zoom In" />
                <CtrlBtn onClick={zoomOut} icon="🔍" label="−" tip="Zoom Out" />
                <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
                <CtrlBtn onClick={rotateLeft} icon="↺" tip="Rotate Left" big />
                <CtrlBtn onClick={rotateRight} icon="↻" tip="Rotate Right" big />
                <CtrlBtn onClick={toggleRot} icon={rotating ? '⏸' : '▶'} tip={rotating ? 'Pause Rotation' : 'Auto Rotate'} active={rotating} />
                <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
                <CtrlBtn onClick={resetView} icon="⊙" tip="Reset View" />
            </div>
        </div>
    );
}

/* ── Glass control button ── */
function CtrlBtn({ onClick, icon, label, tip, active, big }) {
    const [hov, setHov] = useState(false);
    return (
        <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Tooltip */}
            {hov && (
                <div style={{
                    position: 'absolute', bottom: '110%',
                    background: 'rgba(10,14,24,0.95)',
                    border: '1px solid rgba(34,211,238,0.25)',
                    color: '#e2e8f0', fontSize: '0.68rem', fontWeight: 500,
                    padding: '4px 10px', borderRadius: 8,
                    whiteSpace: 'nowrap', pointerEvents: 'none',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}>
                    {tip}
                </div>
            )}
            <button
                onClick={onClick}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                title={tip}
                style={{
                    width: big ? 44 : 40,
                    height: big ? 44 : 40,
                    border: `1px solid ${active ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 12,
                    background: active
                        ? 'rgba(34,211,238,0.15)'
                        : hov
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(12px)',
                    color: active ? '#22d3ee' : '#cbd5e1',
                    fontSize: big ? 20 : 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s',
                    transform: hov ? 'translateY(-2px)' : 'none',
                    boxShadow: active
                        ? '0 0 16px rgba(34,211,238,0.25)'
                        : hov
                            ? '0 4px 16px rgba(0,0,0,0.3)'
                            : 'none',
                    outline: 'none',
                    lineHeight: 1,
                    gap: 2,
                }}
            >
                {icon}{label && <span style={{ fontSize: 13, fontWeight: 700, marginLeft: 1 }}>{label}</span>}
            </button>
        </div>
    );
}



/* ─── Annotation Layer ──────────────────────────────────────────── */
function AnnotationLayer({ annotations, visible, activeZone }) {
    return (
        <div style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1)',
            zIndex: 10,
        }}>
            {annotations.map((ann, i) => (
                <AnnotationPin
                    key={`${activeZone}-${i}`}
                    ann={ann}
                    delay={i * 120}
                    visible={visible}
                />
            ))}
        </div>
    );
}

/* ─── Single Annotation Pin + Card ─────────────────────────────── */
function AnnotationPin({ ann, delay, visible }) {
    const dotX = ann.bodyPct.x;
    const dotY = ann.bodyPct.y;
    const isLeft = ann.side === 'left';
    const sev = SEVERITY_COLORS[ann.severity];

    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            {/* SVG dot + line */}
            <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 11 }}
                preserveAspectRatio="none"
            >
                {/* Pulsing ring */}
                <circle
                    cx={`${dotX}%`} cy={`${dotY}%`}
                    r="9" fill="none"
                    stroke={ann.color} strokeWidth="1.5" opacity="0.45"
                    style={{ animation: 'pulseRing 2s ease-in-out infinite' }}
                />
                {/* Solid centre */}
                <circle
                    cx={`${dotX}%`} cy={`${dotY}%`}
                    r="5" fill={ann.color} opacity="0.9"
                />
                {/* Connector line */}
                <line
                    x1={`${dotX}%`} y1={`${dotY}%`}
                    x2={isLeft ? `${dotX - 10}%` : `${dotX + 10}%`}
                    y2={`${dotY}%`}
                    stroke={ann.color} strokeWidth="1.5"
                    strokeDasharray="4 3" opacity="0.6"
                />
            </svg>

            {/* Info Card */}
            <div style={{
                position: 'absolute',
                top: `${dotY}%`,
                ...(isLeft
                    ? { right: `${100 - dotX + 10}%` }
                    : { left: `${dotX + 10}%` }),
                transform: 'translateY(-50%)',
                width: 220,
                background: 'rgba(10, 14, 24, 0.92)',
                border: `1px solid ${ann.color}44`,
                borderLeft: isLeft ? undefined : `3px solid ${ann.color}`,
                borderRight: isLeft ? `3px solid ${ann.color}` : undefined,
                backdropFilter: 'blur(16px)',
                borderRadius: 12,
                padding: '12px 14px',
                pointerEvents: 'auto',
                boxShadow: `0 0 24px ${ann.color}22, 0 4px 20px rgba(0,0,0,0.5)`,
                zIndex: 12,
                transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
                opacity: visible ? 1 : 0,
                transform: visible
                    ? 'translateY(-50%)'
                    : `translateY(calc(-50% + ${isLeft ? '-' : ''}10px))`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{ann.icon}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: ann.color, letterSpacing: '-0.01em' }}>
                        {ann.title}
                    </span>
                    <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.6rem', fontWeight: 600,
                        padding: '2px 7px', borderRadius: 99,
                        background: sev.bg, color: sev.text,
                        border: `1px solid ${sev.dot}33`,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                        ● {ann.severity}
                    </span>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'rgba(232,237,245,0.7)', lineHeight: 1.55, marginBottom: 10 }}>
                    {ann.problem}
                </p>

                <div style={{
                    fontSize: '0.68rem', fontWeight: 600,
                    color: ann.color,
                    background: `${ann.color}11`,
                    border: `1px solid ${ann.color}30`,
                    borderRadius: 8,
                    padding: '5px 9px',
                    display: 'flex', alignItems: 'center', gap: 5,
                }}>
                    <span>→</span> {ann.advice}
                </div>
            </div>
        </div>
    );
}
