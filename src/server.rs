//! `ChatServer` is an actor. It maintains list of connection client session.

use actix::prelude::*;

use std::collections::HashMap;
use uuid::Uuid;
use serde::{Serialize, Deserialize};


/// Chat server sends this messages to session
#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

/// Message for chat server communications

/// New chat session is created
#[derive(Message)]
#[rtype(result = "Uuid")]
pub struct Connect {
    pub addr: Recipient<Message>,
}

/// Session is disconnected
#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: Uuid,
}

/// Send message to specific room
#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientMessage {
    /// Id of the client session
    pub id: Uuid,
    /// Peer message
    pub msg: String,
}

#[derive(Deserialize, Clone)]
struct TextMessage {
    event_type: String,
    message: String,
}

#[derive(Serialize)]
struct BroadcastTextMessage {
    sender: Uuid,
    event_type: String,
    message: String,
}

#[derive(Deserialize, Clone)]
struct MouseMessage {
    event_type: String,
    mouse_x: isize,
    mouse_y: isize,
}

#[derive(Serialize)]
struct BroadcastMouseMessage {
    sender: Uuid,
    event_type: String,
    mouse_x: isize,
    mouse_y: isize,
}

#[derive(Deserialize, Clone)]
enum ChatMessage {
    MouseMessage(MouseMessage),
    TextMessage(TextMessage),
}

/// `ChatServer` manages chat rooms and responsible for coordinating chat
/// session. implementation is super primitive
pub struct ChatServer {
    sessions: HashMap<Uuid, Recipient<Message>>,
}

impl ChatServer {
    pub fn new() -> ChatServer {
        ChatServer {
            sessions: HashMap::new(),
        }
    }
}

impl ChatServer {
    /// Send message to all users in the room
    fn broadcast_message(&self, chat_message: ChatMessage, sender_id: Uuid) {
        for (id, addr) in &self.sessions {
            if *id == sender_id {
                continue;
            }

            let cm = chat_message.clone();
            let message = match cm {
                ChatMessage::TextMessage(m) => serde_json::to_string(&BroadcastTextMessage {
                    sender: sender_id,
                    event_type: m.event_type,
                    message: m.message,
                }),
                ChatMessage::MouseMessage(m) => serde_json::to_string(&BroadcastMouseMessage {
                    sender: sender_id,
                    event_type: m.event_type,
                    mouse_x: m.mouse_x,
                    mouse_y: m.mouse_y,
                }),
            };

            if let Ok(message) = message {
                if let Err(e) = addr.do_send(Message(message.to_owned())) {
                    println!("Unable to broadcast message. Error: {:?}", e);
                }
            }
        }
    }

    fn send_message(&self, text_message: TextMessage, to_id: Uuid) {
        if let Some(addr) = self.sessions.get(&to_id) {

            let message = serde_json::to_string(&BroadcastTextMessage {
                sender: Uuid::nil(),
                event_type: text_message.event_type,
                message: text_message.message,
            }).unwrap();

            if let Err(e) = addr.do_send(Message(message.to_owned())) {
                println!("Unable to send message. Error: {:?}", e);
            }
        } else {
            println!("Couldn't find session \"{}\" to send message to.", to_id);
        }
    }
}

/// Make actor from `ChatServer`
impl Actor for ChatServer {
    /// We are going to use simple Context, we just need ability to communicate
    /// with other actors.
    type Context = Context<Self>;
}

/// Handler for Connect message.
///
/// Register new session and assign unique id to this session
impl Handler<Connect> for ChatServer {
    type Result = MessageResult<Connect>;

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        // notify all users in same room
        self.broadcast_message(ChatMessage::TextMessage(TextMessage {
            event_type: "someone_joined".to_string(),
            message: "Someone joined".to_string(),
        }), Uuid::nil());

        // register session id with websocket
        let id = Uuid::new_v4();
        self.sessions.insert(id, msg.addr);

        // Notify the user of what their id is
        self.send_message(TextMessage {
            event_type: "connected".to_string(),
            message: format!("Your id is: {}", id),
        }, id);

        // send id back
        MessageResult(id)
    }
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        println!("Someone disconnected: {}", msg.id);

        self.broadcast_message(ChatMessage::TextMessage(TextMessage {
            event_type: "disconnect".to_string(),
            message: "Someone disconnected".to_string(),
        }), msg.id);

        // remove address
        self.sessions.remove(&msg.id);
    }
}



/// Handler for Message message.
impl Handler<ClientMessage> for ChatServer {
    type Result = ();

    fn handle(&mut self, msg: ClientMessage, _: &mut Context<Self>) {
        if let Ok(mouse_message) = serde_json::from_str::<MouseMessage>(msg.msg.as_str()) {
            println!("Sending mouse message");
            self.broadcast_message(ChatMessage::MouseMessage(mouse_message), msg.id);
        }
        else if let Ok(text_message) = serde_json::from_str::<TextMessage>(msg.msg.as_str()) {
            println!("Sending text message");
            self.broadcast_message(ChatMessage::TextMessage(text_message), msg.id);
        }
    }
}
