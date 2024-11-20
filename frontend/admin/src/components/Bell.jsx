import React from 'react';
import { BellIcon } from '@heroicons/react/20/solid';

const Bell = () => {
  return (
    <div className="relative">
      <BellIcon className="h-8 w-8 text-yellow-500 absolute animate-shake" />
      {/* <span className="absolute top-0 right-0 -me-6 mt-1 transform translate-x-1/4 -translate-y-1/4 h-2 w-2 bg-red-500 rounded-full"></span> */}
    </div>
  );
};

export default Bell;
