// import MessageItem from "./MessageItem";

// const messages = [
//   { sender: "you", text: "안녕하세요 내일 추가 시술 가능할까요?" },
//   { sender: "me", text: "안녕하세요 하늘님:)" },
//   {
//     sender: "me",
//     text: "아쉽지만 바로 다음 시간대에 다른 시술이 예정되어 있어서 임의로 연장하기는 쉽지 않을 것 같아요ㅜㅜ",
//   },
// ];

// export default function MessageList() {
//   return (
//     <div className="flex-1 space-y-2 overflow-y-auto py-2">
//       {messages.map((message, index) => {
//         const isLastOfSender =
//           index === messages.length - 1 ||
//           messages[index + 1].sender !== message.sender;

//         return (
//           <MessageItem
//             key={index}
//             sender={message.sender}
//             text={message.text}
//             isLastOfSender={isLastOfSender}
//           />
//         );
//       })}
//     </div>
//   );
// }
