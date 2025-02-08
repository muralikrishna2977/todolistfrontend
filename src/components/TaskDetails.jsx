import React, {useEffect, useState} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import "./TaskDetails.scss";

function TaskDetails()
{
    const { taskId } = useParams();
    const [details, setDetails]=useState("");
    const [initialdetails, setInitialdetails]=useState("");
    const [title, setTitle]=useState("");
    const [apper, setApper]=useState(false);
    const [message, setMessage]=useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.user;


    useEffect(() => {
        async function fetchTasks() {
          try {
            const response = await axios.post("/getdetails", {taskId});
            console.log(response.data.taskdetails[0].taskdetails);
            // console.log("hello world", taskId);
            setDetails(response.data.taskdetails[0].taskdetails);
            setInitialdetails(response.data.taskdetails[0].taskdetails);
            setTitle(response.data.taskdetails[0].title);
          } catch (err) {
            // setError(err.response?.data?.message || "An error occurred");
            console.log(err);
          }
        }

        fetchTasks();
      }, []);


      function handleTaskClick() {
        const userData={
            id: data.userid,
        }
        navigate("/home", { state: { user: userData } });
      };

      function handleCancel(){
        // console.log("abcd ", temp);
        setDetails(initialdetails);
        setApper(false);
      }

      async function handleSave(){
        try {
            const response = await axios.post("/updatetaskdetails", {taskId, details});
            console.log(response);
            setApper(false);
            setMessage(response.data.message); 
            // setTimeout(() => {
            //   setMessage("");
            // }, 5000);
          } catch (err) {
            // setError(err.response?.data?.message || "An error occurred");
            console.log(err);
          }

      }

      return (
            <div className="overlay">
              <div className="popup">
                <div class="titleandclose">
                  <h3>{title}</h3>
                  <button className="close-btn" onClick={handleTaskClick}>Close</button>
                </div>

                {!apper &&
                <div className="taskdetails">
                  <p>{details}</p>
                </div>}

                {apper && <textarea className="textarea" rows="5" cols="50" value={details} onChange={(event)=>setDetails(event.target.value)} placeholder="Enter your task details here..."></textarea>}

                {!apper && <button className="edit-btn"
                  onClick={()=>{
                  setApper(prev=>!prev);
                  setDetails(initialdetails);
                }}>Edit</button>}

                <div className="saveandcancel">
                  {apper && <button className="save-btn" onClick={handleSave}>Save</button>}
                  {apper && <button className="close-btn" onClick={handleCancel}>Cancel</button>}
                </div>

                {!apper && <p className="taskdetailsmessage">{message}</p>}
                
              </div>
            </div>);


// onChange={(event) =>handleEditValue(event.target.value, item.id)}/>  onClick={()=>setDetails(event.target.value)}

}

export default TaskDetails;