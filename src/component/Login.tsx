import '../pages/App.css';
import { useMutation } from '@apollo/client';
import { Button } from '@aircall/tractor';
import React from 'react';
import { GET_ACCESS_TOKEN } from '../graphql/getAccessToken';

export const Login = (): JSX.Element => {
    const [login, { data, loading, error }] = useMutation(GET_ACCESS_TOKEN);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    if (data) {
        localStorage.setItem('token', data.login.access_token);
        localStorage.setItem('refresh_token', data.login.refresh_token);
    }

    return (
        <Button
            onClick={() =>
                login({
                    variables: {
                        input: {
                            username: 'admin',
                            password: 'admin',
                        },
                    },
                })
            }
        >
            Login
        </Button>
    );
};
