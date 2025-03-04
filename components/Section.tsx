"use client";
import TaskCard from "./TaskCard";
import AddOrUpdateTask from "./AddOrUpdateTask";
import { Section as SectionType, Task } from "@/types";
import RemoveAndUpdateSection from "./RemoveAndUpdateSection";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useKanbanContext } from "@/hooks/use-context";

const Section = ({ section }: { section: SectionType }) => {
  const kanbanContext = useKanbanContext();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const { tasks }: { tasks: Task[] } = kanbanContext;

  const sectionTasks = tasks.filter((task) => task.sectionId === section.id);
  const sectionTaskIds = sectionTasks.map((task) => task.id);
  const { setNodeRef } = useDroppable({
    id: section.id,
    data: { ...section },
  });

  return (
    <div className="flex flex-col gap-5 w-[300px] px-4">
      <div className="flex justify-between">
        <h2 className="font-semibold self-center">{section.title}</h2>
        <div className="flex gap-3 items-center">
          <AddOrUpdateTask type="create" sectionId={section.id} />
          <RemoveAndUpdateSection section={section} />
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-3 p-3 rounded-lg bg-gray-100 "
      >
        <SortableContext items={sectionTaskIds}>
          {sectionTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        <AddOrUpdateTask sectionId={section.id} text="Add task" type="create" />
      </div>
    </div>
  );
};

export default Section;
