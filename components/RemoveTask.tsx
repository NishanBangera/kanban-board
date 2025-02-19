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
import { Task } from "@/types";
import { deleteTask } from "@/lib/actions/task.action";

const RemoveTask = ({
  id,
}: {
  id: string;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {deleteAndUpdateTaskPosition} = useKanbanContext() as {deleteAndUpdateTaskPosition: (id: string, data: undefined | Task[]) => void;}
  const { toast } = useToast();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await deleteTask(id);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        deleteAndUpdateTaskPosition(id, res.data)
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
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
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
