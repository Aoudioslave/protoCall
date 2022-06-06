import '../pages/App.css';
import { Accordion, Box, Flex, Icon, Typography } from '@aircall/tractor';
import React from 'react';
import SvgOutbound from '@aircall/tractor/es/components/Icon/components/Outlined/Outbound';
import SvgInbound from '@aircall/tractor/es/components/Icon/components/Outlined/Inbound';
import { Call, Note } from '../__cached__/__types__';

type Props = {
    calls: Call[];
};

export const Calls = ({ calls }: Props): JSX.Element => (
    <Accordion.Container>
        {calls.map((call: Call) => (
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
);
