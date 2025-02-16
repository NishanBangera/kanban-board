import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
import { StructuredSection, Task } from "@/types";
import RemoveSection from "./RemoveSection";

const Section = ({ section }: { section: StructuredSection }) => {
  return (
    <div className="flex flex-col gap-5 w-[300px] px-4">
      <div className="flex justify-between">
        <h2 className="font-semibold self-center">{section.title}</h2>
        <div className="flex gap-3 items-center">
          <AddTask sectionId={section.id} />
          <RemoveSection sectionId={section.id} />
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
