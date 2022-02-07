import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UI/Card";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/utils/validators";

import "./PlaceForm.css";

function UpdatePlace(props) {
    const { placeId } = useParams();
    const history = useHistory();
    const { userId, token } = useContext(AuthContext);
    const [loadedPlace, setLoadedPlace] = useState(null);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    useEffect(() => {
        const getPlace = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + `/api/places/${placeId}`
                );
                setLoadedPlace(responseData.place);
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true,
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (error) {}
        };
        getPlace();
    }, [sendRequest, setFormData, placeId]);

    const placeUpdateSubmitHandler = async (e) => {
        e.preventDefault();
        await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/api/places/${placeId}`,
            "PATCH",
            JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
            }),
            {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            }
        );
        history.push(`/${userId}/places`);
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form
                    className="place-form"
                    onSubmit={placeUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialIsValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (at least 5 characters)."
                        onInput={inputHandler}
                        initialValue={loadedPlace.description}
                        initialIsValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        Update Place
                    </Button>
                </form>
            )}
        </React.Fragment>
    );
}

export default UpdatePlace;
