"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import Section from "@/components/Section";
import { Section as SectionType, StructuredSection, Task } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { useKanbanContext } from "@/hooks/use-context";
// import { reorderTask } from "@/lib/actions/task.action";

const DragAndDrop = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { sections } = useKanbanContext() as { sections: SectionType[] }
  const onDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task)
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

  };

  const onDragOver = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    console.log('11111111111',active.data.current )
    console.log('22222222222',over.data.current )
    
    const isOverTask = over.data.current?.type
  

    
    // Dropping a Task over another Task



    // await reorderTask(activeTask,overTask)

  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

 

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} >
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
      {createPortal(
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask}/> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default DragAndDrop;
