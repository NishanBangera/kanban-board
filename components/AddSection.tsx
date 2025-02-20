"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { defaultAddSection } from "@/lib/constants";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSectionSchema } from "@/lib/validators";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { addSection } from "@/lib/actions/section.action";
import { useState } from "react";
import { useKanbanContext } from "@/hooks/use-context";
import { Section } from "@/types";

const AddSection = () => {
  const { toast } = useToast();

  const kanbanContext = useKanbanContext();

  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }

  const { addNewSection }: { addNewSection: (section: Section) => void } =
    kanbanContext;
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(addSectionSchema),
    defaultValues: defaultAddSection,
  });

  // Submit form handler
  const onSubmit: SubmitHandler<z.infer<typeof addSectionSchema>> = async (
    values
  ) => {
    const res = await addSection(values);
    setOpen(false);
    form.reset();
    if (res.success) {
      addNewSection(res.data!);
      return toast({
        description: res.message,
      });
    } else {
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Plus
          className="w-4 h-4 mt-1 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add a New Section</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSection;
