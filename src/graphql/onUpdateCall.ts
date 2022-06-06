import { gql } from "@apollo/client";

export const CALL_SUBSCRIPTION = gql`
    subscription onUpdatedCall {
            is_archived
    }
`;