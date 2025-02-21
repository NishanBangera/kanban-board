"use client";

import { Trash2 } from "lucide-react";
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
import { deleteTaskAndUpdateTaskOrder } from "@/lib/actions/task.action";

const RemoveTask = ({ id, sectionId }: { id: string; sectionId: string }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const kanbanContext = useKanbanContext();
  const { toast } = useToast();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const {
    deleteTask,
  }: {
    deleteTask: (id: string, data: Section) => void;
  } = kanbanContext;

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await deleteTaskAndUpdateTaskOrder(id, sectionId);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        deleteTask(id, res.data!);
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
        <Trash2 size={18} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            task.
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
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveTask;
