import Image from "next/image";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Task } from "@/types";

const TaskCard = ({task}:{task: Task}) => {
    return ( <div className="p-3">
        <Card className="px-2 py-2">
            <CardTitle className="text-sm">
                {task.title}
            </CardTitle>
            <CardContent className="p-2">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-3 items-center">
                        <Image className="rounded-full aspect-square object-cover" src={task.user.image} alt="avatar" width={25} height={25} />
                        <p className="text-sm">{task.dueDate}</p>
                    </div>
                    <Badge variant="outline" className="bg-gray-50 border-none"><p className="text-slate-400">{task.tag}</p></Badge>
                </div>
            </CardContent>
        </Card>
    </div> );
}
 
export default TaskCard;