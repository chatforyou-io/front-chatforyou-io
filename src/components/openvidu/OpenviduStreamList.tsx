import { StreamManager } from "openVidu-browser";
import clsx from "clsx";
import OpenViduStream from "@/src/components/openVidu/OpenViduStream";

interface OpenViduStreamListProps {
  streamManagers: StreamManager[];
}

export default function OpenViduStreamList({ streamManagers }: OpenViduStreamListProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {streamManagers.map((streamManager, index) => (
        <div
          key={streamManager.stream.streamId}
          className={clsx("w-full aspect-video bg-gray-200 rounded-2xl shadow-md", {
            "col-span-3": index === 0,
          })}
        >
          <OpenViduStream streamManager={streamManager} />
        </div>
      ))}
    </div>
  );
}