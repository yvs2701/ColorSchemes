import { Link } from "react-router-dom";

export default function ErrorPage({ title = "OOPS!", message = "Some error occured", linkText = "Back to Home", linkURL = "/" }) {
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