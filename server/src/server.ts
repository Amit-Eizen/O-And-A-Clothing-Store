import initApp from "./app";

const port = process.env.PORT;

initApp()
  .then((app) => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`API docs: http://localhost:${port}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
