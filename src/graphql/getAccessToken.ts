import { gql } from "@apollo/client";

export const GET_ACCESS_TOKEN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            access_token
            refresh_token
        }
    }
`;