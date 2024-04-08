import { useEffect, useState } from "react";
import "./App.css";
import { MdDeleteForever } from "react-icons/md";
import { TbClipboardCheck } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodo, setAllTodo] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [completedTodo, setCompletedTodo] = useState([]);

  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTodo = () => {
    if (newTitle === "" || newDescription === "") {
      alert("Title and description must not be empty.");
      return;
    }
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    }; //新todo資料用obj包起來

    let updatedTodoArr = [...allTodo];
    updatedTodoArr.push(newTodoItem);
    setAllTodo(updatedTodoArr);
    //新增推進todo array 裡面

    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
    //新增與Update進localStorage

    // console.log("Add succe");
    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodo];
    // console.log(index);
    reducedTodo.splice(index, 1); //(start,幾項)
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setAllTodo(reducedTodo);
  }; //刪除設定

  const handleCompletedTodo = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth();
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = ` ${yyyy}-${mm}-${dd} at ${h}:${m}:${s}`;
    let filteredItem = {
      ...allTodo[index],
      completedOn: completedOn,
    };
    let updatedCompletedArr = [...completedTodo];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodo(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodo];
    // console.log(index);
    reducedTodo.splice(index, 1); //(start,幾項)
    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    setCompletedTodo(reducedTodo);
  }; //completedtodo 刪除

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));
    if (savedTodo) {
      setAllTodo(savedTodo);
    }
    if (savedCompletedTodo) {
      setCompletedTodo(savedCompletedTodo);
    }
  }, []);

  const notFinishSwitch = () => {
    setIsCompleteScreen(false);
  };
  const finishSwitch = () => {
    setIsCompleteScreen(true);
  };

  //----------------
  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };
  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };
  const handleUpdateTodo = () => {
    let newTodo = [...allTodo];
    newTodo[currentEdit] = currentEditedItem;
    setAllTodo(newTodo);
    setCurrentEdit("");
    localStorage.setItem("todolist", JSON.stringify(newTodo));
  };

  return (
    <div className="App">
      <h1>My Todo List</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
              placeholder="What's the task title ?"
            ></input>
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => {
                setNewDescription(e.target.value);
              }}
              placeholder="What's the task Description ?"
            ></input>
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secbtn ${isCompleteScreen === false && "active"}`}
            onClick={notFinishSwitch}
          >
            Todo
          </button>
          <button
            className={`secbtn ${isCompleteScreen === true && "active"}`}
            onClick={finishSwitch}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodo.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="edit__wrapper">
                    <input
                      placeholder="Update title."
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      rows={4}
                      placeholder="Update title."
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateTodo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="todo-list-item">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="icons">
                      <MdDeleteForever
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                      />
                      <TbClipboardCheck
                        className="check-icon"
                        onClick={() => handleCompletedTodo(index)}
                      />
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                      />
                    </div>
                  </div>
                );
              }
            })}
          {isCompleteScreen === true &&
            completedTodo.map((item, index) => {
              return (
                <div key={index} className="todo-list-item">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>Completed on:{item.completedOn}</small>
                    </p>
                  </div>
                  <div className="icons">
                    <MdDeleteForever
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
