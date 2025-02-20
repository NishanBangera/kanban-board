"use client";
import { SubmitHandler, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { users } from "@/context/KanbanProvider";
import { defaultAddTask } from "@/lib/constants";
import { z } from "zod";
import { addFormTaskSchema } from "@/lib/validators";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTask } from "@/lib/actions/task.action";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useKanbanContext } from "@/hooks/use-context";
import { Task } from "@/types";

const AddTask = ({ sectionId }: { sectionId: string }) => {
  const [open, setOpen] = useState(false);

  const { addNewTask } = useKanbanContext() as {
    addNewTask: (data: { task: Task; tasksOrder: string[] }) => void;
  };

  const { toast } = useToast();

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)
  }-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}`;

  const form = useForm({
    resolver: zodResolver(addFormTaskSchema),
    defaultValues: defaultAddTask,
  });

  // Submit form handlerr
  const onSubmit: SubmitHandler<z.infer<typeof addFormTaskSchema>> = async (
    values
  ) => {
    const user = users.find((user) => user.id === Number(values.user))!;

    const data = {
      ...values,
      dueDate: new Date(values.dueDate),
      user,
      sectionId,
    };

    const res = await addTask(data);
    if (!res.success) {
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }
    if (res.data) {
      addNewTask(res.data as { task: Task; tasksOrder: string[] });
    }
    setOpen(false);
    form.reset();
    toast({
      description: res.message,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Plus
          className="w-4 h-4 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add a Task</DialogTitle>
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
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tag..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Select Due Date"
                        min={formattedDate}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Users</SelectLabel>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={`${user.id}`}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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

export default AddTask;
