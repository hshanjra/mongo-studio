const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold">Welcome to Mongo Studio</h1>
      <p className="mt-2 text-muted-foreground">
        Select a model to edit, view its data.
      </p>
    </div>
  );
};

export default HomePage;
