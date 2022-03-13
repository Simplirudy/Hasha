import { useEffect, useState } from 'react';

import { ethers, Wallet, providers } from 'ethers';
import Moralis from 'moralis/dist/moralis.min.js';
import { sequence } from '0xsequence';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { walletState, setWallet } from '../../state/wallet/walletSlice';
import { accountState, setAccount } from '../../state/account/accountSlice';

import { useNavigate, Outlet, NavLink } from 'react-router-dom';

// Utils
import queryUser from '../../utils/queryUser';

// Components
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

export default function Connect() {
  let user = Moralis.User.current();
  let sequenceWallet;
  let connectDetails;

  // Redux
  const dispatch = useDispatch();
  const wallet = useSelector(walletState);
  const account = useSelector(accountState);

  // React Router
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [usersTable, setUsersTable] = useState('hasha_users_1_337');

  useEffect(() => {
    if (!wallet) {
      console.log('No wallet connection.');
    } else {
      navigate('/home');
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
          localStorage.setItem('WALLET_ADDRESS', user.get('ethAddress'));
          console.log(localStorage.getItem('WALLET_ADDRESS'));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  async function connectSequence() {
    sequenceWallet = new sequence.Wallet('polygon');
    connectDetails = await sequenceWallet.connect({
      app: 'Hasha',
    });

    const walletAddress = await sequenceWallet.getAddress();

    signIn(walletAddress);

    console.log('connectDetails', connectDetails);

    sequenceWallet.openWallet();
    localStorage.setItem('WALLET_ADDRESS', walletAddress);
  }

  return (
    <div className="centered">
      <div className="m-auto flex flex-col sm:flex-row items-center">
        {/*<h2 className="text-4xl font-semibold">Hasha</h2>*/}

        <div className="space-y-20 pl-20">
          <h2 className="text-4xl font-bold italic tracking-widest">HASHA</h2>
          <p className="text-4xl">
            The <span className="text-red-500 font-bold">first</span> Web3 tower
            defense game.
          </p>
          <Button
            colorScheme="red"
            className="tracking-widest"
            w={40}
            onClick={onOpen}
            size="lg"
          >
            PLAY NOW
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent className="py-10">
              <ModalCloseButton />
              <ModalHeader>Connect Your Wallet</ModalHeader>
              <ModalBody className="space-y-10">
                <Button
                  width="100%"
                  h={40}
                  colorScheme="orange"
                  onClick={connectWallet}
                >
                  MetaMask
                </Button>
                <Button
                  width="100%"
                  h={40}
                  colorScheme="blue"
                  backgroundColor="blue.800"
                  onClick={connectSequence}
                >
                  Sequence
                </Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
        <img
          src="/img/banner.png"
          alt="Hasha logo"
          className="overflow-hidden"
        />
      </div>
    </div>
  );
}
