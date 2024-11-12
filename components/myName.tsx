import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MyName() {
    return (
        <div className="flex justify-between items-center bg-primary text-white min-h-8 px-6 py-4 rounded-md shadow-md">
            <div className="flex items-center">
                <AlertCircle size={24} className="text-red-500 mr-2" />
                <span className="text-sm">The website is made for learning purposes. Buying an item will not affect anything.</span>
            </div>
            <div>
                <h1 className="font-bold text-right text-sm md:text-base">Made by Muhammad Bin Abdul Latif</h1>
            </div>
        </div>
    )
}
