import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';
import LogTalk from './log-talk.js';

const logger = new LogTalk();
const publishing = document.getElementById('publishing');
const subscribing = document.getElementById('subscribing');

const { searchParams } = new URL(document.location);

const query = {
  roomId: searchParams.get('roomId'),
  userName: searchParams.get('userName'),
};
const socket = io("ws://localhost:80", { query, transports: ['websocket'] });
logger.info('Try to connect socket', query);

socket.on('connect', () => {
  logger.info('Socket is connected', {
    recovered: socket.recovered,
  });
});
socket.on('create-room', (data) => {
  const { roomId } =  data;
  logger.info(`Room ${roomId} was created`);
});
socket.on('delete-room', (data) => {
  const { roomId } =  data;
  logger.info(`Room ${roomId} was deleted`);
});
socket.on('join-room', (data) => {
  const { id, roomId, messages } = data;
  logger.info(`Socket ${id} has joined room ${roomId}`, data);
  const nodes = messages.forEach(({ userName, message }) => renderMessage(userName, message));
});
socket.on('message', (data) => {
  const { userName, message } = data;
  logger.info(`Receive ${userName}'s message "${message}"`);
  renderMessage(userName, message);
});

function onSubmitMessage(e) {
  event.preventDefault();
  const data = { message: publishing.value }
  socket.emit('message', data);
  logger.info('Send message', 'message');
  publishing.value = '';
}

function renderMessage(userName, message) {
  const div = document.createElement('div');
  div.className = 'p-2 border-b overflow-hidden leading-loose';
  div.append(`${userName}: ${message}`);
  subscribing.append(div);
}

function timeString(date) {
  const ms = ('00' + date.getMilliseconds()).slice(-3);
  return `${date.toLocaleString('ja-JP')}.${ms}`;
}

window.onSubmitMessage = onSubmitMessage;
