import { SVGProps } from 'react';

export const BaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fill="currentColor"
    />
    <path
      d="M6.5 12.5l3-3 3 3 3-3 3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GroqIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 2H4a2 2 0 00-2 2v4a2 2 0 002 2h5a2 2 0 002-2V4a2 2 0 00-2-2zm0 12H4a2 2 0 00-2 2v4a2 2 0 002 2h5a2 2 0 002-2v-4a2 2 0 00-2-2zm10-12h-5a2 2 0 00-2 2v4a2 2 0 002 2h5a2 2 0 002-2V4a2 2 0 00-2-2zm0 12h-5a2 2 0 00-2 2v4a2 2 0 002 2h5a2 2 0 002-2v-4a2 2 0 00-2-2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const ScreenpipeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M8 21h8m-4-4v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 7h2v2H6V7zm5 0h2v2h-2V7zm5 0h2v2h-2V7zm-10 4h2v2H6v-2zm5 0h2v2h-2v-2zm5 0h2v2h-2v-2z"
      fill="currentColor"
    />
  </svg>
);
