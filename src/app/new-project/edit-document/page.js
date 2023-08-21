"use client";

import CKeditor from "@/components/ckeditor";
import { useNewProject } from "@/context/new-project";
import { useState, useEffect } from "react";
import * as api from "@/api";

// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
import mammoth from "mammoth";

export default function StepFour() {

  const handleDocFileChange = (event) => {
    const file = event.target.files[0];

    mammoth.convertToHtml({ arrayBuffer: file })
      .then((result) => {
        const html = result.value;
        setHtmlContent(html);
      })
      .catch((error) => {
        console.error("Error converting DOC to HTML:", error);
      });
  };

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");

  const { project, setProject } = useNewProject();

  useEffect(() => {
    readFile();
  }, []);

  const readFile = () => {
    if (project.document instanceof Blob) {
      // const fd = new FormData();
      // fd.append("document", project.document);
      // fd.append("documentname", project.documentname);

      mammoth.convertToHtml({ arrayBuffer: project.document })
      .then((result) => {
        const html = result.value;
        changeEditordata(html);
        setEditorLoaded(true);
      })
      .catch((error) => {n
        console.error("Error converting DOC to HTML:", error);
      });

      //  fd.append("docContent", project.docContent);

      // api.convert_file_to_html(fd).then((data) => {
      //   if (data.data) {
      //   //  console.log("New Doc: ", data);
      //   //  console.log(data.data)
      //     setData(data.data);
      //     setProject({ ...project, docContent: data.data })
      //     setEditorLoaded(true);
      //   }
      // });
      // setData('fwefwfwfew');
      // setProject({ ...project, docContent: 'jpfowjpfjw' });
      return;
    }

    //setEditorLoaded(true);
  };

  const changeEditordata = (data) => {
    setData(data)
    setProject({ ...project, docContent: data })
  }

  return (
    <div className="mt-[35px] editor-container">
      <CKeditor
        onChange={(data) => {
          changeEditordata(data);
        }}
        value={data}
        editorLoaded={editorLoaded}
      />
    </div>
  );
}
