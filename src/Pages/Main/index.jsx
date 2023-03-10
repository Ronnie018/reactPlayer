import { useState, createContext, useEffect, useReducer } from 'react';
import StyledMain from './styled';
import Leftbar from '../../components/Leftbar';
import Player from '../../components/Player';
import Gun from 'gun';

export const SongListContext = createContext(null);

// const Main = ({}) => {
//   const [SongList, SetSongList] = useState([
//     { name: 'song Name', url: 'songUrl', ID: '123' },
//     { name: 'song Name', url: 'songUrl', ID: '321' },
//     { name: 'song Name', url: 'songUrl', ID: '333' },
//     { name: 'song Name', url: 'songUrl', ID: '353' },
//     { name: 'song Name', url: 'songUrl', ID: '38a' },
//   ]);

//   const [currentSong, setCurrentSong] = useState({
//     name: 'Song Name',
//     url: 'songUrl',
//     ID: '123',
//   });
//   return (
//     <SongListContext.Provider
//       value={{ SetSongList, SongList, currentSong, setCurrentSong }}
//     >
//       <StyledMain className='main outline outline-2 outline-green-500 w-full min-h-screen flex flex-wrap'>
//         <Leftbar />
//         <Player />
//       </StyledMain>
//     </SongListContext.Provider>
//   );
// };

// export default Main;

const gun = Gun({
  peers: ['http://localhost:3030/gun'],
});

const initialState = {
  messages: [],
};

function reducer(state, message) {
  return {
    messages: [...state.messages, message],
  };
}

function Main(props) {
  const [form, setForm] = useState({
    name: 'Ronnie Brito',
    message: '',
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  let running = false;

  useEffect(() => {
    if (running) return;
    running = true;
    const messages = gun.get('messages');
    const idList = [];
    messages.map().on((m) => {
      if (idList.includes(m.createdAt + m.name)) return;
      idList.push(m.createdAt + m.name);
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt,
      });
    });
  }, []);

  function saveMessage() {
    const messages = gun.get('messages');
    messages.set({
      name: form.name,
      message: form.message,
      createdAt: Date.now(),
    });
    setForm(() => ({
      name: 'Ronnie Brito',
      message: '',
    }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveMessage();
      }}
    >
      <label htmlFor='message'>
        message:
        <input
          type='text'
          name='message'
          id='message'
          onChange={(e) => {
            setForm((value) => ({ ...value, message: e.target.value }));
          }}
        />
      </label>
      <div>
        {state.messages.map((message, i) => {
          return (
            <div className='message' key={i}>
              <h2>{message.name}</h2>
              <h3>{message.message}</h3>
              <p>{message.createdAt}</p>
            </div>
          );
        })}
      </div>
      <button type='submit'>send</button>
    </form>
  );
}

export default Main;
