
import uuid from "crypto";

export type Todo = {
    id: string,
    title: string,
    completed: boolean
};

export class TodoNotFound extends Error {
    constructor(reason?: string) {
        super(reason);
    }
}

export class TodoAlreadyExist extends Error {
    constructor(reason?: string) {
        super(reason);
    }
}

export interface IService {
    getAllTodos(): Todo[];
    addTodo(title: string): Todo;
    deleteTodoById(id: string): Todo;
    updateTodo(id: string): Todo;

}

export function service(): IService {
    const todos: Todo[] = [];

    const getAllTodos = (): Todo[] => {
        return todos;
    }

    const addTodo = (title: string): Todo | never => {
        const exists = todos.filter(t => t.title === title).length > 0;
        if (exists) {
            throw new TodoAlreadyExist(`Todo: ${title} already exist.`);
        }

        const todoId = uuid.randomUUID().toString();
        const todo: Todo = {
            id: todoId,
            title: title,
            completed: false
        };
        todos.push(todo);

        return todo;
    }

    const deleteTodoById = (id: string): Todo => {
        const todo: Todo = todos.find(t => t.id === id);
        if (todo === undefined) {
            throw new TodoNotFound(`Todo with id: ${id} not found.`);
        }
        todos.splice(todos.findIndex(t => t.id === id), 1);
        return todo;
    }

    const updateTodo = (id: string): Todo => {
        let todo: Todo = todos.find(t => t.id === id);
        if (todo === undefined) {
            throw new TodoNotFound(`Todo with id: ${todo.id} not found.`);
        }
        const index = todos.findIndex(t => t.id === todo.id);
        todo = {
            id: todo.id,
            title: todo.title,
            completed: true
        };
        todos[index] = todo;
        return todo;
    }

    return {
        addTodo,
        getAllTodos,
        deleteTodoById,
        updateTodo
    };
}
