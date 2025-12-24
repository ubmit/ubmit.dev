import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  className?: string;
};

export function RunningIcon({ className, ...rest }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      className={className}
      {...rest}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M12 4a1 1 0 1 0 2 0 1 1 0 1 0-2 0M4 17l5 1 .75-1.5M15 21v-4l-4-3 1-6" />
      <path d="M7 12V9l5-1 3 3 3 1" />
    </svg>
  );
}
