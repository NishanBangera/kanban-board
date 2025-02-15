export type User = {
    id: string;
    image: string;
    name: string;
    // email: string;
    // password:
}

export type Task = {
    id: string;
    title: string;
    tag: string;
    dueDate: string;
    user: User;
}

export type Section = {
    id: string;
    name: string;
    tasks: Task[]
}