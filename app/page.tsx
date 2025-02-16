import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import sampleData from "@/db/sample-data";
import { Plus } from "lucide-react";
import { Fragment } from "react";

export default function Home() {
  return (
    <div className="w-full overflow-x-auto h-screen p-4">
      <div className="min-w-max flex justify-center space-x-4 h-full">
        {sampleData.sections.map((section, index, arr) =>
          index === arr.length - 1 ? (
            <Fragment key={section.id}>
              <Section section={section} />
              <div className="flex space-x-4 max-h-max">
                <Button type="button" variant="link" className="p-0 h-6 ">
                  <Plus className="w-4 h-4 text-slate-300" />
                </Button>
                <p className="text-slate-300 max-h-max">Add section</p>
              </div>
            </Fragment>
          ) : (
            <Section key={section.id} section={section} />
          )
        )}
      </div>
    </div>
  );
}
