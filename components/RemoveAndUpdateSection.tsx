"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteOrUpdateSection } from "@/lib/actions/section.action";
import { Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useKanbanContext } from "@/hooks/use-context";
import { Section } from "@/types";

const RemoveAndUpdateSection = ({ sectionId }: { sectionId: string }) => {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null
  );
  const [response, action] = useActionState(deleteOrUpdateSection, null);

  const { toast } = useToast();

  const kanbanContext = useKanbanContext();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const {
    deleteSection,
    updateSection,
  }: {
    deleteSection: (id: string) => void;
    updateSection: (section: Section) => void;
  } = kanbanContext;

  const RenameButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        name="action"
        value="update"
        variant="default"
        onClick={() => setActionType("update")}
      >
        {pending ? "Updating..." : "Rename"}
      </Button>
    );
  };

  const DeleteButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        name="action"
        value="delete"
        variant="destructive"
        onClick={() => setActionType("delete")}
      >
        {pending ? "Deleting..." : "Delete"}
      </Button>
    );
  };

  useEffect(() => {
    if (response?.success) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      actionType === "delete"
        ? deleteSection(sectionId)
        : updateSection(response.data!);

      toast({
        description: response.message,
      });
      setOpen(false);
    } else if (response?.success === false) {
      toast({
        variant: "destructive",
        description: response.message,
      });
      setOpen(false);
    }
  }, [response]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Ellipsis onClick={() => setOpen(true)} />
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="action" value={actionType ?? ""} />
          <div className="space-y-6">
            <div className="flex space-x-3">
              <Input
                name="title"
                type="text"
                minLength={3}
                placeholder="Rename Section"
                required={actionType === "update"}
              />
              <RenameButton />
            </div>
            <div>
              <DeleteButton />
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default RemoveAndUpdateSection;
