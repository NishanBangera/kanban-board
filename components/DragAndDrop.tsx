"use client";
import { useState } from "react";
import Section from "@/components/Section";
import { Section as SectionType, Task } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { useKanbanContext } from "@/hooks/use-context";
import { arrayMove } from "@dnd-kit/sortable";
import { reorderTask } from "@/lib/actions/task.action";

const DragAndDrop = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const kanbanContext = useKanbanContext();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const {
    sections,
    tasks,
    reorderTaskState,
  }: {
    sections: SectionType[];
    tasks: Task[];
    reorderTaskState: (tasks: Task[]) => void;
  } = kanbanContext;

  const onDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task);
  };

  const onDragOver = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeTaskData = active.data.current as Task;
    const overTaskData = over.data.current as Task | SectionType;

    // Dropping a Task over another Task
    if ("sectionId" in activeTaskData && "sectionId" in overTaskData) {
      const activeIndex = tasks.findIndex((t) => t.id === active.id);
      const overIndex = tasks.findIndex((t) => t.id === over.id);

      tasks[activeIndex].sectionId = tasks[overIndex].sectionId;

      const dndSortedList: Task[] = arrayMove(tasks, activeIndex, overIndex);
      reorderTaskState(dndSortedList);
      await reorderTask(activeTaskData, overTaskData, dndSortedList);

      // Dropping a task over another column
    } else if ("tasksOrder" in overTaskData) {
      const activeIndex = tasks.findIndex((t) => t.id === active.id);
      tasks[activeIndex].sectionId = overTaskData.id;
      const dndSortedList: Task[] = arrayMove(tasks, activeIndex, activeIndex);

      await reorderTask(activeTaskData, overTaskData, dndSortedList);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
    >
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragAndDrop;
