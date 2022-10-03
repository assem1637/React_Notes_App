import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  function notify(message, type) {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
      });
    } else if (type === "info") {
      toast.info(message, {
        position: "top-right",
      });
    }
  }

  let User = {
    first_name: "",
    last_name: "",
    age: 0,
    email: "",
    password: "",
  };

  let navigate = useNavigate();

  let [userInfo, setUserInfo] = useState(User);
  let [error, setError] = useState("");
  let [isLoading, setIsLoading] = useState(false);

  function getUser(e) {
    let deepCopyUser = { ...userInfo };
    deepCopyUser[e.target.name] = e.target.value;
    setUserInfo(deepCopyUser);
  }

  async function submitRegister(e) {
    e.preventDefault();
    setIsLoading(true);

    const { data } = await axios.post(
      `https://routeegypt.herokuapp.com/signup`,
      userInfo
    );

    if (data.message === "success") {
      navigate("/login");
      setIsLoading(false);
      notify("Register Successfully", "success");
    } else {
      setError(data.errors.email.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="container text-light my-5">
        {error ? <div className="alert alert-danger my-2">{error}</div> : ""}
        <h3 className="mb-3">Register Now!</h3>
        <form onSubmit={submitRegister}>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="first_name"
              id="first_name"
              className="form-control text-light bg-transparent"
              placeholder="First Name"
              onChange={getUser}
            />
            <label htmlFor="first_name">First Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="form-control text-light bg-transparent"
              placeholder="Last Name"
              onChange={getUser}
            />
            <label htmlFor="last_name">Last Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              name="age"
              id="age"
              className="form-control text-light bg-transparent"
              placeholder="Age"
              onChange={getUser}
            />
            <label htmlFor="age">Age</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              id="email"
              className="form-control text-light bg-transparent"
              placeholder="Email"
              onChange={getUser}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              id="password"
              className="form-control text-light bg-transparent"
              placeholder="Password"
              onChange={getUser}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-info text-light">
            {isLoading ? (
              <span>
                <i className="fa-solid fa-spinner fa-spin-pulse text-light"></i>
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
