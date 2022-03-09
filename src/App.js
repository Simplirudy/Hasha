import * as React from 'react';
import { useEffect, useState } from 'react';
import { ethers, Wallet, providers } from 'ethers';
import Moralis from 'moralis/dist/moralis.min.js';
import { connect } from '@textile/tableland';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { walletState, setWallet } from './state/wallet/walletSlice';
import { accountState, setAccount } from './state/account/accountSlice';

import { useNavigate, Outlet, NavLink } from 'react-router-dom';

// Components
import {
  Box,
  Button,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';

import {
  Flex,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';

// Pages
import Signup from './pages/Signup';

// Utils
import queryUser from './utils/queryUser';

// Moralis
const serverUrl = 'https://fapdu7n2efpi.usemoralis.com:2053/server';
const appId = 'EgmGxeeT90BC5nWgvfejq80MScVfmfCplq0z98CF';
Moralis.start({ serverUrl, appId });

// Create Tableland Table - this would be performed once like in a initialization function

function tableLand() {}

async function createUsersTable() {
  const privateKey =
    'b4438df26e4c7369368fe58f721d7e2f985e9915bd80091e9bcdeffc22107932';
  const wallet = new Wallet(privateKey);

  const provider = new providers.AlchemyProvider(
    'rinkeby',
    `K_Xt9OWBDy2ZXJyBVbBRmAlMLErENrkP`
  );
  const signer = wallet.connect(provider);
  const tbl = await connect({ network: 'testnet', signer });

  const createResponse = await tbl.create(
    `CREATE TABLE hasha_users_1 (
        id serial, primary key(id),
        username text, 
        address text, 
        registered text,
        level int2,
        xp int2,
        games_played int,
        wins int4,
        losses int4);`
  );

  // id int, primary key(id));`

  console.log('createResponse createUsersTable', createResponse);
  console.log('Table name:', createResponse.name);
}

const TEST_WALLET = '0x634291b543e9D5956f4869f03d836625be945160';
export default function App() {
  let user = Moralis.User.current();

  // Redux
  const dispatch = useDispatch();
  const wallet = useSelector(walletState);
  const account = useSelector(accountState);

  // React Router
  const navigate = useNavigate();

  const [player, setPlayer] = useState({});
  const [usersTable, setUsersTable] = useState('hasha_users_1_337'); // hasha_users_1_288
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Initialise
    //createUsersTable();
    // change in App, Players, Signup

    if (user) {
      signIn(user.get('ethAddress'));
    }
  }, []);

  useEffect(() => {
    console.log('account state', account);
  }, [account]);

  async function signIn(walletAddress) {
    const queriedUser = await queryUser(usersTable, walletAddress);

    dispatch(setWallet(walletAddress));

    // check if account exists
    if (queriedUser.length > 0) {
      dispatch(
        setAccount({
          id: queriedUser[0][0],
          username: queriedUser[0][1],
          wallet: queriedUser[0][2],
          registered: queriedUser[0][3],
          level: queriedUser[0][4],
          xp: queriedUser[0][5],
          games_played: queriedUser[0][6],
          wins: queriedUser[0][7],
          losses: queriedUser[0][8],
        })
      );

      navigate('/home');
    } else {
      navigate('/signup');
    }
  }

  async function connectWallet() {
    if (!user) {
      user = await Moralis.authenticate({ signingMessage: 'Log into Hasha' })
        .then(async (user) => {
          signIn(user.get('ethAddress'));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  async function disconnectWallet() {
    await Moralis.User.logOut();
    dispatch(setWallet(''));
    dispatch(setAccount(null));
    navigate('/');
  }

  return (
    <>
      {account && (
        <header>
          <div className="flex items-end space-x-10">
            <h1 className="text-4xl">
              <NavLink to="home">Hasha</NavLink>
            </h1>
            <nav className="space-x-3 text-xl font-semibold">
              <NavLink
                to="home"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline' : undefined
                }
              >
                Home
              </NavLink>
              <NavLink
                to="play"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline' : undefined
                }
              >
                PLAY
              </NavLink>
              <NavLink
                to="players"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline' : undefined
                }
              >
                Players
              </NavLink>
            </nav>
          </div>

          <div className="space-x-5">
            <span>{account.username}</span>
            {!user ? (
              <Button onClick={connectWallet}>Connect Wallet</Button>
            ) : (
              <>
                <Button onClick={disconnectWallet}>Disconnect</Button>
              </>
            )}
          </div>
        </header>
      )}
      <main>
        {!user && (
          <div className="flex h-screen">
            <div className="m-auto text-center space-y-5">
              <h2 className="text-4xl font-semibold">Hasha</h2>
              <div>
                <Button w={40} onClick={connectWallet}>
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </>
  );
}
