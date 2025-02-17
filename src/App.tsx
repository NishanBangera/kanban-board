import { Plus } from "lucide-react";
import DragAndDrop from "./components/DragAndDrop";

const App = () => {
  const sampleData = {
    sections: [
      {
        id: "1",
        title: "To do",
        createdAt: new Date(),
        tasks: [
          {
            id: "3",
            title: "Modifying cart layout",
            tag: "Design",
            sectionId: "1",
            updatedAt: new Date(),
            createdAt: new Date(),
            dueDate: String(
              new Date("2025-02-15")
            ),
            user: {
              id: 1,
              avatar: "/assets/avatar/avatar3",
              name: "Harry",
            },
          },
          {
            id: "1",
            title: "Add Chart",
            tag: "Programming",
            sectionId: "1",
            updatedAt: new Date(),
            createdAt: new Date(),
            dueDate: String(
              new Date("2025-02-18")
            ),
            user: {
              id: 1,
              avatar: "/assets/avatar/avatar1",
              name: "Harry",
            },
          },
        ],
      },
      {
        id: "2",
        title: "In Progress",
        createdAt: new Date(),
        tasks: [
          {
            id: "4",
            title: "Debug landing page",
            tag: "Testing",
            sectionId: "2",
            updatedAt: new Date(),
            createdAt: new Date(),
            dueDate: String(
              new Date("2025-02-15")
            ),
            user: {
              id: 3,
              avatar: "/assets/avatar/avatar4",
              name: "Rhanerya",
            },
          },
        ],
      },
      {
        id: "3",
        title: "Review",
        createdAt: new Date(),
        tasks: [
          {
            id: "2",
            title: "Fixing Bugs",
            tag: "Programming",
            sectionId: "3",
            updatedAt: new Date(),
            createdAt: new Date(),
            dueDate: String(
              new Date("2025-02-17")
            ),
            user: {
              id: 2,
              avatar: "/assets/avatar/avatar2",
              name: "Hermonie",
            },
          },
          {
            id: "4",
            title: "Debug landing page",
            tag: "Testing",
            sectionId: "3",
            updatedAt: new Date(),
            createdAt: new Date(),
            dueDate: String(
              new Date("2025-02-15")
            ),
            user: {
              id: 3,
              avatar: "/assets/avatar/avatar4",
              name: "Rhanerya",
            },
          },
        ],
      },
    ],
  };
  return (
    <div className="w-full overflow-x-auto h-screen p-4">
      <div className="min-w-max flex justify-center space-x-4 h-full">
        <DragAndDrop sections={sampleData.sections} />
        <div className="flex space-x-4 max-h-max">
          <Plus />
          <p className="text-slate-300 max-h-max">Add section</p>
        </div>
      </div>
    </div>
  );
};

export default App;
