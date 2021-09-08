module.exports = commands() {
initdb: 'npx ts-node ./src/utils/initServer/create-indexes.ts',
inittokens: 'npx ts-node ./src/utils/initServer/init-tokens.ts',
initpools: 'npx ts-node ./src/utils/initServer/init-pools.ts',
inittxs: 'npx ts-node ./src/utils/initServer/init-whales.ts',
dev-common: 'npx ts-node-dev ./src/listener-commons.ts',
dev-mempool: 'npx ts-node-dev ./src/listener-mempool.ts',
dev-confirm: 'npx ts-node-dev ./src/listener-confirmation.ts',
dev-ws: 'npx ts-node-dev ./src/_websocket-server.ts',
init-heroku: 'npx ts-node ./src/utils/initServer/set-heroku.ts',
reset-hard: 'npx ts-node ./src/utils/dev-utils/drop-transactions.ts',
reset-txs: 'npx ts-node ./src/utils/dev-utils/reset-transactions.ts',
reset-txc: 'npx ts-node ./src/utils/dev-utils/reset-transactions-c.ts',
reset-txp: 'npx ts-node ./src/utils/dev-utils/reset-transactions-p.ts',
reset-t-h: 'npx ts-node ./src/utils/dev-utils/reset-transactions-t-h.ts',
reset-pools: 'npx ts-node ./src/utils/dev-utils/reset-pools.ts',
reset-blocks: 'npx ts-node ./src/utils/dev-utils/reset-blocks.ts',
reset-tokens: 'npx ts-node ./src/utils/dev-utils/reset-tokens.ts',
web-worker: 'node ./dist/_websocket-server.js',
worker-common: ' node ./dist/listener-commons.js',
worker-mempool: 'node ./dist/listener-mempool.js',
worker-confirm: 'node ./dist/listener-confirmation.js',
run-workers: 'npm run-script worker-common && npm run-mempool && npm run-script worker-confirm',
clean: 'npx gts clean',
lint: 'npx gts lint',
build: 'npx tsc -b',
compile: 'NODE_ENV=production npx tsc -b',
fix: 'npx gts fix',
testdb: 'npm run init-db',
pretest: 'npm run-script init-tokens && npm run-script init-txs',
posttest: 'npm run lint'
};