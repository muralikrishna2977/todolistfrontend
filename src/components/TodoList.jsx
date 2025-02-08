import React, {useState, useEffect} from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./TodoList.scss";


function TodoList()
{
    const [work, setWork]=useState("");
    const [message, setMessage] = useState(""); // Store server response message
    const [error, setError] = useState(""); // Store errors
    const [tasks, setTasks]= useState([]);
    const [editValues, setEditValues]= useState({});
    const [appear, setAppear]= useState({});
    const [drop, setDrop]= useState(false);
    const [dropvalue, setDropvalue]=useState("High Priority");
    const [editpriority, setEditpriority]=useState({});
    const [editdropbutton, setEditdropbutton]=useState({});
    const location = useLocation();
    const userData = location.state?.user; // Safely get the user data
    const userid=userData.id;
    const navigate = useNavigate();


    useEffect(() => {

        async function fetchTasks() {
            const userId=userData.id;
            // console.log(userId);
          try {
            if (!userid) return;
            const response = await axios.post("/gettasks", {userId});
            setTasks(response.data.tasksfirst);
            var pri = {};
            response.data.tasksfirst.forEach((task) => {
              // console.log(task.id);
              // console.log(task.priority);
              pri[task.id] = task.priority;
            });

            setEditpriority((prev) => {
              const updatedPriority = { ...prev, ...pri };
              // console.log("Updated editpriority:", updatedPriority); // Correctly logs the updated state
              return updatedPriority;
            });

            setDropvalue("High Priority");
            setError("");
          } catch (err) {
            setError(err.response?.data?.message || "An error occurred"); // Store error message
            setMessage("");
          }
        }

        fetchTasks();
      }, []);
    
    async function handleSubmit(event)
    {
        event.preventDefault();
        const user=userData.id;
        var details="no discription";
        const formData = {user, work, dropvalue, details};
        try {
          const response = await axios.post("/home", formData);
          const tasksAfterAdd=response.data.tasksAfterAdd;
          setTasks(tasksAfterAdd);
          setWork("");
          setMessage(response.data.message); // Store success message
          setError(""); // Clear errors if successful
          setDropvalue("High Priority");
        } catch (err) {
          setError(err.response?.data?.message || "An error occurred"); // Store error message
          setMessage("");
        }
    }

    function handleEdit(title, index)
    {
        setEditValues((prev)=>({
            ...prev,
            [index]: title,
        }));

        setAppear((prev)=>({
            ...prev,
            [index]: !(appear[index]),
        }));
    }

    function handleEditValue(title, index)
    {
        setEditValues((prev)=>({
            ...prev,
            [index]: title,
        }));
    }

    async function handleEditSubmit(event, id)
    {
        event.preventDefault();
        const editedTitle=editValues[id];
        const editedpriority=editpriority[id];
        // console.log("hello world", editedpriority);
        const userId=userData.id;
        const formData={editedTitle, id, userId, editedpriority};
        try {
            const response = await axios.post("/edit", formData);
            const tasksAfterEdit=response.data.tasksAfterEdit;
            setTasks(tasksAfterEdit);
            setAppear((prev)=>({
                ...prev,
                [id]: !(appear[id]),
            }));
            setMessage(response.data.message); // Store success message
            setError(""); // Clear errors if successful
          } catch (err) {
            setError(err.response?.data?.message || "An error occurred"); // Store error message
            setMessage("");
          }
    }

    async function handleDelete(id){
        const userId=userData.id;
        const formData={userId, id};
        try {
            const response = await axios.post("/delete", formData);
            const tasksAfterDelete=response.data.tasksAfterDelete;
          setTasks(tasksAfterDelete);
            setMessage(response.data.message); // Store success message
            setError(""); // Clear errors if successful
          } catch (err) {      
            setError(err.response?.data?.message || "An error occurred"); // Store error message
            setMessage("");
          }
    }
    
    function handleCancel(index)
    {
        setEditValues((prev)=>({
            ...prev,
            [index]: "",
        }));

        setAppear((prev)=>({
            ...prev,
            [index]: !(appear[index]),
        }));
    }

    function handleEditpriority(index, priority){
      // console.log(index, priority);
      setEditpriority((prev)=>({
        ...prev,
        [index]: priority,
    }));
    // console.log(editpriority);
    }

    function handleEditDropButton(index){
      setEditdropbutton((prev)=>({
        ...prev,
        [index]: !(editdropbutton[index]),
    }));
    }


    function handleTaskClick(taskId) {
      const useridforTaskDetails={
        userid: userData.id,
        taskid: taskId,
      }

      // navigate("/getdetails", { state: { user: useridforTaskDetails } });

      navigate(`/home/${taskId}`, { state: { user: useridforTaskDetails } });
    };

    return (
      <div className="todolist">
        <div className="headinglogout">
          <div></div>
          <h1>Tasks</h1>
          <button className="save-btn" onClick={() => navigate("/signin")}>Logout</button>
        </div>
        <div className="todolisttaskcontainer">
          {tasks.map((item, index) => (
            <div className="todolisttask" key={item.id}>
              <div className="todolistsubtask">
                <img onClick={() => handleDelete(item.id)} src={`assets/delete.svg`} />



                {!appear[item.id] && <p>{item.title}</p>}


                {appear[item.id] && <input
                  id={item.id}
                  type="text"
                  name="editedText"
                  value={editValues[item.id] || ""}
                  onChange={(event) =>handleEditValue(event.target.value, item.id)} />
                }

                {appear[item.id] && 
                <div className="prioritydropdown1">
                 <div className="prioritydropdownbutton1" onClick={()=>handleEditDropButton(item.id)}>
                   <p>{editpriority[item.id]}</p>
                  
                   <img src={`assets/downarrow.svg`} />
                 </div>
                   {editdropbutton[item.id] && 
                   <div className="prioritybox1">
                     <p onClick={()=>handleEditpriority(item.id, "High Priority")}>High Priority</p>
                     <p onClick={()=>handleEditpriority(item.id, "Medium Priority")}>Medium Priority</p>
                     <p onClick={()=>handleEditpriority(item.id, "Low Priority")}>Low Priority</p>
                   </div>}
                </div>}


              </div>
              <div className="todolisteditviewdetails">
                {!appear[item.id] && <img onClick={() => handleEdit(item.title, item.id)} src={`assets/edit.svg`} />}
                {!appear[item.id] && <img onClick={()=>handleTaskClick(item.id)} src={`assets/viewdetails.svg`} />}
              </div>
              
              {appear[item.id] && (
                <form className="todolistcs" onSubmit={(event) => handleEditSubmit(event, item.id)}>
                  <button className="todolistcancel" onClick={() => handleCancel(item.id)}><img src={`assets/cancel.svg`}/></button>
                  <button className="todolistsave" type="submit"><img src={`assets/save.svg`}/></button>
                </form>
              )}
            </div>

          ))}

          <form className="todolistadditem" onSubmit={handleSubmit}>
            <input type="text" name="addwork" placeholder="New Item" value={work} onChange={(event) => setWork(event.target.value)} required />

            <div className="prioritydropdown">
            <div className="prioritydropdownbutton" onClick={()=>{setDrop(prev=>!prev)}}>
              <p>{dropvalue}</p>
              <img src={`assets/downarrow.svg`} />
            </div>
              {drop && <div className="prioritybox">
                <p onClick={()=>{setDropvalue("High Priority"); setDrop(false)}}>High Priority</p>
                <p onClick={()=>{setDropvalue("Medium Priority"); setDrop(false)}}>Medium Priority</p>
                <p onClick={()=>{setDropvalue("Low Priority"); setDrop(false)}}>Low Priority</p>
              </div>}
            </div>

            <button type="submit"><img src={`assets/add.svg`} /></button>
          </form>

      </div>
        {message && <p className="todolistmessage" style={{ color: "#10a37f" }}>{message}</p>}
        {error && <p className="todolistmessage" style={{ color: "red" }}>{error}</p>}

        
      </div>
    );
}

export default TodoList;


