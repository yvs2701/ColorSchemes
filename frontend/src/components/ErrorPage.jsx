import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage({ title = "OOPS!", message = "Some error occured", linkText = "Back to Home", linkURL = "/" }) {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      title = "Err 400";
      message = "The request was invalid.";
    } else if (error.status === 401) {
      title = "Err 401";
      message = "You are not authorized to view this page.";
    } else if (error.status === 404) {
      title = "Err 404";
      message = "The requested page was not found.";
    } else if (error.status === 500) {
      title = "Err 500";
      message = "An internal server error occured.";
    } else {
      title = "Some error occured!"
      message = "Please try again later.";
    }
    console.error(error);
  }
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="py-6 whitespace-pre-wrap">{message}</p>
          <Link to={linkURL} className="btn btn-primary">{linkText}</Link>
        </div>
      </div>
    </div>
  )
}