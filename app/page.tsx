import AddSection from "@/components/AddSection";
import Section from "@/components/Section";
import { getAllSections } from "@/lib/actions/section.action";
import { Fragment } from "react";

export default async function Home() {
  const sections = await getAllSections();
  return (
    <div className="w-full overflow-x-auto h-screen p-4">
      <div className="min-w-max flex justify-center space-x-4 h-full">
        {sections.map((section, index, arr) =>
          index === arr.length - 1 ? (
            <Fragment key={section.id}>
              <Section section={section} />
              <div className="flex space-x-4 max-h-max">
                <AddSection />
                <p className="text-slate-300 max-h-max">Add section</p>
              </div>
            </Fragment>
          ) : (
            <Section key={section.id} section={section} />
          )
        )}
        {sections.length === 0 && (
          <div className="flex space-x-4 max-h-max">
            <AddSection />
            <p className="text-slate-300 max-h-max">Add section</p>
          </div>
        )}
      </div>
    </div>
  );
}
