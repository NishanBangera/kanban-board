"use client";
import { useState } from "react";
import Section from "@/components/Section";
import { Section as SectionType, Task } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
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
import { useToast } from "@/hooks/use-toast";

const DragAndDrop = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [prevState, setPrevState] = useState<Task[] | null>(null);

  const { toast } = useToast();

  const kanbanContext = useKanbanContext();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const {
    sections,
    tasks,
    reorderTaskState,
    rollbackState,
  }: {
    sections: SectionType[];
    tasks: Task[];
    reorderTaskState: (tasks: Task[]) => void;
    rollbackState: (data: { tasks: Task[] }) => void;
  } = kanbanContext;

  const onDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task);
    setPrevState(tasks);
  };
  const onDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeTaskData = active.data.current as Task;
    const overTaskData = over.data.current as Task | SectionType;

    // Dropping a Task over another Task
    if ("sectionId" in activeTaskData && "sectionId" in overTaskData) {
      const activeIndex = tasks.findIndex((t) => t.id === active.id);
      const overIndex = tasks.findIndex((t) => t.id === over.id);
      const deepCopy = JSON.parse(JSON.stringify(tasks));

      deepCopy[activeIndex].sectionId = deepCopy[overIndex].sectionId;
      const dndSortedList: Task[] = arrayMove(deepCopy, activeIndex, overIndex);
      setTimeout(() => reorderTaskState(dndSortedList), 0);
    }
    // Dropping a task over another column
    else if ("tasksOrder" in overTaskData) {
      const activeIndex = tasks.findIndex((t) => t.id === active.id);

      tasks[activeIndex].sectionId = overTaskData.id;
      const dndSortedList: Task[] = arrayMove(tasks, activeIndex, activeIndex);
      reorderTaskState(dndSortedList);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { over } = event;

    if (!over || !activeTask || !prevState) return;

    // Fetch dropped index location
    const hoveredItemIndex = tasks.findIndex(
      (task) => task.id === activeTask.id
    );

    // Based on dropped position, fetch the item
    let hoveredItem: Task | SectionType;
    if (hoveredItemIndex === -1) {
      hoveredItem = over.data.current as SectionType;
    } else {
      hoveredItem = prevState[hoveredItemIndex];
    }

    const res = await reorderTask(activeTask!, hoveredItem, tasks);
    if (!res.success) {
      rollbackState({ tasks: prevState });
      toast({
        variant: "destructive",
        description: res.message,
      });
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
      onDragEnd={onDragEnd}
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
