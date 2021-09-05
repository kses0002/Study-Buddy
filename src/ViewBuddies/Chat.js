import { API, Auth, container } from 'aws-amplify'
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { graphqlOperation } from '@aws-amplify/api';
import { messagesByChannelID } from '../graphql/queries';
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
    const [loading, setLoading] = useState(true);
    const [scrollHeight, setScrollHeight] = useState(0);


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
            .graphql(graphqlOperation(messagesByChannelID, {
                channelID: '1',
                sortDirection: 'DESC',
                // limit: 20
            }))
            .then((response) => {
                let loadMore = response?.data?.messagesByChannelID?.nextToken
                setToken(loadMore)

                const items = response?.data?.messagesByChannelID?.items;


                for (let i = 0; i < items.length; i++) {
                    if ((items[i].author == currentUserEmail
                        && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                            && items[i].author == recipientEmail)) {
                        setMessages(oldItems => [...oldItems, items[i]])

                    }
                }
            })
    }, [data]);

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            const element = document.getElementById(messageRef);

            setLoading(false);
        };

        API
            .graphql(graphqlOperation(messagesByChannelID, {
                channelID: '1',
                sortDirection: 'DESC',
                // limit: 20,
                nextToken: token

            }))
            .then((response) => {
                let loadMore = response?.data?.messagesByChannelID?.nextToken
                setToken(loadMore)

                const items = response?.data?.messagesByChannelID?.items;

                for (let i = 0; i < items.length; i++) {
                    if ((items[i].author == currentUserEmail
                        && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                            && items[i].author == recipientEmail)) {

                        setMessages(oldItems => [...oldItems, items[i]])

                    }
                }
                const element = document.getElementById(messageRef);
                console.log(element.scrollHeight)
                element.scrollTo(0, element.scrollHeight - scrollHeight)
            })


        loadUsers();


    }, [page]);

    useEffect(() => {

        const subscription = API
            .graphql(graphqlOperation(onCreateMessage))
            .subscribe({
                next: (event) => {
                    setMessages([event.value.data.onCreateMessage, ...messages]);
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
            recepient: recipientEmail
        };

        try {
            setMessageBody('');
            await API.graphql(graphqlOperation(createMessage, { input }))
        } catch (error) {
            console.warn(error);
        }
    };

    const AlwaysScrollToBottom = () => {
        const elementRef = React.createRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }



    useEffect(() => {
        scrollToBottom()
    }, [messages])


    const handleScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

        const element = document.getElementById(messageRef);
        // console.log(element)
        // console.log(element.scrollHeight)
        // console.log(element.scrollTop)
        // console.log(element.scrollHeight-(element.scrollHeight/2 - element.clientHeight))

        // console.log(event.currentTarget)
        // console.log("ScrollTop: "+scrollTop)
        // console.log("clientHeight: "+clientHeight)
        // console.log("scrollHeight: "+scrollHeight)
        // console.log("")
        // if (scrollHeight - scrollTop === clientHeight && token!=null) {
        // console.log("Page: "+page)
        if (scrollTop === 0 && token != null) {
            // console.log(token)
            setScrollHeight(element.scrollHeight)
            console.log(element.scrollHeight)
            setPage(prev => prev + 1);

        }
    }

    return (
        <div className="container">
            <div className="messages" >
                {/* {console.log(messages)} */}
                <div className="messages-scroller" onScroll={handleScroll} id={messageRef}>
                    {/* {messages.map((message) => ( */}
                    {loading && <div>Loading ...</div>}
                    {[].concat(messages).reverse().map((message) => (
                        <div
                            key={message.id}
                            className={message.author === userInfo?.attributes?.email ? 'message me' : 'message'}>{message.body}
                        </div>
                    ))}

                    {userInfo == null
                        ? <AlwaysScrollToBottom />
                        : <div></div>
                    }

                    {/* <div ref={messagesEndRef} /> */}

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

