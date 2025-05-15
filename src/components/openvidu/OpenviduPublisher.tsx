import { StreamManager } from "openvidu-browser";
import OpenviduStream from "@/src/components/openvidu/OpenviduStream";

interface OpenviduPublisherProps {
  streamManager?: StreamManager;
}

export default function OpenviduPublisher({ streamManager }: OpenviduPublisherProps) {
  return (
    <div className="w-full aspect-video bg-gray-200 rounded-2xl">
      <OpenviduStream streamManager={streamManager} />
    </div>
  );
}