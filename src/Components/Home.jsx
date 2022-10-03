import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home(props) {
  function notify(message, type) {
    if (type === "success") {
      toast.success(message, {
        position: "bottom-left",
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "bottom-left",
      });
    } else if (type === "info") {
      toast.info(message, {
        position: "bottom-left",
      });
    }
  }

  const [Notes, setNotes] = useState([]);
  const Token = localStorage.getItem("userToken");
  const userID = props.userToken._id;

  async function getUserNotes() {
    const { data } = await axios.get(
      `https://route-egypt-api.herokuapp.com/getUserNotes`,
      {
        headers: {
          Token,
          userID,
        },
      }
    );

    if ((data.message = "success")) {
      setNotes(data.Notes);
    }
  }

  const newNote = {
    title: "",
    desc: "",
    userID: userID,
    token: Token,
  };

  const [NewNote, setNewNote] = useState(newNote);

  function getInfoNewNote(e) {
    const deepCopyNewNote = { ...NewNote };
    deepCopyNewNote[e.target.name] = e.target.value;
    setNewNote(deepCopyNewNote);
  }

  async function addNewNotes(e) {
    const { data } = await axios.post(
      `https://route-egypt-api.herokuapp.com/addNote`,
      NewNote
    );

    if (data.message === "success") {
      document.querySelector(".close-btn-new-note").click();
      document.querySelector("#addNewNote").reset();
      getUserNotes();
      notify("Your Note added successfully", "success");
    }
  }

  async function deleteNote(noteId) {
    const { data } = await axios.delete(
      `https://route-egypt-api.herokuapp.com/deleteNote`,
      {
        data: {
          NoteID: noteId,
          token: Token,
        },
      }
    );

    if (data.message === "deleted") {
      notify(`Deleted From Notes`, "error");
      getUserNotes();
    }

    
  }

   function deleteAll() {

     Notes.map((note)=> {
      deleteNote(note._id);
    });

    notify("All Notes Deleted", "success");
    
  }


  const [IdNoteUpdate, setIdNoteUpdate] = useState(null);

  function getNoteIdToUpdate(idNote) {
    setIdNoteUpdate(idNote);
  }

  const updateNote = {
    title: "",
    desc: "",
    userID: userID,
    token: Token,
  };

  const [UpdateNote, setUpdateNote] = useState(updateNote);

  function getUpdateNote(e) {
    const deepCopyUpdateNote = { ...UpdateNote, NoteID: IdNoteUpdate };
    deepCopyUpdateNote[e.target.name] = e.target.value;
    setUpdateNote(deepCopyUpdateNote);
  }

  async function updateNoteSubmit(e) {
    e.preventDefault();

    const { data } = await axios.put(
      `https://route-egypt-api.herokuapp.com/updateNote`,
      UpdateNote
    );

    if (data.message === "updated") {
      document.querySelector("#editNote").reset();
      document.querySelector(".editNote-btn").click();
      getUserNotes();
      notify("Updated Note Successfully", "info");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      getUserNotes();
    }
  }, []);

  return (
    <>
      <div className="container my-5">
        <div className="addNew d-flex justify-content-between align-items-center position-relative">
          {Notes ? <button
            className="btn btn-danger text-light"
            type="button"
            onClick={deleteAll}
          >
             Clear All <i class="fa-solid fa-trash-can"></i>
          </button> : ''}
          <button
            className="btn btn-success text-light position-absolute end-0"
            data-bs-target="#addNewNote"
            data-bs-toggle="modal"
            type="button"
          >
            <i className="fa-solid fa-circle-plus"></i> Add Note
          </button>
        </div>
        <div className="row gy-3 mt-3">
          {Notes ? (
            Notes.map((note, i) => {
              return (
                <div className="col-md-4 col-sm-6" key={i}>
                  <div className="item shadow bg-warning p-3 rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="text-light fw-bold">{note.title}</h4>
                      <div className="icons">
                        <span
                          className="me-2 fs-5"
                          onClick={() => {
                            deleteNote(note._id);
                          }}
                        >
                          <button className="fa-solid fa-trash-can"></button>
                        </span>
                        <span
                          className="fs-5"
                          onClick={() => getNoteIdToUpdate(note._id)}
                        >
                          <button
                            className="fa-solid fa-pen-to-square"
                            data-bs-target="#editNote"
                            data-bs-toggle="modal"
                            type="button"
                          ></button>
                        </span>
                      </div>
                    </div>
                    <div className="decription">
                      <p className="text-mute note-decription">{note.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h3 className="text-center text-light position-absolute top-50 start-50 translate-middle">
              <span className="d-block mb-2">Empty Notes</span>
              Add Now!
            </h3>
          )}
        </div>
      </div>

      {/* Add New Notes */}
      <form
        className="modal fade"
        id="addNewNote"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                New Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="title"
                className="form-control mb-2"
                placeholder="Type Note Title"
                onChange={getInfoNewNote}
              />
              <textarea
                name="desc"
                cols="30"
                rows="10"
                className="form-control"
                placeholder="Type Note Description"
                onChange={getInfoNewNote}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary close-btn-new-note"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={addNewNotes}
                className="btn btn-primary"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Edit Note */}
      <form
        className="modal fade"
        id="editNote"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="title"
                className="form-control mb-2"
                placeholder="Type Note Title"
                onChange={getUpdateNote}
              />
              <textarea
                name="desc"
                cols="30"
                rows="10"
                className="form-control"
                placeholder="Type Note Description"
                onChange={getUpdateNote}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary editNote-btn"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={updateNoteSubmit}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
