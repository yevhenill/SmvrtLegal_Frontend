'use client'

import React, { useEffect, useRef, useState } from "react";


export default function CKeditor({ onChange, editorLoaded, name, value }) {
    const [editor, setEditor] = useState(false);
    const editorRef = useRef();

    useEffect(() => {
        const DecoupledEditor = require("@ckeditor/ckeditor5-build-decoupled-document")
        editorRef.current = {
            DecoupledEditor,
        };

        if (editorLoaded ) {
            if (typeof window !== "undefined") {
                DecoupledEditor
                .create( window.document.querySelector( '.document-editor__editable' ), {
                    toolbar: {
                        items: [
                            'undo', 'redo',
                            '|', 'heading',
                            '|', 'bold', 'italic',
                            '|', 'link', 'uploadImage', 'insertTable', 'mediaEmbed',
                            '|', 'bulletedList', 'numberedList', 'outdent', 'indent'
                        ]
                    },
                } )
                .then( editor => {
                    const toolbarContainer = window.document.querySelector( '.document-editor__toolbar' );
                    toolbarContainer.appendChild( editor.ui.view.toolbar.element );
                    setEditor(editor)
                    editor.setData(value)
                } )
                .catch( err => {
                    console.error( err );
                } );
            }
            
        }
    }, [editorLoaded]);
    
    return (
        <>
            {
                editorLoaded ? (
                    <div className="document-editor">
                        <div className="document-editor__toolbar"></div>
                        <div className="document-editor__editable-container">
                            <div className="document-editor__editable">
                            
                            </div>
                        </div>
                    </div>
                ) : <span>Editor loading ...</span>
            }
        </>
    )
}