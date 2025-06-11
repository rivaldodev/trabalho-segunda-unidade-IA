
// This is a workaround for using HeroIcons without installing @types/heroicons
// In a real project, consider installing types or using a library that exports them.
declare module '@heroicons/react/24/solid' {
  import React from 'react';
  export const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  // Add other icons as needed
}

declare module '@heroicons/react/24/outline' {
  // Add outline icons if used
}
