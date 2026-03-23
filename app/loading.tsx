import Image from "next/image";
import loader from "@/assets/loader.gif";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image
        loading="eager"
        src={loader}
        width={150}
        height={150}
        alt="Loading..."
        className="h-10 w-auto"
      />
    </div>
  );
};

export default Loading;
