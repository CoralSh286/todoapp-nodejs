/** @format */

const express = require("express"),
  router = express.Router();
const todosService = require("../BL/todos.service");
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const isCompleted = req.query.isCompleted;
    const taskName = req.query.title;
    const id = req.query.id;
    const todos = await todosService.getTodos({
      userId,
      isCompleted,
      taskName,
      id,
    });
    res.send(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message, "Error fetching todos");
  }
});
router.post("/add-task", async (req, res) => {
  try {
    const { userId, title, completed } = req.body;
    res.send(
      await todosService.createNewTodo({
        userId,
        todoTask: title,
        isCompleted: completed,
      })
    );
  } catch (error) {
    res.status(400).send(error.message || "Error creating todo");
  }
});

router.put("/update-task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { userId, title, completed } = req.body;
    res.send(
      await todosService.updateTodo({
        userId,
        todoTask: title,
        isCompleted: completed,
        id: taskId,
      })
    );
  } catch (error) {
    res.status(400).send(error.message || "Error updating todo");
  }
});
router.delete("/delete-task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    res.send(await todosService.deleteTodo({ id: taskId }));
  } catch (error) {
    res.status(400).send(error.message || "Error deleting todo");
  }
});

module.exports = router;
