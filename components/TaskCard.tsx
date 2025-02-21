"use client";

import Image from "next/image";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Task } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import RemoveOrUpdateTask from "./RemoveOrUpdateTask";
import { isAfter, isToday, isTomorrow, isYesterday } from "date-fns";

const TaskCard = ({ task }: { task: Task }) => {
  const dueDate = new Date(task.dueDate);
  const presentDate = new Date();
  const formattedDate = isToday(dueDate)
    ? "Today"
    : isYesterday(dueDate)
    ? "Yesterday"
    : isTomorrow(dueDate)
    ? "Tomorrow"
    : dueDate.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
      });
  const formattedDateColor = isToday(dueDate)
    ? "text-gray-900"
    : isAfter(presentDate, dueDate)
    ? "text-red-700"
    : "text-blue-800";
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
          <RemoveOrUpdateTask task={task} sectionId={task.sectionId} />
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
