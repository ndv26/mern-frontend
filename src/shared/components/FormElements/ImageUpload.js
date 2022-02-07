import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";

import "./ImageUpload.css";

function ImageUpload(props) {
    const inputRef = useRef();
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = (e) => {
        let pickedFile;
        let fileIsValid;
        if (e.target.files && e.target.files.length === 1) {
            pickedFile = e.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        inputRef.current.click();
    };

    return (
        <div className="form-control">
            <input
                ref={inputRef}
                type="file"
                id={props.id}
                style={{ display: "none" }}
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && "center"}`}>
                <div className="image-upload__preview">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" />
                    ) : (
                        <p>Please pick an image.</p>
                    )}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    Pick Image
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
}

export default ImageUpload;
