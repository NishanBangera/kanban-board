import { StructuredSection } from "@/types";
import { DndContext } from "@dnd-kit/core";
import Section from "./Section";

const DragAndDrop = ({ sections }: { sections: StructuredSection[] }) => {
  return (
    <DndContext>
      {sections.map((section: StructuredSection) => (
        <Section key={section.id} section={section} />
      ))}
    </DndContext>
  );
};

export default DragAndDrop;
