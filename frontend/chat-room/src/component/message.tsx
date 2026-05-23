import "./../assets/style/index.css";

type MessageProps = {
  message: any;
};

function Message({ message }: MessageProps) {
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isSender =
    message.senderId === currentUser._id ||
    message.senderId?._id === currentUser._id;

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
      </div>
    </div>
  );
}

export default Message;