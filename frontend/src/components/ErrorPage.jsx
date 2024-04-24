import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

export default function ErrorPage({ title = "OOPS!", message = "Some error occured", linkText = "Back to Home", linkURL = "/" }) {
  const err = useRouteError();
  const error = {
    status: 0,
    error: err.message,
    title: title,
    message: message,
    linkText: linkText,
    linkURL: linkURL
  };

  if (isNumeric(error.error))
    error.status = parseInt(error.error);

  if (error.status === 400) {
    error.title = "Err 400";
    error.message = "The request was invalid.";
  } else if (error.status === 401) {
    error.title = "Err 401";
    error.message = "You are not authorized to view this page.";
  } else if (error.status === 404) {
    error.title = "Err 404";
    error.message = "The requested page was not found.";
  } else if (error.status === 500) {
    error.title = "Err 500";
    error.message = "An internal server error occured.";
  } else {
    error.title = "Some error occured!"
    error.message = "Please try again later.";
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{error.title}</h1>
          <p className="py-6 whitespace-pre-wrap">{error.message}</p>
          <Link to={error.linkURL} className="btn btn-primary">{error.linkText}</Link>
        </div>
      </div>
    </div>
  )
}