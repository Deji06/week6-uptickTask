"use client";
import axios from "axios";
import React, {  useContext, createContext,type ReactNode, useCallback, useState, useEffect} from "react";

interface singleTaskType {
  content: string;
  _id: string;
  completed: boolean;
  createdAt: string;
}

interface TaskArrayState {
  tasks: singleTaskType[];
  loading: boolean;
  error: string | null;
  count: number;
  createTaskError: string | null;
  updateTaskError: string | null;
  filterState: filterOptions
  filteredTasks: singleTaskType[]
}

interface TaskContextType {
  state: TaskArrayState;
  getAllTasks: () => Promise<void>;
  createTask: (content: string) => Promise<boolean>;
  updateTask: (content: string, id: string) => Promise<boolean>;
  deleteTask: (id: string) => Promise<void>;
  checkTaskBox :(id:string) => Promise<void>
  setFilterState: (filter: filterOptions) => void;
  resetTaskState: () => void
}

type filterOptions =    'All' | "completed" |"incomplete"


export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [createTaskError, setCreateTaskError] = useState<string | null>(null);
  const [updateTaskError, setUpdateTaskError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [tasks, setTasks] = useState<singleTaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<singleTaskType[]>([]);
  const [filterState, setFilterState] = useState<filterOptions>("All");
  const state: TaskArrayState = {
    tasks,
    loading,
    error,
    count,
    createTaskError,
    updateTaskError,
    filterState,
    filteredTasks
  };

  const resetTaskState = useCallback(() => {
    setTasks([]);
    setFilteredTasks([]);
    setFilterState("All");
    setLoading(false);
    setError(null);
    setCreateTaskError("");
    setCount(0);
    console.log("task related info cleared");
  }, []);

  const getAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${url}/api/v1/task`, config);
      const data = response.data;
      console.log("all tasks:", data);
      setTasks(data.getAll);
      setCount(data.count);
      setError(null);
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_INTERNET_DISCONNECTED") {
        errorMessage = "Failed to fetch tasks, check internet connectivity";
      } else if (error.response && error.response.status === 401) {
        errorMessage = "Unauthorized user, please login";
      } else if (error.response && error.response.data?.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to fetch task";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (content: string) => {
    setLoading(true);
    setCreateTaskError(null);
    if (content.trim() === "") {
      setCreateTaskError("content cannot be empty");
      setLoading(false);
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setCreateTaskError("Please log in to create task");
        setLoading(false);
        return false;
      }
      const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
      const body = { content };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const createTaskResponse = await axios.post(
        `${url}/api/v1/task`,
        body,
        config
      );
      console.log("task created", createTaskResponse);
      setTasks((prevTasks) => [...prevTasks, createTaskResponse.data.task]);
      setCount((prevCount) => prevCount + 1);
      return true;
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect to the Server, please check internet connection";
      }
      if (error.response && error.response.status === 500) {
        errorMessage = "an internal error occured.. try again later !!";
      } else if (error.response && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "failed to create task";
      }
      setCreateTaskError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (content:string, id:string) => {
     setLoading(true);
    setUpdateTaskError(null);
    if (content.trim() === "") {
      setUpdateTaskError("task cannot be empty");
      setLoading(false);
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUpdateTaskError("token missing, login to update task");
        setLoading(false);
        return false;
      }

      const url = process.env.NEXT_PUBLIC_TASKMANAGER_URL
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const body = { content };
      const updateTaskResponse = await axios.patch(
        `${url}/api/v1/task/${id}`,
        body,
        config
      );
      console.log("updated Task", updateTaskResponse.data.updateTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? updateTaskResponse.data.updateTask : task
        )
      );
      return true;
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect to the server. Check your internet connection.";
      } else if (error.response?.status === 400) {
        errorMessage = "Content cannot be empty or invalid.";
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to update task.";
      }
      setUpdateTaskError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
    
  }, []);

  const deleteTask = useCallback(async (id:string) => {
     setLoading(true);
    setError(null);
    try {
      const URL = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("token missing, cannot delete task");
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const deleteTaskResponse = await axios.delete(
        `${URL}/api/v1/task/${id}`,
        config
      );
      console.log("task deleted ", deleteTaskResponse);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setCount((prevCount) => prevCount - 1);
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect with server, check internet connection !!";
      } else if (error.response && error.respnse.status === 404) {
        errorMessage = "task not found";
      } else if (error.response && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to delete task";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

  }, []);

    const checkTaskBox = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const taskToUpdate = tasks.find((task) => task._id === id);
        if (!taskToUpdate) {
          setLoading(false);
          return;
        }
        const URL = process.env.NEXT_PUBLIC_TASKMANAGER_URL;
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("token missing, cannot update taskChecker");
          setLoading(false);
          return;
        }
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
        const body = { completed: !taskToUpdate.completed };
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.patch(
          `${URL}/api/v1/task/${id}`,
          body,
          config
        );
        console.log("taskchecker:", response);
      } catch (error: any) {
        console.error(error);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
          console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect with server, check internet connection !!";
      } else if (error.response && error.respnse.status === 404) {
        errorMessage = "tasks not found";
      } else if (error.response && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to filter task";
      }
      setError(errorMessage);
        setError("Failed to update task completion status.");
      } finally {
        setLoading(false);
      }
    },
    [tasks]
  );

  useEffect(() => {
    let newFilteredTasks: singleTaskType[] = [];
    if (filterState === "All") {
      newFilteredTasks = tasks;
    } else if (filterState === "completed") {
      newFilteredTasks = tasks.filter((task) => task.completed);
    } else {
      // Incomplete
      newFilteredTasks = tasks.filter((task) => !task.completed);
    }

    setFilteredTasks(newFilteredTasks);
  }, [tasks, filterState]);


  return (
    <TaskContext.Provider
      value={{ createTask, getAllTasks, updateTask, deleteTask, state, checkTaskBox , resetTaskState, setFilterState}}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const UseTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("task context must be used within a child component");
  }
  return context;
};
