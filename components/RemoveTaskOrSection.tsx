"use client";

import { Loader, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
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
import { Section } from "@/types";
import { deleteTaskDb } from "@/lib/actions/task.action";
import { deleteSectionDb } from "@/lib/actions/section.action";

const RemoveTaskOrSection = ({
  taskId,
  sectionId,
  title,
}: {
  taskId?: string;
  sectionId: string;
  title: "task" | "section";
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const kanbanContext = useKanbanContext();
  const { toast } = useToast();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const {
    deleteTask,
    deleteSection,
  }: {
    deleteTask: (id: string, data: Section) => void;
    deleteSection: (id: string) => void;
  } = kanbanContext;

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res =
        title === "section"
          ? await deleteSectionDb(sectionId)
          : await deleteTaskDb(taskId!, sectionId);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        title === "section"
          ? deleteSection(sectionId)
          : deleteTask(taskId!, res.data!);
        setOpen(false);
        toast({
          description: res.message,
        });
      }
    });
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
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDeleteClick}
          >
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}{" "}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveTaskOrSection;
