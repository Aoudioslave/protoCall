import { gql } from "@apollo/client";

export const GET_PAGINATED_CALLS = gql`
    query GetCalls($offset: Float, $limit: Float) {
        paginatedCalls(offset: $offset, limit: $limit) {
            totalCount
            nodes {
                id
                direction
                from
                to
                duration
                is_archived
                call_type
                via
                created_at
                notes {
                    id
                    content
                }
            }
        }
    }
`;