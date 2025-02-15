import Section from "@/components/Section";
import sampleData from "@/db/sample-data";

export default function Home() {
  return (
    <div className="w-full overflow-x-auto h-screen p-4">
      <div className="min-w-max flex justify-center space-x-4 h-full">
        {sampleData.sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
