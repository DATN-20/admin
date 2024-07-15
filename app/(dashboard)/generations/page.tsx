import GenerationsTable from "@/components/GenerationsTable";
import Sidebar from "@/components/Sidebar";
const Generations = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex-grow w-5/6">
        <GenerationsTable />
      </div>
    </div>
  );
};

export default Generations;
