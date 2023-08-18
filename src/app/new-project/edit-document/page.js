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
      fd.append("document", project.document);
      fd.append("documentname", project.documentname);
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
      setEditorLoaded(true);
      return;
    }

    setEditorLoaded(true);
  };

  const changeEditordata = (data) => {
    console.log('Data is modified')
    console.log(data);
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
