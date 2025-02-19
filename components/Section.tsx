import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
import { Section as SectionType, Task } from "@/types";
import RemoveAndUpdateSection from "./RemoveAndUpdateSection";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useKanbanContext } from "@/hooks/use-context";

const Section = ({ section }: { section: SectionType }) => {
  const {tasks} = useKanbanContext() as {tasks: Task[]}
  const sectionTasks = tasks.filter(task => task.sectionId === section.id)
  const sectionTaskIds = sectionTasks.map((task) => task.id);
  // const { setNodeRef } = useDroppable({
  //   id: section.id,
  //   data: {...section}
  // });
  const { setNodeRef, transform, transition } = useSortable({
    id: section.id,
    data: {...section}
  });
  const style = {
      transition,
      transform: CSS.Transform.toString(transform)
    };


  return (
    <div className="flex flex-col gap-5 w-[300px] px-4">
      <div className="flex justify-between">
        <h2 className="font-semibold self-center">{section.title}</h2>
        <div className="flex gap-3 items-center">
          <AddTask sectionId={section.id} />
          <RemoveAndUpdateSection sectionId={section.id} />
        </div>
      </div>

      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-1 flex-col gap-4 rounded-lg bg-gray-200 "
      >
        <SortableContext items={sectionTaskIds}>
          {sectionTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Section;
