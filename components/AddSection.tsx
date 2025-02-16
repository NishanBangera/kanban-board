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

const AddSection = () => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(addSectionSchema),
    defaultValues: defaultAddSection,
  });

  // Submit form handler
  const onSubmit: SubmitHandler<z.infer<typeof addSectionSchema>> = async (
    values
  ) => {
    const res = await addSection(values);

    if (!res.success) {
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }

    toast({
      description: res.message,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Plus className="w-4 h-4 mt-1 cursor-pointer" />
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
