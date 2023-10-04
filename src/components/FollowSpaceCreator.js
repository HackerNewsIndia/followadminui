import React, { useState } from "react";
import "./FollowSpaceCreator.css";

function CreateFollowSpace({ onClose }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setcategory] = useState("");
  const [errors, setErrors] = useState({});

  function validateFields() {
    let validationErrors = {};

    // Validate title length
    if (title.length < 3 || title.length > 30) {
      validationErrors.title = "Title should be between 3 and 30 characters.";
    }

    // Validate URL format using a simple regex pattern
    const urlPattern = /^https?:\/\/.+$/;
    if (!urlPattern.test(url)) {
      validationErrors.url = "URL must be in http format.";
    }

    return validationErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onClose();
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h3 className="blogHeading">Create blog here</h3>
        <button className="cancel-button" onClick={onClose}>
          ❌
        </button>
      </div>
      <form className="createBlogForm" onSubmit={handleSubmit}>
        {/* <i class="fas fa-pencil"></i> */}
        <input
          type="text"
          className="blogInput"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error">{errors.title}</p>}
        {/* <i class="fas fa-pencil"></i> */}
        <input
          type="url"
          className="blogInput"
          placeholder="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {errors.url && <p className="error">{errors.url}</p>}
        <input
          type="text"
          className="blogInput"
          placeholder="category"
          value={category}
          onChange={(e) => setcategory(e.target.value)}
        />
        {errors.category && <p className="error">{errors.category}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

const FollowSpaceCreator = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div>
      {showCreateForm ? (
        <CreateFollowSpace onClose={toggleCreateForm} />
      ) : (
        <button className="create-blog-button" onClick={toggleCreateForm}>
          CREATE NEW FOLLOW SPACE
        </button>
      )}
    </div>
  );
};

export default FollowSpaceCreator;
