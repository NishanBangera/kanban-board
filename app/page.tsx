export const dynamic = "force-dynamic";
import AddSection from "@/components/AddSection";
import DragAndDrop from "@/components/DragAndDrop";
import KanbanProvider from "@/context/KanbanProvider";

export default function Home() {
  return (
    <div className="w-full overflow-x-auto h-[87%] p-4">
      <div className="min-w-max flex justify-center h-full">
        <KanbanProvider>
        <DragAndDrop />
        <div className="flex space-x-4 py-2 max-h-max">
          <AddSection />
          <p className="text-slate-300 max-h-max">Add section</p>
        </div>
        </KanbanProvider>
      </div>
    </div>
  );
}
