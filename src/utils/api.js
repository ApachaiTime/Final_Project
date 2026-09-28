import { endPointCall } from "./auth.js";
const baseUrl = import.meta.env.VITE_API_URL;

const getComments = () => {
  return endPointCall("/park/comments", "GET", null, true);
};

const addComment = ({ authorName, userId, text, parkCode }) => {
  return endPointCall(
    "/park/comments",
    "POST",
    JSON.stringify({ authorName, userId, text, parkCode }),
    true,
  );
};

const deleteComment = (id) => {
  return endPointCall(`/park/comments/${id}`, "DELETE", null, true);
};

export { getComments, addComment, deleteComment, baseUrl };
