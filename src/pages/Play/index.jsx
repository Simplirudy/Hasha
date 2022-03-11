import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';
import { accountState } from '../../state/account/accountSlice';
import { walletState } from '../../state/wallet/walletSlice';

import { Helmet } from 'react-helmet-async';

// Components
import { Button } from '@chakra-ui/react';

const divStyle = {
  // position: 'absolute',
  width: '100%',
  height: '100%',
  margin: 'auto',
};

export default function Play() {
  const account = useSelector(accountState);
  const wallet = useSelector(walletState);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(account);

    if (!wallet) {
      navigate('/connect');
    } else if (!account) {
      navigate('/');
    }
  });

  return (
    <>
      <Helmet>
        <script src="Build/UnityLoader.js"></script>
        <script>
          UnityLoader.instantiate("unityContainer", "Build/Release.json");
        </script>
      </Helmet>
      <div id="unityContainer" style={divStyle}></div>
    </>
  );
}
