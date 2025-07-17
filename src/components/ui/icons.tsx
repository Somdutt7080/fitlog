// components/ui/icons.tsx
import type { SVGProps } from "react"

export const Icons = {
  google: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_google)">
        <path
          d="M23.488 12.261c0-.815-.073-1.6-.21-2.352H12.25v4.448h6.334a5.29 5.29 0 01-2.296 3.471v2.886h3.717c2.174-2.002 3.427-4.95 3.427-8.453z"
          fill="#4285F4"
        />
        <path
          d="M12.25 23.5c3.105 0 5.708-1.03 7.61-2.786l-3.716-2.886c-1.024.69-2.334 1.097-3.894 1.097-2.993 0-5.522-2.008-6.425-4.741H2.153v2.98A11.25 11.25 0 0012.25 23.5z"
          fill="#34A853"
        />
        <path
          d="M5.825 14.115a6.826 6.826 0 010-4.377V6.758H2.153a11.25 11.25 0 000 10.104l3.672-2.847z"
          fill="#FBBC05"
        />
        <path
          d="M12.25 5.074c1.688 0 3.204.58 4.396 1.708l3.287-3.287C17.953 2.189 15.292 1 12.25 1A11.25 11.25 0 002.153 6.758l3.672 2.847c.897-2.715 3.426-4.723 6.425-4.723z"
          fill="#EA4335"
        />
      </g>
      <defs>
        <clipPath id="clip0_google">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  // Add other custom icons here
}