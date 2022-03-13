import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';
import { accountState } from '../../state/account/accountSlice';
import { walletState } from '../../state/wallet/walletSlice';

// Unity
import Unity, { UnityContext } from 'react-unity-webgl';
import { Helmet } from 'react-helmet-async';

// Components
import { Button } from '@chakra-ui/react';

const unityContext = new UnityContext({
  loaderUrl: 'Build/Build.loader.js',
  dataUrl: 'Build/Build.data',
  frameworkUrl: 'Build/Build.framework.js',
  codeUrl: 'Build/Build.wasm',
});

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

  // pass down wallet address and username to game
  useEffect(() => {
    unityContext.on('loaded', () => {
      setTimeout(() => {
        unityContext.send('Canvas', 'SetUserName', account.username);
        unityContext.send('Canvas', 'SetWalletAddress', account.wallet);
      }, 5000);
    });
  }, []);

  return (
    <div style={divStyle}>
      <Unity unityContext={unityContext} style={divStyle} />
      <Button
        className="mt-5"
        colorScheme="blue"
        onClick={() => unityContext.setFullscreen(true)}
      >
        Fullscreen
      </Button>
    </div>
  );
}

{
  /* 
<script src="Build/UnityLoader.js"></script>
        <script>
          UnityLoader.instantiate("unityContainer", "Build/Release.json");
        </script>

*/
}
