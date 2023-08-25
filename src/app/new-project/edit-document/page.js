"use client";

import { Editor } from '@tinymce/tinymce-react';
import { useNewProject } from "@/context/new-project";
import { useState, useEffect } from "react";
import $ from 'jquery';

import jwt from 'jsonwebtoken';
import axios from 'axios';
import FormData from 'form-data';

import * as api from "@/api";

export default function StepFour() {
	const [data, setData] = useState("");
	const { project, setProject } = useNewProject();

	const handleEditorChange = (content) => {
		setEditorContent(content);
	};

	useEffect(() => {
		readFile();
		return () => {
			tinymce.remove('#tinymce-editor');
		};
	}, []);

	setTimeout(() => {
		$('.tox-statusbar').hide();
	}, 2000);

	const readFile = () => {
		if (project.document instanceof Blob) {
			const accessKey = '5WxA3fJ9oXzNklCyzNwSZgF1JXAcz3T9iqyARPPZkLQVPoW44D6OfTjzkH04';
			const environmentId = 'u5gGisqGXzPJ21UGgTo4';
			const token = jwt.sign({ aud: environmentId }, accessKey, { algorithm: 'HS256' })
			const config = {
				headers: {
					'Authorization': token
				}
			};

			const conversionConfig = {
				default_styles: true,
				collaboration_features: {
					user_id: 'example_user_id',
					comments: true,
					track_changes: false
				}
			};

			const formData = new FormData();
			formData.append('config', JSON.stringify(conversionConfig));
			formData.append('file', project.document, project.documentname);
			axios.post('https://docx-converter.cke-cs.com/v2/convert/docx-html', formData, config)
				.then(response => {
					console.log(response)
					const html = response.data.html;
					setData(html)
					changeEditordata(html);
				}).catch(error => {
					console.log('Conversion error', error);
				});
			return;
		}
	};

	const changeEditordata = (data) => {
		setProject({ ...project, docContent: data })
	}

	return (
		<div>
			<div className="mt-[35px] editor-container">
				<Editor
					apiKey="2bun2k44asn85k2u2wthy3plg3y2cdglb9m8a9l23c93jw2w" 
					initialValue={data}
					init={{
						height: 800,
						menubar: false,
						plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount'
						],
						toolbar:
							'undo redo | formatselect | bold italic backcolor | \
            			alignleft aligncenter alignright alignjustify | \
            			bullist numlist outdent indent | removeformat | help'
					}}
					onEditorChange={changeEditordata}
				/>
			</div>
		</div>
	);
}
