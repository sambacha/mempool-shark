module.exports = {
    apps: [{
        name: "init db",
        script: "ts-node ./src/utils/initServer/create-indexes.ts",
        args: "limit"
    }, {
        name: "init tokens",
        script: "ts-node ./src/utils/initServer/init-tokens.ts",
        args: ""
    }, {
        name: "init pools",
        script: "ts-node ./src/utils/initServer/init-pools.ts",
        args: ""
    }, {
        name: "init txs",
        script: "ts-node ./src/utils/initServer/init-whales.ts",
        args: ""
    }]
}
