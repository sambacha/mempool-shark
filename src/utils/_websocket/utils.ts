import 'dotenv/config';
import {Server, Namespace} from 'socket.io';
import express from 'express';
import http from 'http';
import {_log} from '../configs/utils';
import path from 'path';
import 'dotenv/config';
/**import helmet from 'helmet'*/
const app = express();

const distDir = path.join(__dirname, '../../../client_build/');

//app.use(helmet({ contentSecurityPolicy: process.env.NODE_CONFIG_ENV === 'production' ? undefined : false }))

app.disable('x-powered-by');

const SOCKET_OPTS = {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
};

const SOCKET_PORT = process.env.PORT || 3001;

let explorerNS: Namespace<any>;

const emmitChange = (_ACTION: string, fullDocument: any) => {
  try {
    if (fullDocument && _ACTION) {
      const {fromTokenAddress, toTokenAddress, isV2, isV3, isV2Sushi} =
        fullDocument;
      const target = isV2 ? 'v2' : isV3 ? 'v3' : isV2Sushi ? 'v2sh' : null;

      if (target) {
        explorerNS.to(fromTokenAddress + target).emit(_ACTION, fullDocument);
        explorerNS.to(toTokenAddress + target).emit(_ACTION, fullDocument);
      }
    }
  } catch (e: any) {
    _log.error('emmitChange catch', e);
  }
};

const getSpaceFilter = (dexSpaces: any) => {
  try {
    const {isV2, isV3, isV2Sushi} = dexSpaces;
    const array = [];
    if (isV2 && isV2 === true) {
      array.push({isV2: true});
    }
    if (isV3 && isV3 === true) {
      array.push({isV3: true});
    }
    if (isV2Sushi && isV2Sushi === true) {
      array.push({isV2Sushi: true});
    }
    return {
      $or: array,
    };
  } catch (e: any) {
    _log.error('getSpaceFilter catch', e);
  }
  return {};
};

const getAddressFilter = (address: string) => {
  try {
    return {
      $or: [
        {
          fromTokenAddress: address,
        },
        {
          toTokenAddress: address,
        },
        // TODO: in front { checkedPath: address }
      ],
    };
  } catch (e: any) {
    _log.error('getAddressFilter catch', e);
  }
  return {};
};

const startSocketServer = async (serverName: string): Promise<boolean> => {
  return new Promise(resolve => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, SOCKET_OPTS);
    app.use(express.static(distDir));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });

    server.listen(SOCKET_PORT, () => {
      _log.ready(
        `${serverName} on SOCKET_PORT ${SOCKET_PORT} CORS ${SOCKET_OPTS.cors.origin}`,
        'WebApp server on: http://localhost:' + SOCKET_PORT
      );
      explorerNS = io.of('/explorer');
      resolve(true);
    });
  });
};

export {
  explorerNS,
  startSocketServer,
  emmitChange,
  getSpaceFilter,
  getAddressFilter,
};
