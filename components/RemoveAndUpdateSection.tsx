"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { updateSectionDb } from "@/lib/actions/section.action";
import { Check, Ellipsis } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useKanbanContext } from "@/hooks/use-context";
import { Section, Task } from "@/types";
import RemoveTaskOrSection from "./RemoveTaskOrSection";
import { SubmitHandler, useForm } from "react-hook-form";
import { addSectionSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const RemoveAndUpdateSection = ({ section }: { section: Section }) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const kanbanContext = useKanbanContext();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }


  const {
    updateSection,
    sections,
    tasks,
    rollbackState,
  }: {
    updateSection: (title: string, sectionId: string) => void;
    sections: Section[];
    tasks: Task[];
    rollbackState: (data: { sections: Section[]; tasks: Task[] }) => void;
  } = kanbanContext;
  const form = useForm<z.infer<typeof addSectionSchema>>({
    resolver: zodResolver(addSectionSchema),
    defaultValues: { title: section.title },
  });

  const watchField = form.watch("title");

  const onSubmit: SubmitHandler<z.infer<typeof addSectionSchema>> = async (
    values
  ) => {
    const prevState = {
      sections: [...sections],
      tasks: [...tasks],
    };
    const data = {
      sectionId: section.id,
      title: values.title,
    };
    updateSection(data.title, section.id);
    setOpen(false);
    toast({
      description: "Section has been successfully updated",
    });
    form.reset()
    const res = await updateSectionDb(data);
    if (res?.success === false) {
      rollbackState(prevState);
      toast({
        variant: "destructive",
        description: res.message,
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Ellipsis onClick={() => setOpen(true)} />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 space-y-3">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Rename
              </span>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rename Section</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-2">
                <Button
                  variant="default"
                  disabled={
                    watchField.length > 3 && watchField !== section.title
                      ? false
                      : true
                  }
                  className="flex-1"
                  type="submit"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <RemoveTaskOrSection
                  section={section}
                  sectionId={section.id}
                  title="section"
                />
              </div>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default RemoveAndUpdateSection;
