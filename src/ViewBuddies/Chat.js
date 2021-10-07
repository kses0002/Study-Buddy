import { API, Auth, container } from 'aws-amplify'
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { graphqlOperation } from '@aws-amplify/api';
import * as queries from '../graphql/queries';
import { createMessage } from '../graphql/mutations';
import { listLatestMessages } from '../graphql/queries';
import { onCreateMessage } from '../graphql/subscriptions'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import * as mutations from '../graphql/mutations';
import './Chat.css'


function Chat({ data, currentUserEmail, handleCurrentMessage }) {
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
    const myFormRef = useRef(null)


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
                if (items != undefined) {
                    for (let i = 0; i < items.length; i++) {
                        if ((items[i].author == currentUserEmail
                            && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                                && items[i].author == recipientEmail)) {
                            setMessages(oldItems => [...oldItems, items[i]])
                        }
                    }
                }
                const element = document.getElementById(messageRef);
                element.scrollTo(0, element.scrollHeight - scrollHeight)
            })
    }, [page]);

    useEffect(() => {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }, [messages]);

    const handleChange = (event) => {
        setMessageBody(event.target.value);

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (messageBody != "") {
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
                handleCurrentMessage(input)
            } catch (error) {
                console.warn(error);
            }



            const latestMessageInput = {
                author: userInfo.attributes.email,
                body: messageBody.trim(),
                recepient: recipientEmail,
                seen: "false",
                buddyPair: currentUserEmail < recipientEmail ? currentUserEmail + recipientEmail
                    : recipientEmail + currentUserEmail

            }

            try {
                let filter = {
                    buddyPair: {
                        eq: currentUserEmail < recipientEmail ? currentUserEmail + recipientEmail :
                            recipientEmail + currentUserEmail
                    },
                    recepient: {
                        eq: recipientEmail
                    }
                };

                await API.graphql({ query: listLatestMessages, variables: { filter: filter } })
                    .then((response) => {
                        if (response.data.listLatestMessages.items.length == 0) {
                            API.graphql({ query: mutations.createLatestMessage, variables: { input: latestMessageInput } });
                        }
                        else {
                            latestMessageInput.id = response.data.listLatestMessages.items[0].id
                            API.graphql({ query: mutations.updateLatestMessage, variables: { input: latestMessageInput } });
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
            }
            catch (error) {
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

    function onEnterPress(e) {
        // if(e.keyCode == 13 && e.shiftKey == false) {
        //     e.preventDefault();
        //     myFormRef.submit();
        //   }
        if (e.key === "Enter" && !e.shiftKey) {
            //e.preventDefault();
            handleSubmit(e)
            // handleSubmit(onSubmit)(); // this won't be triggered
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
                {/* <div className="chat-bar" style={{ height: "204px" }}> */}
                {/* <form onSubmit={handleSubmit} id={myFormRef}> */}
                <form onSubmit={handleSubmit} ref={myFormRef}>
                    {/* <input
                        type="text"
                        name="messageBody"
                        placeholder="Type your message here"
                        disabled={userInfo === null}
                        onChange={handleChange}
                        value={messageBody}
                        autoComplete="off"
                        style={{ height: "100%" }}
                    /> */}
                    <TextareaAutosize
                        // variant="outlined"
                        value={messageBody}
                        placeholder="Type your message here"
                        name="messageBody"
                        maxRows={5}
                        onKeyDown={onEnterPress}
                        // style={{ width: "100%" }}
                        minRows={1}
                        disabled={userInfo === null}
                        onChange={handleChange}
                        autoComplete="off"
                        id="messageBody"
                        className="messageBody"

                    />
                </form>
            </div>
        </div>
    );
};

export default Chat;

