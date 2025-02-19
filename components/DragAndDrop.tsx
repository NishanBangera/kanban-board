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
import { arrayMove } from "@dnd-kit/sortable";
import { reorderTask } from "@/lib/utils";
// import { reorderTask } from "@/lib/actions/task.action";

const DragAndDrop = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { sections } = useKanbanContext() as { sections: SectionType[] }

  const {tasks} = useKanbanContext() as {tasks: Task[]}
  const onDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current as Task)
  };

  // const onDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   setActiveTask(null)


  // };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    console.log('11111111111',active.data.current )
    console.log('22222222222',over.data.current )
    
    const activeTask = active.data.current
    const overTask = over.data.current
    
  

    
    // Dropping a Task over another Task
    if(activeTask?.type==="task" && overTask?.type === "task"){
      // await reorderTask(activeTask,overTask)
      const activeIndex = tasks.findIndex((t) => t.id === active.id)
      const overIndex = tasks.findIndex((t) => t.id === over.id)
      const dndSortedList:Task[] = arrayMove(tasks, activeIndex, overIndex)
      console.log("lkkkkkkkkkkkk",dndSortedList )
      const sortedPosition = reorderTask(dndSortedList)
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
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} >
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
