import '../pages/App.css';
import {
    Accordion,
    Box,
    Button,
    Flex,
    Icon,
    Typography,
} from '@aircall/tractor';
import React from 'react';
import SvgOutbound from '@aircall/tractor/es/components/Icon/components/Outlined/Outbound';
import SvgInbound from '@aircall/tractor/es/components/Icon/components/Outlined/Inbound';
import { useMutation } from '@apollo/client';
import { CallsGroupByDate } from '../type';
import { groupByDate } from '../functions';
import { Call, Note } from '../__cached__/__types__';
import { ARCHIVE_CALL } from '../graphql/archiveCall';
import { GET_PAGINATED_CALLS } from '../graphql/getPaginatedCalls';

type Props = {
    calls: Call[];
};

export const Calls = ({ calls }: Props): JSX.Element => {
    const callsGroupByDate = groupByDate(calls);

    // TODO Don't refetch, use subscription
    const [archiveCall] = useMutation(ARCHIVE_CALL, {
        refetchQueries: [{ query: GET_PAGINATED_CALLS }, 'GetCalls'],
    });

    return (
        <>
            {callsGroupByDate.map((array: CallsGroupByDate, index: number) => (
                <div key={index}>
                    <p>{array.date}</p>
                    <Accordion.Container>
                        {array.calls.map((call: Call) => (
                            <Accordion.Item key={call.id} id={call.id}>
                                <Accordion.Header>
                                    <Flex
                                        borderBottom="1px solid #cccccc"
                                        p="s"
                                        width="100%"
                                        cursor="pointer"
                                    >
                                        <Icon
                                            component={
                                                call.direction === 'outbound' ? SvgOutbound : SvgInbound
                                            }
                                            color="secondary.base"
                                            size={24}
                                        />
                                        <Typography variant="subheading">
                                            From {call.from} to {call.to}
                                        </Typography>
                                        {call.is_archived ? (
                                            <p>Call archived</p>
                                        ) : (
                                            <Button
                                                mode="link"
                                                onClick={() =>
                                                    archiveCall({ variables: { id: call.id } })
                                                }
                                            >
                                                Archive call
                                            </Button>
                                        )}
                                    </Flex>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Box p="m">
                                        <p className="mt-0">
                                            <small>
                                                {call.direction === 'outbound'
                                                    ? 'Outgoing call'
                                                    : 'Incoming call'}
                                            </small>
                                            <br />
                                            {`${Math.floor(call.duration / 3600)} hours`}
                                        </p>
                                        <p className="mt-0">
                                            <small>Call type</small>
                                            <br />
                                            {call.call_type}
                                        </p>
                                        <p className="mt-0">
                                            <small>Via</small>
                                            <br />
                                            {call.via}
                                        </p>
                                        {call.notes.map((note: Note) => (
                                            <p key={note.id} className="mt-0">
                                                <strong>{note.content}</strong>
                                            </p>
                                        ))}
                                    </Box>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion.Container>
                </div>
            ))}
        </>
    );
};
