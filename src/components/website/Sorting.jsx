import React from "react";
import{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortings } from "@/lib/utils";
import { Button } from "../ui/button";
import { IoFilter } from "react-icons/io5";


const Sorting = ({
  limit,
  setLimit,
  sorting,
  setSorting,
  moblieFilterOpen,
  setMoblieFilterOpen,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2 p-4 bg-gray-50 ">
       <Button type="button" className="lg:hidden" variant="outline" onClick={() => setMoblieFilterOpen(!moblieFilterOpen)}>
        <IoFilter size={25} />
        Filter
       </Button>
      <ul className="flex items-center gap-3">
        <li className="font-semibold">Show</li>
        {[9, 12, 18, 24].map((limitNumber) => (
          <li key={limitNumber}>
            <button
              type="button"
              onClick={()=> setLimit(limitNumber)}
              className={`${
                limitNumber === limit
                  ? " w-8 h-8 flex justify-center items-center rounded-full bg-primary text-white text-sm"
                  : ""
              }`}
            >
              {limitNumber}
            </button>
          </li>
        ))}
      </ul>
      <Select value={sorting} onValueChange={(value) => setSorting(value)}>
        <SelectTrigger className="md:w-[180px] w-full bg-white" >
          <SelectValue placeholder="Default Sorting" />
        </SelectTrigger>
        <SelectContent>
          {sortings.map(option=>(
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
       
    </div>
  );
};

export default Sorting;
// 3:04