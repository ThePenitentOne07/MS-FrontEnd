import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { Button, Typography, Box, Container, TextField } from '@mui/material';

const EditorComponent = () => {
    const [editorData, setEditorData] = useState('');
    const [title, setTitle] = useState('');  // State to store the title of the post

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:8080/api/content", {
                title,  // Sending title along with the content
                content: editorData
            }, {
                headers: {
                    "Content-Type": "Application/json"
                }
            });
            console.log('Data submitted successfully');
        } catch (error) {
            console.error('Failed to submit data', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Post's title
            </Typography>
            <TextField
                label="Post's Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={handleTitleChange}
                sx={{ mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
                Post's content
            </Typography>
            <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onChange={handleEditorChange}
            />
            <Box mt={2} mb={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Container>
    );
};

export default EditorComponent;
