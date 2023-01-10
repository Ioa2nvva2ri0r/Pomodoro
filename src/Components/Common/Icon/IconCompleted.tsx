import React from 'react';

const IconCompleted: React.FC = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeDasharray="100"
    >
      <path d="M 12,22 L 22,31 L 36,13" strokeDashoffset="0">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" />
      </path>
    </svg>
  );
};

export default IconCompleted;
