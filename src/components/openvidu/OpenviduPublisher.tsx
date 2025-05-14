import { StreamManager } from "openvidu-browser";
import IconLoader from "@/public/images/icons/loader.svg";
import OpenviduStream from "@/src/components/openvidu/OpenviduStream";

interface OpenviduPublisherProps {
  streamManager?: StreamManager;
}

export default function OpenviduPublisher({ streamManager }: OpenviduPublisherProps) {
  if (!streamManager) {
    return (
      <div className="flex justify-center items-center w-full aspect-video bg-gray-200 rounded-2xl">
        <IconLoader className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-gray-200 rounded-2xl">
      <OpenviduStream streamManager={streamManager} />
    </div>
  );
}