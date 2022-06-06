import './App.css';
import { Box, Pagination, Tab, Tractor, Typography } from '@aircall/tractor';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Login } from '../component/Login';
import { Calls } from '../component/Calls';
import { GET_PAGINATED_CALLS } from '../graphql/getPaginatedCalls';

const App = () => {
    const [tabContainered, setTabContainered] = useState(1);
    const onChangeTab = (id: number) => {
        setTabContainered(id);
    };
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrenPage] = useState(1);

    const { data, fetchMore } = useQuery(GET_PAGINATED_CALLS, {
        variables: {
            offset,
            limit: 10,
        },
    });

    const onPaginate = (pageSelected: number) => {
        fetchMore({
            variables: {
                offset,
            },
        }).then(() => {
            setOffset(pageSelected === 1 ? 0 : (pageSelected - 1) * 10);
            setCurrenPage(pageSelected);
        });
    };

    const calls = data?.paginatedCalls.nodes;
    const totalCountCall = data?.paginatedCalls.totalCount;

    return (
        <Tractor injectStyle>
            <div className="wrapper">
                <div className="header">
                    <Typography variant="displayM">Recent</Typography>
                    <Login />
                </div>
                <Box height="100vh">
                    {data && (
                        <>
                            <Tab.Container
                                activeTabId={tabContainered}
                                onChange={onChangeTab}
                            >
                                <Tab.Menu space="20px;">
                                    <Tab.MenuItem id={1}>Calls</Tab.MenuItem>
                                    <Tab.MenuItem id={2}>Archived()</Tab.MenuItem>
                                </Tab.Menu>
                                <Tab.Content>
                                    <Tab.Item id={1}>
                                        <Calls calls={calls} />
                                    </Tab.Item>
                                    <Tab.Item id={2}>
                                        <>Archived Calls</>
                                    </Tab.Item>
                                </Tab.Content>
                            </Tab.Container>
                            <Pagination
                                activePage={currentPage}
                                onPageChange={onPaginate}
                                pageSize={10}
                                recordsTotalCount={totalCountCall}
                            />
                        </>
                    )}
                </Box>
            </div>
        </Tractor>
    );
};

export default App;
