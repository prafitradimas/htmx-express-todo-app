
import express from "express";
import { Todo, TodoAlreadyExist, TodoNotFound, service } from "./todo-service.js";

export const todoRouter = express.Router();
const todoService = service();

todoRouter.get("/", (req, res) => {
    res.render("index");
});

todoRouter.route("/api/todos")
    .get((req, res, next) => {
        const todos = todoService.getAllTodos();
        const html = "";
        todos.forEach(todo => {
            if (todo.completed === false) {
                html.concat(
                    `<tr id="todo-${todo.id}">
                        <td>${todo.title}</td>
                        <td>${todo.completed}</td>
                        <td>
                            <button hx-delete="/api/todos/${todo.id}" hx-delete="/api/todos/${todo.id}" hx-swap="delete" hx-target="#todo-${todo.id}" class="btn btn-danger">Delete</button>
                            <button hx-patch="/api/todos/${todo.id}" hx-swap="outerHTML" hx-target="#todo-${todo.id}" class="btn btn-success ms-1">Completed</button>
                        </td>
                    </tr>`);
            } else {
                html.concat(
                    `<tr id="todo-${todo.id}">
                        <td>${todo.title}</td>
                        <td>${todo.completed}</td>
                        <td>
                            <button hx-delete="/api/todos/${todo.id}" hx-delete="/api/todos/${todo.id}" hx-swap="delete" hx-target="#todo-${todo.id}" class="btn btn-danger">Delete</button>
                        </td>
                    </tr>`);
            }
        });
        res.type("hmtl").status(200).send(html);
    })
    .post((req, res, next) => {
        const title: string = req.body.title;
        try {
            const todo: Todo = todoService.addTodo(title);
            const html =
                `<tr id="todo-${todo.id}">
                    <td>${todo.title}</td>
                    <td>${todo.completed}</td>
                    <td>
                        <button hx-confirm="Are you sure?" hx-delete="/api/todos/${todo.id}" hx-swap="delete" hx-target="#todo-${todo.id}" class="btn btn-danger">Delete</button>
                        <button hx-patch="/api/todos/${todo.id}" hx-swap="outerHTML" hx-target="#todo-${todo.id}" class="btn btn-success ms-1">Completed</button>
                    </td>
                </tr>`;
            res.type("html").status(200).send(html);
        } catch (e) {
            next(e);
        }
    });

todoRouter.route("/api/todos/:id")
    .patch((req, res, next) => {
        try {
            const todo = todoService.updateTodo(req.params.id);
            const html =
                `<tr id="todo-${todo.id}">
                    <td>${todo.title}</td>
                    <td>${todo.completed}</td>
                    <td>
                        <button hx-confirm="Are you sure?" hx-delete="/api/todos/${todo.id}" hx-swap="delete" hx-target="#todo-${todo.id}" class="btn btn-danger">Delete</button>
                    </td>
                </tr>`;
            res.type("html").status(200).send(html);
        } catch (e) {
            next(e);
        }
    })
    .delete((req, res, next) => {
        const id = req.params.id;
        try {
            const todo = todoService.deleteTodoById(id);
            res.type("html").status(200).send();
        } catch (e) {
            next(e);
        }
    });

todoRouter.use((err: Error, req: any, res: any, next: any) => {
    if (err instanceof TodoNotFound) {
        res.status(404).send();
    } else if (err instanceof TodoAlreadyExist) {
        res.status(400).send();
    } else {
        res.status(500).send();
    }
});
