
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400 mb-4"></div>
      <p className="text-xl font-semibold text-slate-200">{message}</p>
    </div>
  );
};

export default Loader;
