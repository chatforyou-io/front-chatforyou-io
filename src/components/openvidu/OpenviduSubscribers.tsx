import { StreamManager } from "openvidu-browser";
import OpenviduStream from "./OpenviduStream";

interface OpenviduSubscribersProps {
  streamManagers: StreamManager[];
}

export default function OpenviduSubscribers({ streamManagers }: OpenviduSubscribersProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {streamManagers.map((streamManager) => (
        <div key={streamManager.stream.streamId} className="w-full aspect-video bg-gray-200 rounded-2xl">
          <OpenviduStream streamManager={streamManager} />
        </div>
      ))}
    </div>
  );
}