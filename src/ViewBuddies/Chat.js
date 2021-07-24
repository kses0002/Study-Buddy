import Amplify, { API, Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Button from '@material-ui/core/Button';
import { graphqlOperation } from '@aws-amplify/api';
import { messagesByChannelID } from '../graphql/queries';
import { createMessage } from '../graphql/mutations';
import { onCreateMessage } from '../graphql/subscriptions'
import './Chat.css'

function Chat() {

    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        Auth.currentUserInfo().then((userInfo) => {
            console.log(userInfo.attributes.email)
            setUserInfo(userInfo)
        })
    }, [])


    useEffect(() => {
        API
            .graphql(graphqlOperation(messagesByChannelID, {
                channelID: '1',
                sortDirection: 'ASC'
            }))
            .then((response) => {
                const items = response?.data?.messagesByChannelID?.items;
                console.log(items)
                for (let i = 0; i < items.length; i++) {
                    if ((items[i].author == "keshav.sesh@gmail.com"
                        && items[i].recepient == "keshavpriya@yahoo.com") || (items[i].recepient == "keshavpriya@yahoo.com"
                        && items[i].author == "keshavpriya@yahoo.com")) {
                        console.log(items[i])
                        setMessages(oldItems => [...oldItems, items[i]])
                    }
                }
                // if (items) {

                //     console.log(response)
                //     setMessages(items);
                // }
            })
    }, []);

    useEffect(() => {
        const subscription = API
            .graphql(graphqlOperation(onCreateMessage))
            .subscribe({
                next: (event) => {
                    console.log(event)
                    setMessages([...messages, event.value.data.onCreateMessage]);
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [messages]);

    const handleChange = (event) => {
        setMessageBody(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const input = {
            channelID: '1',
            author: userInfo.attributes.email,
            body: messageBody.trim(),
            recepient: "keshavpriya@yahoo.com"
        };

        try {
            setMessageBody('');
            await API.graphql(graphqlOperation(createMessage, { input }))
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <div className="container">
            <div className="messages">
                <div className="messages-scroller">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={message.author === userInfo?.attributes?.email ? 'message me' : 'message'}>{message.body}</div>
                    ))}
                </div>
            </div>
            <div className="chat-bar">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="messageBody"
                        placeholder="Type your message here"
                        disabled={userInfo === null}
                        onChange={handleChange}
                        value={messageBody}
                    />
                </form>
            </div>
        </div>
    );
};

export default Chat;


// import Amplify, { API, Auth } from 'aws-amplify'
// import React, { useEffect, useState } from 'react';
// import * as queries from '../graphql/queries';
// import * as mutations from '../graphql/mutations';
// import Button from '@material-ui/core/Button';
// import { graphqlOperation } from '@aws-amplify/api';
// import { messagesByChannelID } from '../graphql/queries';
// import { createMessage } from '../graphql/mutations';
// import { onCreateMessage } from '../graphql/subscriptions'
// import './Chat.css'

// function Chat() {

//     const [messages, setMessages] = useState([]);
//     const [messageBody, setMessageBody] = useState('');
//     const [userInfo, setUserInfo] = useState(null)

//     useEffect(() => {
//         Auth.currentAuthenticatedUser().then((userInfo) => {
//             console.log(userInfo)
//             setUserInfo(userInfo)
//         })
//     }, [])


//     useEffect(() => {
//         API
//             .graphql(graphqlOperation(messagesByChannelID, {
//                 channelID: '1',
//                 sortDirection: 'ASC'
//             }))
//             .then((response) => {
//                 const items = response?.data?.messagesByChannelID?.items;
//                 // console.log(items)
//                 for (let i = 0; i < items.length; i++) {
//                     if (items[i].author == "ap-southeast-2:df199f23-8954-4959-8fa5-8eeb6aa3772c"
//                         || items[i].author == "ap-southeast-2:94c4bd4b-d1cd-45d9-bd0e-bcb0fe6b0897") {
//                         // console.log(items)
//                         setMessages(items)
//                     }
//                 }
//                 // if (items) {

//                 //     console.log(response)
//                 //     setMessages(items);
//                 // }
//             })
//     }, []);

//     useEffect(() => {
//         const subscription = API
//             .graphql(graphqlOperation(onCreateMessage))
//             .subscribe({
//                 next: (event) => {
//                     setMessages([...messages, event.value.data.onCreateMessage]);
//                 }
//             });

//         return () => {
//             subscription.unsubscribe();
//         };
//     }, [messages]);

//     const handleChange = (event) => {
//         setMessageBody(event.target.value);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         event.stopPropagation();

//         const input = {
//             channelID: '1',
//             author: userInfo.id,
//             body: messageBody.trim()
//             // recepient:
//         };

//         try {
//             setMessageBody('');
//             await API.graphql(graphqlOperation(createMessage, { input }))
//         } catch (error) {
//             console.warn(error);
//         }
//     };

//     return (
//         <div className="container">
//             <div className="messages">
//                 <div className="messages-scroller">
//                     {messages.map((message) => (
//                         <div
//                             key={message.id}
//                             className={message.author === userInfo?.id ? 'message me' : 'message'}>{message.body}</div>
//                     ))}
//                 </div>
//             </div>
//             <div className="chat-bar">
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         name="messageBody"
//                         placeholder="Type your message here"
//                         disabled={userInfo === null}
//                         onChange={handleChange}
//                         value={messageBody}
//                     />
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Chat;