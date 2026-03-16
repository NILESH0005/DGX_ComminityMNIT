import React from "react";

const ns = "http://www.w3.org/2000/svg";

export const Tree = ({ x, y, size = 1, color = "#51CF66" }) => (
  <g transform={`translate(${x},${y}) scale(${size})`}>
    <ellipse cx="0" cy="-20" rx="14" ry="17" fill={color} opacity="0.9" />
    <ellipse cx="-5" cy="-12" rx="11" ry="13" fill={color} opacity="0.65" />
    <rect x="-3" y="0" width="6" height="13" rx="2" fill="#8B5E3C" />
  </g>
);

export const Bush = ({ x, y, color = "#87E08A" }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse cx="0" cy="0" rx="13" ry="9" fill={color} opacity="0.8" />
    <ellipse cx="-8" cy="4" rx="9" ry="7" fill={color} opacity="0.6" />
    <ellipse cx="8" cy="4" rx="9" ry="7" fill={color} opacity="0.6" />
  </g>
);

export const Cloud = ({ x, y, opacity = 0.18 }) => (
  <g transform={`translate(${x},${y})`} opacity={opacity}>
    <ellipse cx="0" cy="0" rx="24" ry="13" fill="#AED6F1" />
    <ellipse cx="-15" cy="6" rx="16" ry="10" fill="#AED6F1" />
    <ellipse cx="15" cy="6" rx="16" ry="10" fill="#AED6F1" />
  </g>
);

export const StarShape = ({ x, y, color }) => (
  <polygon
    points="0,-7 1.6,-2.5 6.5,-2.5 2.8,1.2 4,6.5 0,3.5 -4,6.5 -2.8,1.2 -6.5,-2.5 -1.6,-2.5"
    fill={color}
    transform={`translate(${x},${y})`}
    opacity="0.65"
  />
);
