"use client";

import React, { useState, useEffect } from 'react';

// A collection of icons as SVG components
const icons = [
  // Icon for React
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="-11.5 -10.23174 23 20.46348" {...props}>
      <circle cx="0" cy="0" r="2.05" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  // Icon for Code
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  // Icon for 3D Cube
  (props: React.SVGProps<SVGSVGElement>) => (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  // Icon for Adobe-like shape (generic)
   (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  // Icon for Javascript
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M1,1 V23 H23 V1 Z M21,21 H3 V3 h18 z M11.2,10.1 H8.3 v5.9 h2.9 c1.7,0 2.9-1.2 2.9-2.9 S12.9,10.1 11.2,10.1 z M11.3,14.1 H10.2 V12 h1.1 c0.8,0 1,0.5 1,1 C12.3,13.6 12,14.1 11.3,14.1 z M18.9,13.2 c0,1.8-1.3,2.9-3,2.9 c-1.3,0-2.1-0.6-2.5-1.2 l1.9-1.1 c0.3,0.5 0.7,0.8 1,0.8 c0.6,0 1-0.3 1-0.8 v-0.1 c0-0.5-0.4-0.8-1.2-1.1 l-0.6-0.2 c-1.2-0.5-1.8-1.2-1.8-2.4 c0-1.2,1-2.2,2.7-2.2 c1.2,0 2,0.5 2.4,1 l-1.8,1.2 C17.3,9.5 17,9.3 16.7,9.3 c-0.4,0-0.8,0.2-0.8,0.7 c0,0.4,0.3,0.7,1,0.9 l0.7,0.2 C18.4,11.5 18.9,12.2 18.9,13.2 z"/>
    </svg>
  )
];

type FloatingIconData = {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    animationStyle: React.CSSProperties;
    scaleStyle: React.CSSProperties;
};

const FloatingIcons = () => {
    const [iconData, setIconData] = useState<FloatingIconData[]>([]);

    useEffect(() => {
        const generatedIcons = Array.from({ length: 15 }).map((_, i) => {
            const Icon = icons[i % icons.length];
            const scale = Math.random() * 0.4 + 0.3; // scale from 0.3 to 0.7
            
            const animationStyle: React.CSSProperties = {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationName: 'float',
                animationDuration: `${Math.random() * 20 + 15}s`, // 15-35s
                animationDelay: `-${Math.random() * 35}s`, // Start at a random point
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
            };
            
            const scaleStyle: React.CSSProperties = {
                transform: `scale(${scale})`
            };
            return { Icon, animationStyle, scaleStyle };
        });
        setIconData(generatedIcons);
    }, []); // Empty dependency array ensures this runs once on mount

    if (!iconData.length) return null; // Render nothing on server and initial client render

    return (
        <>
            {iconData.map(({ Icon, animationStyle, scaleStyle }, i) => (
                 <div key={i} className="absolute text-foreground/10" style={animationStyle}>
                    <div style={scaleStyle}>
                        <Icon className="h-14 w-14" />
                    </div>
                </div>
            ))}
        </>
    );
};


export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
      <div className="relative h-full w-full">
        <FloatingIcons />
        <div
          className="absolute bottom-[-10%] left-[10%] h-[35rem] w-[35rem] bg-primary/10 rounded-full blur-2xl animate-blob"
        />
        <div
          className="absolute top-[-20%] right-[10%] h-[35rem] w-[35rem] bg-accent/10 rounded-full blur-2xl animate-blob-2"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[5%] right-[5%] h-[30rem] w-[30rem] bg-primary/10 rounded-full blur-2xl animate-blob-3"
          style={{ animationDelay: '4s' }}
        />
      </div>
    </div>
  );
}
