/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { defaultAddTask } from "@/lib/constants";
import { z } from "zod";
import { addFormTaskSchema } from "@/lib/validators";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTask, updateTaskDb } from "@/lib/actions/task.action";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useKanbanContext } from "@/hooks/use-context";
import { Section, Task, User } from "@/types";

const AddOrUpdateTask = ({
  sectionId,
  text,
  task,
  type,
  handleOpen,
}: {
  sectionId: string;
  text?: string;
  task?: Task;
  type: "create" | "update";
  handleOpen?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const kanbanContext = useKanbanContext();
  if (!kanbanContext) {
    throw new Error("Kanban context is null");
  }
  const {
    addNewTask,
    updateTask,
    tempAddNewTask,
    sections,
    tasks,
    users,
    rollbackState,
  }: {
    addNewTask: (data: { task: Task; tasksOrder: string[] }) => void;
    updateTask: (task: Task) => void;
    tempAddNewTask: (task: Task) => void;
    sections: Section[];
    tasks: Task[];
    users: User[];
    rollbackState: (data: { sections: Section[]; tasks: Task[] }) => void;
  } = kanbanContext;
  const { toast } = useToast();

  function formattedDate(date: Date) {
    return `${date.getFullYear()}-${
      date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)
    }-${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}`;
  }

  const form = useForm<z.infer<typeof addFormTaskSchema>>({
    resolver: zodResolver(addFormTaskSchema),
    defaultValues:
      task && type === "update"
        ? {
            title: task.title,
            tag: task.tag,
            user: String(task.user.id),
            dueDate: formattedDate(new Date(task.dueDate)),
          }
        : defaultAddTask,
  });

  // Submit form handlerr
  const onSubmit: SubmitHandler<z.infer<typeof addFormTaskSchema>> = async (
    values
  ) => {
    const user = users.find((user) => user.id === Number(values.user))!;

    const data = {
      title: values.title,
      tag: values.tag,
      dueDate: new Date(values.dueDate),
      user,
      sectionId,
    };

    const tempCreateTaskId = crypto.randomUUID();
    const prevState = {
      sections: [...sections],
      tasks: [...tasks]
    };
    if (type === "create") {
      tempAddNewTask({
        ...data,
        id: tempCreateTaskId,
        createdAt: new Date(),
      });
      toast({
        description: `${data.title} task has been successfully created`,
      });
    } else {
      updateTask({ ...data, id:task?.id } as Task);
      toast({
        description: `Task has been successfully updated`,
      });
    }
    setOpen(false);
    form.reset();
       // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    handleOpen && handleOpen();

    const res =
      type === "update" && task
        ? await updateTaskDb(data, task.id)
        : await addTask(data);

    if (!res.success) {
      rollbackState(prevState);
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }
    if (res.data && type === "create") {
      addNewTask(
        res.data as {
          task: Task;
          tasksOrder: string[];
          tempCreateTaskId: string;
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "update" ? (
          <Button>Update</Button>
        ) : (
          <Button variant="link" className="hover:no-underline">
            <Plus
              className={`w-4 h-4 cursor-pointer ${
                text ? "text-slate-400" : ""
              }`}
              onClick={() => setOpen(true)}
            />
            {text && <p className="text-slate-400">{text}</p>}
          </Button>
        )}
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
                        min={formattedDate(new Date())}
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

export default AddOrUpdateTask;
