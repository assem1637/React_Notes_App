import notFoundImg from "../notFound.png";

export default function NotFound() {
  return (
    <>
      <div className="container notFound d-flex justify-content-center align-items-center">
        <img src={notFoundImg} alt="Not Found" className="w-40" />
      </div>
    </>
  );
}
