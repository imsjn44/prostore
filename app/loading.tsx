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
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
    </div>
  );
};

export default Loading;
