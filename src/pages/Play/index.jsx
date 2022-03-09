import { useEffect } from 'react';

// Redux
import { useSelector } from 'react-redux';
import { accountState } from '../../state/account/accountSlice';

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
