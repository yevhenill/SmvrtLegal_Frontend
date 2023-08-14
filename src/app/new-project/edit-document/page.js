"use client";

import CKeditor from "@/components/ckeditor";
import { useNewProject } from "@/context/new-project";
import { useState, useEffect } from "react";
import * as api from "@/api";

export default function StepFour() {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");

  const { project, setProject } = useNewProject();

  useEffect(() => {
    readFile();
  }, []);

  const readFile = () => {
    if (project.document instanceof Blob) {
      const fd = new FormData();
      fd.append("file", project.document);

      api.convert_file_to_html(fd).then((data) => {
        if (data.data) {
          console.log("New Doc: ", data);
          console.log(data.data)
          setData(data.data);
          setEditorLoaded(true);
        }
      });
      return;
    }

    setEditorLoaded(true);
  };

  const changeEditordata = () => {
    console.log('eee')
    setData(data)
    setProject({ ...project, document: data })
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
