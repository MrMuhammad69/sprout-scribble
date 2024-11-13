import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyName() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 bg-primary text-white min-h-8 px-4 sm:px-6 py-2 sm:py-4 rounded-md shadow-md">
      <div className="flex items-center">
        <AlertCircle size={20} className="text-red-500 mr-2 flex-shrink-0" />
        <span className="text-xs sm:text-sm">
          The website is made for learning purposes. Buying an item will not affect anything.
        </span>
      </div>
      <div className="flex-shrink-0">
        <h1 className="font-bold text-center sm:text-right text-xs sm:text-sm">
          Made by Muhammad Bin Abdul Latif
        </h1>
      </div>
    </div>
  );
}