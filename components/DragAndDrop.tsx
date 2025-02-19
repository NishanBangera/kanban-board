"use client";
import { createPortal } from "react-dom";
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
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { reorderTask } from "@/lib/actions/task.action";

// import { reorderTask } from "@/lib/actions/task.action";

const DragAndDrop = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { sections, tasks, reorderTaskState } = useKanbanContext() as {
    sections: SectionType[];
    tasks: Task[];
    reorderTaskState: (tasks: Task[]) => void;
  };

  const sectionIds = sections.map(section => section.id)
  const onDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task);
  };

  const onDragEnd = (event: DragEndEvent) => {
    // const { active, over } = event;
    setActiveTask(null)

  };

  const onDragOver = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    console.log("11111111111", active.data.current);
    console.log("22222222222", over.data.current);

    const activeTaskData = active.data.current as Task;
    const overTaskData = over.data.current as Task | SectionType;

    // Dropping a Task over another Task
    if ("sectionId" in activeTaskData && "sectionId" in overTaskData) {
      // await reorderTask(activeTask,overTask)
      const activeIndex = tasks.findIndex((t) => t.id === active.id);
      const overIndex = tasks.findIndex((t) => t.id === over.id);
      // console.log("11111111", tasks[activeIndex].sectionId);
      // console.log("22222222", tasks[overIndex].sectionId);

      tasks[activeIndex].sectionId = tasks[overIndex].sectionId;
      // console.log("33333333", tasks[activeIndex].sectionId);
      // console.log("44444444", tasks[activeIndex].sectionId);
      const dndSortedList: Task[] = arrayMove(tasks, activeIndex, overIndex);
      reorderTaskState(dndSortedList);
      await reorderTask(activeTaskData, overTaskData, dndSortedList);
      console.log("misssssssss", dndSortedList)

      // const sortedPosition = reorderTask(dndSortedList)
    } else if ("tasksOrder" in overTaskData) {
      const activeIndex = tasks.findIndex((t) => t.id === active.id);
      tasks[activeIndex].sectionId = overTaskData.id;
      const dndSortedList: Task[] = arrayMove(tasks, activeIndex, activeIndex);
      console.log('kyrrrrrrrrrrrrrrrr', tasks)

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
      onDragEnd={onDragEnd}
    >
      <SortableContext items={sectionIds}>
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default DragAndDrop;
