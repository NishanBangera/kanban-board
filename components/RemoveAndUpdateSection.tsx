"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateSectionDb } from "@/lib/actions/section.action";
import { Check, Ellipsis, Loader } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useKanbanContext } from "@/hooks/use-context";
import { Section } from "@/types";
import RemoveItem from "./RemoveTaskOrSection";

const RemoveAndUpdateSection = ({ sectionId }: { sectionId: string }) => {
  const [open, setOpen] = useState(false);
  const [rename, setRename] = useState("");

  const [response, action] = useActionState(updateSectionDb, null);

  const { pending } = useFormStatus();

  const { toast } = useToast();

  const kanbanContext = useKanbanContext();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const {
    updateSection,
  }: {
    updateSection: (section: Section) => void;
  } = kanbanContext;

  useEffect(() => {
    if (response?.success) {
      updateSection(response.data!);

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
      <PopoverContent className="w-64 p-4 space-y-3">
        <form action={action}>
          <input type="hidden" name="sectionId" value={sectionId} />
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Rename
            </span>
            <Input
              placeholder="Rename Section"
              name="title"
              value={rename}
              onChange={(e) => setRename(e.target.value)}
            />
            <div className="flex justify-between gap-2">
              <Button
                variant="default"
                disabled={rename.length > 3 ? false : true}
                className="flex-1"
                type="submit"
              >
                {pending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}{" "}
                Save
              </Button>
              <RemoveItem sectionId={sectionId} title="section" />
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default RemoveAndUpdateSection;
