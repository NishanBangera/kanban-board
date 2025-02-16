"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteOrUpdateSection, revalidate } from "@/lib/actions/section.action";
import { Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "@/hooks/use-toast";

const RemoveSection = ({ sectionId }: { sectionId: string }) => {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null
  );
  const [data, action] = useActionState(deleteOrUpdateSection, null);

  const { toast } = useToast();

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
    if (data?.success) {
      toast({
        description: data.message,
      });
      setOpen(false);
      revalidate();
    } else if (data?.success === false) {
      toast({
        variant: "destructive",
        description: data.message,
      });
      setOpen(false);
      revalidate();
    }
  }, [data]);

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

export default RemoveSection;
