import './App.css';
import { Box, Pagination, Tab, Tractor, Typography } from '@aircall/tractor';
import React, { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Login } from '../component/Login';
import { Calls } from '../component/Calls';
import { Call } from '../__cached__/__types__';
import { GET_PAGINATED_CALLS } from '../graphql/getPaginatedCalls';
import { CALL_SUBSCRIPTION } from '../graphql/onUpdateCall';

const App = () => {
    const [tabContainered, setTabContainered] = useState(1);
    const onChangeTab = (id: number) => {
        setTabContainered(id);
    };
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrenPage] = useState(1);

    const { data, fetchMore, error } = useQuery(GET_PAGINATED_CALLS, {
        variables: {
            offset,
            limit: 10,
        },
    });
    // TODO Find a way to reload the page
    /*    if(error){
              window.location.reload()
          }

       // TODO Read the doc to understand subscription
          const { data: dataSubscription } = useSubscription(
              CALL_SUBSCRIPTION
          );

          console.log(dataSubscription); */

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
    const archivedCalls = data?.paginatedCalls.nodes.filter(
        (call: Call) => call.is_archived,
    );
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
                                    <Tab.MenuItem id={2}>
                                        Archived({archivedCalls.length})
                                    </Tab.MenuItem>
                                </Tab.Menu>
                                <Tab.Content>
                                    <Tab.Item id={1}>
                                        <Calls calls={calls} />
                                    </Tab.Item>
                                    <Tab.Item id={2}>
                                        <>
                                            <Calls calls={archivedCalls} />
                                        </>
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
