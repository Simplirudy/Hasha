import { useEffect, useState } from 'react';

import { ethers, Wallet, providers } from 'ethers';
import Moralis from 'moralis/dist/moralis.min.js';
import { connect } from '@textile/tableland';

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

export default function Tournaments() {
  return (
    <div className="pt-40">
      <img src="/img/denied.png" alt="Access denied" className="mx-auto" />
      <div className="space-y-3">
        {/*<div className="bg-gray-800 w-100 h-20 rounded"></div>
        <div className="bg-gray-800 w-100 h-20 rounded"></div>
        <div className="bg-gray-800 w-100 h-20 rounded"></div>
  <div className="bg-gray-800 w-100 h-20 rounded"></div>*/}
      </div>
    </div>
  );
}
