import "./Comments.css";
import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";
import { getComments, addComment, deleteComment } from "../../utils/api.js";
import defaultAvatar from "../../assets/avatar_icon.svg";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";

export default function Comments({ parkCode }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [loadedComments, setLoadedComments] = useState({
    parkCode: null,
    comments: [],
  });
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loading = loadedComments.parkCode !== parkCode;
  const comments = loadedComments.comments;

  useEffect(() => {
    if (!parkCode) return;
    let ignore = false;
    getComments()
      .then((data) => {
        if (ignore) return;
        setLoadedComments({
          parkCode,
          comments: (Array.isArray(data) ? data : []).filter(
            (comment) => comment.parkCode === parkCode,
          ),
        });
      })
      .catch((err) => {
        if (ignore) return;
        console.error(err);
        setError("Unable to load comments.");
        setLoadedComments({ parkCode, comments: [] });
      });
    return () => {
      ignore = true;
    };
  }, [parkCode]);

  function handleSubmit(evt) {
    evt.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError("");
    addComment({
      authorName: currentUser?.name,
      userId: currentUser?._id,
      text: trimmed,
      parkCode,
    })
      .then((newComment) => {
        setLoadedComments((prev) => ({
          ...prev,
          comments: [...prev.comments, newComment],
        }));
        setText("");
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to post your comment.");
      })
      .finally(() => setSubmitting(false));
  }

  function handleDelete(id) {
    deleteComment(id)
      .then(() => {
        setLoadedComments((prev) => ({
          ...prev,
          comments: prev.comments.filter(
            (comment) => (comment._id ?? comment.id) !== id,
          ),
        }));
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to delete comment.");
      });
  }

  function startEdit(comment) {
    setEditingId(comment._id ?? comment.id);
    setEditText(comment.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  // Backend has no update route yet, so an "edit" is simulated as
  // delete-old + create-new, which is why the edited comment moves
  // to the end of the list and gets a new id.
  function saveEdit(id) {
    const trimmed = editText.trim();
    if (!trimmed) return;

    setSavingEdit(true);
    setError("");
    deleteComment(id)
      .then(() =>
        addComment({
          authorName: currentUser?.name,
          userId: currentUser?._id,
          text: trimmed,
          parkCode,
        }),
      )
      .then((newComment) => {
        setLoadedComments((prev) => ({
          ...prev,
          comments: [
            ...prev.comments.filter(
              (comment) => (comment._id ?? comment.id) !== id,
            ),
            newComment,
          ],
        }));
        cancelEdit();
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to save your changes.");
      })
      .finally(() => setSavingEdit(false));
  }

  return (
    <section className="comments">
      <h2 className="comments__title">Comments</h2>

      <form className="comments__form" onSubmit={handleSubmit}>
        <textarea
          className="comments__input"
          value={text}
          onChange={(evt) => setText(evt.target.value)}
          placeholder="Share your experience at this park..."
          required
        />
        <button
          type="submit"
          className="comments-btn"
          disabled={submitting || !text.trim()}
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </form>

      {error && <p className="comments__error">{error}</p>}

      {loading ? (
        <p className="comments__status">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="comments__status">
          No comments yet. Be the first to share your experience.
        </p>
      ) : (
        <ul className="comments__list">
          {comments.map((comment) => {
            const id = comment._id ?? comment.id;
            const isOwner = comment.userId === currentUser?._id;
            const avatarSrc = isOwner
              ? currentUser?.avatar || defaultAvatar
              : defaultAvatar;
            const isEditing = editingId === id;

            return (
              <li className="comments__item" key={id}>
                <div className="comments__item-header">
                  <div className="comments__identity">
                    <img
                      className="comments__avatar"
                      src={avatarSrc}
                      alt={`${comment.authorName}'s avatar`}
                    />
                    <p className="comments__author">{comment.authorName}</p>
                  </div>
                  {isOwner && !isEditing && (
                    <div className="comments__actions">
                      <button
                        type="button"
                        className="comments__edit"
                        onClick={() => startEdit(comment)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="comments__delete"
                        onClick={() => setConfirmDeleteId(id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="comments__edit-form">
                    <textarea
                      className="comments__input"
                      value={editText}
                      onChange={(evt) => setEditText(evt.target.value)}
                    />
                    <div className="comments__actions">
                      <button
                        type="button"
                        className="comments__edit"
                        onClick={cancelEdit}
                        disabled={savingEdit}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="comments-btn"
                        onClick={() => saveEdit(id)}
                        disabled={savingEdit || !editText.trim()}
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comments__text">{comment.text}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          handleDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </section>
  );
}
