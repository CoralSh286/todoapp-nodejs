/** @format */

import React, { useEffect, useState } from "react";
import Todo from "../../components/Todo/Todo";
import "./style.css";
import CrudBar from "../../components/CrudBar/CrudBar";
import { apiRequest, useApiRequest } from "../../service/api";
import DisplayData from "../../components/DisplayData/DisplayData";
import { getUser, getUserId } from "../../helper/localStorageHelper";
import PageHeader from "../../components/PageHeader/PageHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
import SortTodos from "../../components/SortTodos/SortTodos";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const userId = getUserId();
  const { data, loading, error, refetch } = useApiRequest({
    url: `/todos?userId=${userId}`,
    initialData: [],
  });

  useEffect(() => {
    if (data) {
      setTodos(data.data || []); // Ensure we set todos to an empty array if data is undefined
    }
  }, [data]);

  const searchQuery = async (form) => {
    const urlQuery = `/todos?userId=${userId}${
      form.title ? "&title=" + form.title : ""
    }${form.id ? "&id=" + form.id : ""}${
      form.isCompleat ? "&isCompleted=" + form.isCompleat : ""
    }`;
    const data = await apiRequest({ url: urlQuery });
    setTodos(data.data || []); // Ensure we set todos to an empty array if data is undefined
  };

  const onDelete = async () => {
    if (!selectedTodo) return;
    const { id } = selectedTodo;
    await apiRequest({ url: `/todos/delete-task/${id}`, method: "DELETE" });
    await refetch();
    setSelectedTodo(null);
  };
  return (
    <div className="todos-container">
      <CrudBar
        editingFor={"todos"}
        refetchFunction={refetch}
        selected={selectedTodo}
        additionalData={{ userId: userId }}
        onDelete={onDelete}
      />
      <PageHeader title={"Todo List"} />
      <SortTodos setTodos={setTodos} todos={todos} />
      <SearchBar onSubmit={searchQuery} addCompleat={true} />
      <DisplayData error={error} loading={loading} data={todos}>
        <div className="todos-list">
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              {...todo}
              selected={selectedTodo}
              setSelected={setSelectedTodo}
            />
          ))}
        </div>
      </DisplayData>
    </div>
  );
}
