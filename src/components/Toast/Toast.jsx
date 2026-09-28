import "./Toast.css";

export default function Toast({ message }) {
  return (
    <div className={`toast${message ? " toast_visible" : ""}`}>{message}</div>
  );
}
