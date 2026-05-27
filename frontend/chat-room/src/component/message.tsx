import "./../assets/style/index.css";

type MessageProps = {
  message: any;
};

function Message({ message }: MessageProps) {
  const currentUser =
    localStorage.getItem("senderId");

  const isSender =
    currentUser === message.senderId ||
    currentUser === message.sender?._id;

  return (
    <div
      className={`chat ${
        isSender ? "chat-end" : "chat-start"
      }`}
    >
      <div
        className={`chat-bubble ${
          isSender
            ? "chat-bubble-info"
            : "chat-bubble-accent"
        }`}
      >
        {message.message}
        {/* <p className="font-extralight">{message.createdAt}</p> */}
      </div>
    </div>
  );
}

export default Message;