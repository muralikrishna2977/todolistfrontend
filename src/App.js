
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import SignIn from "./components/SignIn.jsx";
import TodoList from "./components/TodoList.jsx";
import TaskDetails from "./components/TaskDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<TodoList />} />
        <Route path="/home/:taskId" element={<TaskDetails />} />
      </Routes>
    </Router>
    // <TodoList />
  );
}

export default App;

