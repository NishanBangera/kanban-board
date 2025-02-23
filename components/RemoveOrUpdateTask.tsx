"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Ellipsis } from "lucide-react";
import { Task } from "@/types";
import RemoveTaskOrSection from "./RemoveTaskOrSection";
import AddOrUpdateTask from "./AddOrUpdateTask";

const RemoveOrUpdateTask = ({
  task,
  sectionId,
}: {
  task: Task;
  sectionId: string;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(false)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Ellipsis onClick={() => setOpen(true)} />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 space-y-3">
        <h2 className="text-center font-semibold">Remove or Update Task</h2>
        <div className="flex justify-between gap-2">
          <AddOrUpdateTask task={task} sectionId={sectionId} type="update" handleOpen={handleOpen}  />
          <RemoveTaskOrSection
            task={task}
            sectionId={sectionId}
            title="task"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RemoveOrUpdateTask;
