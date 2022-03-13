import * as React from 'react';
import { useEffect, useState } from 'react';
import { ethers, Wallet, providers } from 'ethers';
import Moralis from 'moralis/dist/moralis.min.js';
import { sequence } from '0xsequence';
import { connect } from '@textile/tableland';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { walletState, setWallet } from './state/wallet/walletSlice';
import { accountState, setAccount } from './state/account/accountSlice';
import { tableState } from './state/table/tableSlice';

import { useNavigate, useLocation, Outlet, NavLink } from 'react-router-dom';

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
  Tooltip,
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
  Avatar,
  AvatarBadge,
  AvatarGroup,
} from '@chakra-ui/react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
        losses int4,
        avatar text);`
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
  const tableId = useSelector(tableState);

  // React Router
  const navigate = useNavigate();
  const location = useLocation();

  const [player, setPlayer] = useState({});
  const [usersTable, setUsersTable] = useState(tableId); // hasha_users_1_337 OLD with 5 accounts
  const [allUsers, setAllUsers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [sequenceUser, setSequenceUser] = useState('');
  let sequenceWallet;
  let connectDetails;

  // check active Sequence connection
  useEffect(() => {
    // Initialise
    //createUsersTable();

    if (localStorage.getItem('WALLET_ADDRESS')) {
      signIn(localStorage.getItem('WALLET_ADDRESS'));
    } else {
      navigate('/connect');
    }
  }, []);

  async function signIn(walletAddress) {
    const queriedUser = await queryUser(usersTable, walletAddress);

    dispatch(setWallet(walletAddress));

    console.log('dispatching');

    console.log('queriedUser', queriedUser);

    // check if account exists
    if (queriedUser && queriedUser.length > 0) {
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
          avatar: queriedUser[0][9],
        })
      );
      navigate('/home');
    } else {
      navigate('/signup');
    }
  }

  useEffect(() => {
    console.log('account state', account);
  }, [account]);

  async function disconnectWallets() {
    await Moralis.User.logOut();
    sequenceWallet = new sequence.Wallet('polygon');
    sequenceWallet.disconnect();

    dispatch(setWallet(null));
    dispatch(setAccount(null));
    setSequenceUser('');
    localStorage.removeItem('WALLET_ADDRESS');
    navigate('/connect');
  }

  async function openWallet() {
    sequenceWallet = new sequence.Wallet('polygon');
    sequenceWallet.connect({
      app: 'Hasha',
    });
    sequenceWallet.openWallet();
  }

  return (
    <>
      <div className="p-5 flex flex-col min-h-screen  text-white overflow-hidden">
        <header>
          <div className="flex items-center space-x-10">
            <h1 className="font-bold">
              <NavLink to="home">
                <img
                  src="/img/hasha-logo-white.png"
                  alt="Hasha logo"
                  className="mx-auto"
                  width="80px"
                  title="Hasha"
                />
              </NavLink>
            </h1>
            <nav className="space-x-3 sm:space-x-10 text-xl tracking-tight font-semibold ">
              <NavLink
                to="leaderboard"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline text-white' : undefined
                }
              >
                Leaderboard
              </NavLink>
              <NavLink
                to="tournaments"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline text-white' : undefined
                }
              >
                Tournaments
              </NavLink>
              <NavLink
                to="inventory"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline text-white' : undefined
                }
              >
                Inventory
              </NavLink>
              <NavLink
                to="briefingroom"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline text-white' : undefined
                }
              >
                Briefing Room
              </NavLink>
              <NavLink
                to="simulationroom"
                className={({ isActive }) =>
                  isActive ? 'font-bold underline text-white' : undefined
                }
              >
                Simulation Room
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-5">
            {account && (
              <>
                <span>{account && account.username}</span>
                <Avatar name="John Smith" src={account.avatar} />
              </>
            )}

            {wallet && (
              <>
                <Button colorScheme="teal" onClick={openWallet}>
                  Wallet
                </Button>
                <Button colorScheme="red" onClick={disconnectWallets}>
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </header>

        <main className="flex-auto">
          <Outlet />
        </main>

        {/*<footer className=" text-center">
          <div className="text-center space-x-5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer noopener nofollow"
              aria-label="Twitter"
            >
              <div className="inline-block align-middle opacity-80 hover:opacity-100 transition duration-200 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="20.305"
                >
                  <path
                    d="M22.43 5.06c.016.222.016.444.016.666A14.478 14.478 0 0 1 7.868 20.304 14.479 14.479 0 0 1 0 18.004a10.6 10.6 0 0 0 1.237.063A10.261 10.261 0 0 0 7.6 15.879a5.133 5.133 0 0 1-4.791-3.553 6.461 6.461 0 0 0 .968.079 5.419 5.419 0 0 0 1.348-.174 5.124 5.124 0 0 1-4.109-5.029v-.063a5.16 5.16 0 0 0 2.316.65A5.131 5.131 0 0 1 1.745.936 14.564 14.564 0 0 0 12.31 6.297a5.784 5.784 0 0 1-.127-1.178 5.129 5.129 0 0 1 8.867-3.5A10.088 10.088 0 0 0 24.3.38a5.11 5.11 0 0 1-2.253 2.824A10.272 10.272 0 0 0 25 2.411a11.014 11.014 0 0 1-2.57 2.649Z"
                    fill="black"
                  />
                </svg>
              </div>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer noopener nofollow"
              aria-label="GitBook"
            >
              <div className="inline-block align-middle opacity-80 hover:opacity-100 transition duration-200 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  xmlSpace="preserve"
                >
                  <switch>
                    <g>
                      <path
                        d="M28.8 47.4c1 0 1.9.8 1.9 1.9 0 1-.8 1.9-1.9 1.9-1 0-1.9-.8-1.9-1.9 0-1.1.9-1.9 1.9-1.9m29.4-11.6c-1 0-1.9-.8-1.9-1.9 0-1 .8-1.9 1.9-1.9 1 0 1.9.8 1.9 1.9 0 1-.9 1.9-1.9 1.9m0-7.7c-3.2 0-5.8 2.6-5.8 5.8 0 .6.1 1.2.3 1.8L33.6 45.9c-1.1-1.6-2.9-2.5-4.8-2.5-2.2 0-4.2 1.3-5.2 3.2l-17.2-9c-1.8-1-3.2-3.9-3-6.7.1-1.4.6-2.5 1.3-2.9.5-.3 1-.2 1.7.1l.1.1c4.6 2.4 19.5 10.2 20.1 10.5 1 .4 1.5.6 3.2-.2l30.8-16c.5-.2 1-.6 1-1.3 0-.9-.9-1.3-.9-1.3-1.8-.8-4.5-2.1-7.1-3.3C48 14 41.6 11 38.8 9.5c-2.4-1.3-4.4-.2-4.7 0l-.7.3C20.7 16.2 3.9 24.5 2.9 25.1c-1.7 1-2.8 3.1-2.9 5.7-.2 4.1 1.9 8.4 4.9 9.9l18.2 9.4c.4 2.8 2.9 5 5.7 5 3.2 0 5.7-2.5 5.8-5.7l20-10.8c1 .8 2.3 1.2 3.6 1.2 3.2 0 5.8-2.6 5.8-5.8 0-3.3-2.6-5.9-5.8-5.9"
                        fill="black"
                      />
                    </g>
                  </switch>
                </svg>
              </div>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer noopener nofollow"
              aria-label="GitHub"
            >
              <div className="inline-block align-middle opacity-80 hover:opacity-100 transition duration-200 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24.375"
                >
                  <path
                    d="M8.362 19.628c0 .1-.116.181-.262.181-.166.015-.282-.066-.282-.181 0-.1.116-.181.262-.181.151-.016.282.065.282.181Zm-1.568-.227c-.035.1.066.217.217.247a.236.236 0 0 0 .313-.1c.03-.1-.066-.217-.217-.262a.259.259 0 0 0-.313.115Zm2.228-.086c-.146.035-.247.131-.232.247.015.1.146.166.3.131s.247-.131.232-.232-.154-.161-.3-.146ZM12.339.001A12.086 12.086 0 0 0 0 12.299a12.637 12.637 0 0 0 8.543 12.056c.645.116.872-.282.872-.61 0-.312-.015-2.036-.015-3.095 0 0-3.528.756-4.269-1.5 0 0-.575-1.467-1.4-1.845 0 0-1.154-.791.081-.776a2.661 2.661 0 0 1 1.946 1.3 2.664 2.664 0 0 0 3.672 1.053 2.8 2.8 0 0 1 .806-1.7c-2.818-.312-5.66-.721-5.66-5.57a3.82 3.82 0 0 1 1.19-2.969A4.762 4.762 0 0 1 5.9 5.222c1.053-.328 3.478 1.361 3.478 1.361a11.907 11.907 0 0 1 6.331 0s2.424-1.694 3.478-1.361a4.76 4.76 0 0 1 .131 3.422 3.918 3.918 0 0 1 1.3 2.969c0 4.864-2.969 5.252-5.786 5.57a2.981 2.981 0 0 1 .857 2.339c0 1.7-.015 3.8-.015 4.214 0 .328.232.726.872.61A12.52 12.52 0 0 0 25 12.299 12.359 12.359 0 0 0 12.339.001ZM4.9 17.385c-.066.05-.05.166.035.262.081.081.2.116.262.05.066-.05.05-.166-.035-.262-.081-.081-.197-.116-.262-.05Zm-.544-.408c-.035.066.015.146.116.2a.15.15 0 0 0 .217-.035c.035-.066-.015-.146-.116-.2-.102-.031-.183-.016-.218.034Zm1.633 1.794c-.081.066-.05.217.066.313.116.116.262.131.328.05.066-.066.035-.217-.066-.313-.117-.116-.264-.131-.329-.05Zm-.575-.741c-.081.05-.081.181 0 .3s.217.166.282.116a.23.23 0 0 0 0-.313c-.071-.118-.202-.169-.283-.103Z"
                    fill="black"
                  />
                </svg>
              </div>
            </a>
          </div>
            </footer>*/}
      </div>
    </>
  );
}
