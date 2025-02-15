import { Minus, Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { Button } from "./ui/button";
import { Section as SectionType, Task } from "@/types";

const Section = ({ section }: { section: SectionType }) => {
  return (
    <div className="flex flex-col gap-5 w-[300px] px-4">
      <div className="flex justify-between">
        <h2 className="font-semibold self-center">{section.name}</h2>
        <div className="flex gap-3 items-center">
          <Button type="button" variant="link" className="p-0 h-5 ">
            <Plus className="w-4 h-4" />
          </Button>
          <Button type="button" variant="link" className="p-0 h-5">
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 rounded-lg bg-gray-200 ">
        {section.tasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Section;
