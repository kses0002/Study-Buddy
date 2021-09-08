import { API, Auth, container } from 'aws-amplify'
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { graphqlOperation } from '@aws-amplify/api';
import * as queries from '../graphql/queries';
import { createMessage } from '../graphql/mutations';
import { onCreateMessage } from '../graphql/subscriptions'
import './Chat.css'


function Chat({ data, currentUserEmail }) {
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const [userInfo, setUserInfo] = useState(null)
    const [recipientEmail = data, setRecipientEmail, emailRef] = useState()
    const [page, setPage] = useState(1);
    const [token, setToken] = useState("");
    const [scrollHeight, setScrollHeight] = useState(0);
    const [scrollToBottomCheck, setScrollToBottomCheck] = useState(false)

    const messagesEndRef = useRef(null)
    const messageRef = useRef(null)

    useEffect(() => {
        setRecipientEmail(data.emailRef)

    }, [data])

    useEffect(() => {
        Auth.currentUserInfo().then((userInfo) => {
            setUserInfo(userInfo)
        })
    }, [])

    useEffect(() => {
        setMessages([])
        API
            .graphql(graphqlOperation(queries.messageByBuddyPair, {
                buddyPair: currentUserEmail < recipientEmail ? currentUserEmail + recipientEmail :
                    recipientEmail + currentUserEmail,
                sortDirection: 'DESC',
            }
            ))
            .then((response) => {
                let loadMore = response?.data?.messageByBuddyPair?.nextToken
                setToken(loadMore)
                const items = response?.data?.messageByBuddyPair?.items;

                for (let i = 0; i < items.length; i++) {
                    if ((items[i].author == currentUserEmail
                        && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                            && items[i].author == recipientEmail)) {
                        setMessages(oldItems => [...oldItems, items[i]])
                    }
                }
                setScrollToBottomCheck(true)
                setScrollToBottomCheck(false)
            })

    }, [data]);

    useEffect(() => {
        API
            .graphql(graphqlOperation(queries.messageByBuddyPair, {
                buddyPair: currentUserEmail < recipientEmail ? currentUserEmail + recipientEmail :
                    recipientEmail + currentUserEmail,
                nextToken: token,
                sortDirection: 'DESC'
            },
            ))
            .then((response) => {
                let loadMore = response?.data?.messageByBuddyPair?.nextToken
                setToken(loadMore)
                const items = response?.data?.messageByBuddyPair?.items;
                console.log(items)
                for (let i = 0; i < items.length; i++) {
                    if ((items[i].author == currentUserEmail
                        && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                            && items[i].author == recipientEmail)) {
                        setMessages(oldItems => [...oldItems, items[i]])
                    }
                }
                const element = document.getElementById(messageRef);
                element.scrollTo(0, element.scrollHeight - scrollHeight)
            })
    }, [page]);

    useEffect(() => {

        const subscription = API
            .graphql(graphqlOperation(onCreateMessage))
            .subscribe({
                next: (event) => {
                    if ((currentUserEmail == event.value.data.onCreateMessage.author
                        && recipientEmail == event.value.data.onCreateMessage.recepient) ||
                        (recipientEmail == event.value.data.onCreateMessage.author
                            && currentUserEmail == event.value.data.onCreateMessage.recepient)) {
                        setMessages([event.value.data.onCreateMessage, ...messages]);
                    }
                    setScrollToBottomCheck(true)
                    setScrollToBottomCheck(false)
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
        if (messageBody != "") {
            console.log(messageBody)
            const input = {
                author: userInfo.attributes.email,
                body: messageBody.trim(),
                recepient: recipientEmail,
                buddyPair: currentUserEmail < recipientEmail ? currentUserEmail + recipientEmail
                    : recipientEmail + currentUserEmail
            };

            try {
                setMessageBody('');
                await API.graphql(graphqlOperation(createMessage, { input }))
            } catch (error) {
                console.warn(error);
            }

        }
    };

    const AlwaysScrollToBottom = () => {
        const elementRef = React.createRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    const handleScroll = (event) => {
        const { scrollTop } = event.currentTarget;
        const element = document.getElementById(messageRef);
        if (scrollTop === 0 && token != null) {
            setScrollHeight(element.scrollHeight)
            setPage(prev => prev + 1);
        }
    }

    return (
        <div className="container">
            <div className="messages" >
                <div className="messages-scroller" onScroll={handleScroll} id={messageRef}>
                    {[].concat(messages).reverse().map((message) => (
                        <div
                            key={message.id}
                            className={message.author === userInfo?.attributes?.email ? 'message me' : 'message'}>{message.body}
                        </div>
                    ))}
                    {scrollToBottomCheck
                        ? <AlwaysScrollToBottom />
                        : <div></div>
                    }
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
                        autoComplete="off"
                    />
                </form>
            </div>
        </div>
    );
};

export default Chat;

