"use client;"
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
    return (
        <div className="border rounded-md border-gray-200 flex items-center gap-2 sm:w-1/2 lg:w-full">
            <div className="pl-3">
                <SearchIcon className="text-gray-400" />
            </div>
            <input
                type="text"
                className="p-[5px] text-md rounded-md"
                placeholder="Search"
            />
        </div>
    );
};

export default Search;