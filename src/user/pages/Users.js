import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UserList from "../components/UsersList";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

function Users() {
    const [users, setUsers] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/api/users"
                );
                setUsers(responseData.users);
            } catch (error) {}
        };

        getAllUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && users && <UserList items={users} />}
        </React.Fragment>
    );
}

export default Users;
