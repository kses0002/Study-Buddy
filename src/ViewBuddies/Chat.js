import { API, Auth, container } from 'aws-amplify'
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { graphqlOperation } from '@aws-amplify/api';
import { messagesByChannelID } from '../graphql/queries';
import { createMessage } from '../graphql/mutations';
import { onCreateMessage } from '../graphql/subscriptions'
import './Chat.css'
import InfiniteScroll from 'react-infinite-scroller';

function Chat({ data, currentUserEmail }) {

    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const [userInfo, setUserInfo] = useState(null)
    const [recipientEmail = data, setRecipientEmail, emailRef] = useState()

    const [page, setPage] = useState(1);
    const [token, setToken] = useState("");
 
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
                sortDirection: 'DESC'
            }))
            .then((response) => {
                let loadMore = response?.data?.messagesByChannelID?.nextToken
                setToken(loadMore)

                const items = response?.data?.messagesByChannelID?.items;

                for (let i = items.length - 1; i >= 0; i--) {
                    if ((items[i].author == currentUserEmail
                        && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                            && items[i].author == recipientEmail)) {

                        setMessages(oldItems => [...oldItems, items[i]])

                    }
                }
            })
    }, [data]);

    useEffect(() => {

        const subscription = API
            .graphql(graphqlOperation(onCreateMessage))
            .subscribe({
                next: (event) => {
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
        if(page>1){
            window.scrollTo(0, 0)
            return <div ref={elementRef} />;
        }
        else{
        return <div ref={elementRef} />;
        }
        return <div ref={elementRef} />;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }

    const messagesEndRef = useRef(null)

    useEffect(() =>{
        scrollToBottom()
    },[])

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    // useEffect(() => {
    //     if (!isFetching) return;
    //     fetchMoreListItems();
    // }, [isFetching]);

    // const handleScroll = () => {
    //     if (window.innerHeight + document.documentElement.scrollTop + 5=== document.scrollingElement.scrollHeight) 
    //     return;
    //     console.log('Fetch more list items!');
    //     setIsFetching(true);
    // }

    // function fetchMoreListItems() {
    //     console.log(1+1)
    //   }

    function loadMoreMessages() {
        if (token != null) {
            API
                .graphql(graphqlOperation(messagesByChannelID, {
                    channelID: '1',
                    sortDirection: 'DESC',
                    nextToken: token
                }))
                .then((response) => {
                    let loadMore = response?.data?.messagesByChannelID?.nextToken
                    setToken(loadMore)
                    console.log(loadMore)

                    const items = response?.data?.messagesByChannelID?.items;

                    for (let i = items.length - 1; i >= 0; i--) {
                        if ((items[i].author == currentUserEmail
                            && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                                && items[i].author == recipientEmail)) {

                            // console.log(items[i])
                            // setMessages(oldItems => [...oldItems, items[i]])

                        }
                    }
                })
        }
       
    }


    const handleScroll = (event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

        // console.log("ScrollTop: "+scrollTop)
        // console.log("clientHeight: "+clientHeight)
        // console.log("scrollHeight: "+scrollHeight)
        // console.log("")
        // if (scrollHeight - scrollTop === clientHeight && token!=null) {
        if (scrollTop === 0 && token!=null) {
            setPage(prev => prev + 1);
        }
    }

    useEffect(() => {
        const loadUsers = async () => {


            API
                .graphql(graphqlOperation(messagesByChannelID, {
                    channelID: '1',
                    sortDirection: 'DESC',
                    nextToken: token

                }))
                .then((response) => {
                    let loadMore = response?.data?.messagesByChannelID?.nextToken
                    setToken(loadMore)

                    const items = response?.data?.messagesByChannelID?.items;

                    for (let i = 0; i <items.length; i++) {
                        if ((items[i].author == currentUserEmail
                            && items[i].recepient == recipientEmail) || (items[i].recepient == currentUserEmail
                                && items[i].author == recipientEmail)) {

                            setMessages(oldItems => [items[i], ...oldItems])

                        }
                    }
                })
        };

        loadUsers();
        
    }, [page]);

    return (
        <div className="container">
            <div className="messages">
                {/* {console.log(messages)} */}
                <div className="messages-scroller" onScroll={handleScroll}>
                    {messages.map((message) => (

                        <div
                            key={message.id}
                            className={message.author === userInfo?.attributes?.email ? 'message me' : 'message'}>{message.body}
                        </div>

                    ))}
                      <AlwaysScrollToBottom />
                      {/* <div ref={messagesEndRef} /> */}

                    {/* <InfiniteScroll
                        className="messages-scroller"
                        pageStart={0}
                        // initialLoad={false}
                        // isReverse={true}
                        loadMore={loadMoreMessages}
                        // hasMore={isFetching}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                    >
                        {messages.map((message) => (

                            <div
                                key={message.id}
                                className={message.author === userInfo?.attributes?.email ? 'message me' : 'message'}>{message.body}
                            </div>

                        ))}
                      
                    </InfiniteScroll> */}


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