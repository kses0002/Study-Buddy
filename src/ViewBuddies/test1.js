import { API, Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { graphqlOperation } from '@aws-amplify/api';
import { messagesByChannelID } from '../graphql/queries';
import { createMessage } from '../graphql/mutations';
import { onCreateMessage } from '../graphql/subscriptions'

function Test1({ data }) {
    return (
        <h1>{data}</h1>
    );
}

export default Test1;