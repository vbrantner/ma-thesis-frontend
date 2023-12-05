import { InteractiveCanvas } from "../components/interactiveCanvas";

export default function SingleImagesStreamPage() {
  return (
    <div className="relative">
      <h1 className="text-2xl">Yield to Image tag</h1>
      <InteractiveCanvas>
        <img className="w-1/2" src={"http://192.168.1.55:3000/video_feed"} />
      </InteractiveCanvas>
    </div>
  );
}
