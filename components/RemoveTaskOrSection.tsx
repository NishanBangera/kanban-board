"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { useKanbanContext } from "@/hooks/use-context";
import { Section, Task } from "@/types";
import { deleteTaskDb } from "@/lib/actions/task.action";
import { deleteSectionDb } from "@/lib/actions/section.action";

const RemoveTaskOrSection = ({
  task,
  section,
  sectionId,
  title,
}: {
  task?: Task;
  section?: Section;
  sectionId: string;
  title: "task" | "section";
}) => {
  const [open, setOpen] = useState(false);
  const kanbanContext = useKanbanContext();
  const { toast } = useToast();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const {
    deleteTask,
    deleteSection,
    sections,
    tasks,
    rollbackState,
  }: {
    deleteTask: (task: Task) => void;
    deleteSection: (id: string) => void;
    sections: Section[];
    tasks: Task[];
    rollbackState: (data: { sections: Section[]; tasks: Task[] }) => void;
  } = kanbanContext;

  const handleDeleteClick = async () => {
    const prevState = {
      sections: [...sections],
      tasks: [...tasks]
    };
    if (title === "task" && task) {
      deleteTask(task);
      setOpen(false);
      toast({
        description: `${task.title} task has been deleted successfully`,
      });
    } else if (title === "section" && section) {
      deleteSection(section.id);
      setOpen(false);
      toast({
        description: `${section.title} section has been deleted successfully`,
      });
    }
    const res =
      title === "task" && task
        ? await deleteTaskDb(task.id, sectionId)
        : await deleteSectionDb(sectionId);

    if (!res.success) {
      rollbackState(prevState);

      toast({
        variant: "destructive",
        description: res.message,
      });
    } 
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex-1" type="button">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveTaskOrSection;
