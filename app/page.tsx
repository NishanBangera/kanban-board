export const dynamic = "force-dynamic";
import AddSection from "@/components/AddSection";
import DragAndDrop from "@/components/DragAndDrop";

export default async function Home() {

  return (
    <div className="w-full overflow-x-auto h-[87%] p-4">
      <div className="min-w-max flex justify-center space-x-4 h-full">
        <DragAndDrop  />
        <div className="flex space-x-4 max-h-max">
          <AddSection />
          <p className="text-slate-300 max-h-max">Add section</p>
        </div>
      </div>
    </div>
  );
}
