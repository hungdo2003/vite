import { useState, useEffect, useRef } from "react";
import { createNews } from "../../../../utils/axios/news"; // Chỉ import createNews
import { Editor } from "@tinymce/tinymce-react";
import "./MainContent.scss";
import { jwtDecode } from "jwt-decode";
import { CONSTANT_TINY_MCE_API_KEY } from "../../../../utils/constants";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";

function Maincontent() {
  const [file, setFile] = useState(null);
  const [salesStaffId, setSalesStaffId] = useState(0);
  const editorRef = useRef(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const saveContent = async () => {
    // Chỉ tạo mới tin tức
    await createNews(salesStaffId, title, description, file);
    toast("Created successfully");
  };

  useEffect(() => {
    const decodeToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const staffId = decoded.sub.split("_");

        setSalesStaffId(staffId[1]);
      }
    };
    decodeToken();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="file-upload-container">
      <ToastUtil />
      <div className="form-group">
        <label htmlFor="file-input">Choose an image:</label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>

      {file && (
        <div className="image-preview">
          <img
            src={URL.createObjectURL(file)}
            alt="Selected"
            className="preview-image"
          />
        </div>
      )}

      <TextField
        fullWidth
        type=""
        label="Title"
        style={{ marginBottom: "20px" }}
        onChange={(e) => handleTitleChange(e)}
      />

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <Editor
          apiKey={CONSTANT_TINY_MCE_API_KEY}
          onInit={(evt, editor) => (editorRef.current = editor)}
          onEditorChange={handleEditorChange} // Correctly handle content change
          init={{
            height: 300,
            plugins: [
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "image",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
              "checklist",
              "mediaembed",
              "casechange",
              "export",
              "formatpainter",
              "pageembed",
              "a11ychecker",
              "tinymcespellchecker",
              "permanentpen",
              "powerpaste",
              "advtable",
              "advcode",
              "editimage",
              "advtemplate",
              "ai",
              "mentions",
              "tinycomments",
              "tableofcontents",
              "footnotes",
              "mergetags",
              "autocorrect",
              "typography",
              "inlinecss",
              "markdown",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
              { value: "First.Name", title: "First Name" },
              { value: "Email", title: "Email" },
            ],
            ai_request: (request, respondWith) =>
              respondWith.string(() =>
                Promise.reject("See docs to implement AI Assistant")
              ),
          }}
        />
      </div>

      <div className="file-upload-container">
        <button
          type="submit"
          className="upload-button"
          onClick={() => saveContent()}
        >
          Create {/* Button text is fixed to "Create" */}
        </button>
      </div>
    </div>
  );
}

export default Maincontent;
