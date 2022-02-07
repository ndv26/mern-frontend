import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

function UserPlaces(props) {
    const { userId } = useParams();
    const [loadedPlaces, setLoadedPlaces] = useState(null);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const getPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL +
                        `/api/places/user/${userId}`
                );
                setLoadedPlaces(responseData.places);
            } catch (error) {}
        };
        getPlaces();
    }, [sendRequest, userId]);

    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place.id !== deletedPlaceId)
        );
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && (
                <PlaceList
                    items={loadedPlaces}
                    onDeletePlace={placeDeleteHandler}
                />
            )}
        </React.Fragment>
    );
}

export default UserPlaces;
