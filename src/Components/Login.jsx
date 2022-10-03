import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  let User = {
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

  async function submitLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    const { data } = await axios.post(
      `https://routeegypt.herokuapp.com/signin`,
      userInfo
    );

    if (data.message === "success") {
      navigate("/");
      setIsLoading(false);
      localStorage.setItem("userToken", data.token);
      props.saveUserData();
      props.noti();
    } else {
      setError(data.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="container text-light my-5">
        {error ? <div className="alert alert-danger my-2">{error}</div> : ""}
        <h3 className="mb-3">Login Now!</h3>
        <form onSubmit={submitLogin}>
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
              "Login"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
