import { StreamManager } from "openvidu-browser";
import clsx from "clsx";
import OpenviduStream from "@/src/components/openvidu/OpenviduStream";

interface OpenviduStreamListProps {
  streamManagers: StreamManager[];
}

export default function OpenviduStreamList({ streamManagers }: OpenviduStreamListProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {streamManagers.map((streamManager, index) => (
        <div
          key={streamManager.stream.streamId}
          className={clsx("w-full aspect-video bg-gray-200 rounded-2xl shadow-md", {
            "col-span-3": index === 0,
          })}
        >
          <OpenviduStream streamManager={streamManager} />
        </div>
      ))}
    </div>
  );
}