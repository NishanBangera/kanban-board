"use client";

import Image from "next/image";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Task } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import RemoveTask from "./RemoveTask";

const TaskCard = ({ task }: { task: Task }) => {
  const dueDate = new Date(task.dueDate);
  const presentDate = new Date();
  const formattedDate =
    dueDate.getDate() === presentDate.getDate()
      ? "Today"
      : dueDate.getDate() === presentDate.getDate() - 1
      ? "Yesterday"
      : dueDate.getDate() === presentDate.getDate() + 1
      ? "Tomorrow"
      : dueDate.toLocaleString("en-US", {
          day: "numeric",
          month: "short",
        });
  const formattedDateColor =
    dueDate.getDate() === presentDate.getDate()
      ? "text-gray-900"
      : dueDate.getDate() < presentDate.getDate()
      ? "text-red-700"
      : dueDate.getDate() === presentDate.getDate() + 1
      ? "text-blue-800"
      : "text-slate-400";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({ id: task.id, data: { ...task } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div className="p-3">
        <Card
          ref={setNodeRef}
          style={style}
          className="w-[242px] h-[81px] border border-solid border-rose-700"
        />
      </div>
    );
  }

  return (
    <div className="p-3">
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="px-2 py-2"
      >
        <div className="flex justify-between">
          <CardTitle className="text-sm">{task.title}</CardTitle>
          <RemoveTask id={task.id} sectionId={task.sectionId} />
        </div>
        <CardContent className="p-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3 items-center">
              <Image
                className="rounded-full aspect-square object-cover"
                src={task.user.avatar}
                alt="avatar"
                width={25}
                height={25}
              />
              <p className={`text-sm font-semibold ${formattedDateColor}`}>
                {formattedDate}
              </p>
            </div>
            <Badge variant="outline" className="bg-gray-50 border-none">
              <p className="text-slate-400">{task.tag}</p>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;
