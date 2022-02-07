import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./PlaceForm.css";

function NewPlace() {
    const history = useHistory();
    const { userId, token } = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
            address: {
                value: "",
                isValid: false,
            },
            image: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    const placeSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", formState.inputs.title.value);
            formData.append("description", formState.inputs.description.value);
            formData.append("address", formState.inputs.address.value);
            formData.append("image", formState.inputs.image.value);

            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + "/api/places",
                "POST",
                formData,
                { Authorization: "Bearer " + token }
            );
            // Redirect to different page
            history.push("/");
        } catch (error) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText="Please provide an image."
                />
                <Button type="submit" disabled={!formState.isValid}>
                    Add Place
                </Button>
            </form>
        </React.Fragment>
    );
}

export default NewPlace;
