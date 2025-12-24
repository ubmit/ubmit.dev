import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  className?: string;
};

export function SwimmingIcon({ className, ...rest }: Props) {
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
      <path d="M15 9a1 1 0 1 0 2 0 1 1 0 1 0-2 0M6 11l4-2 3.5 3-1.5 2M3 16.75A2.4 2.4 0 0 0 4 17a2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 1-.25" />
    </svg>
  );
}
