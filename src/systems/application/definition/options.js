import * as X from "xstate"

export const options = {
  actions: {
    "log.errors": console.log,
    "api.initialize": X.assign({
      api: (c, e) => {
        /*
          ======================================
            Initializes Moralis variable, you'll
            need to put server url and application id
            in the context for this to work.
          ======================================
        */
        try {
          const settings = c?.api?.settings
          const Moralis = require("moralis")
          const options = { serverUrl: settings.server, appId: settings.id }
          Moralis.start(options)
          return { ...c?.api, Moralis }
        } catch (e) {}
      }
    }),
    "network.select": X.assign({
      network: (c, e) => {
        /*
          ======================================
            Change selected network.
          ======================================
        */
        const selected = e?.payload
        return { selected }
      }
    }),
    "assign.user": X.assign({
      user: (c, e) => e?.data
    }),
    "assign.user.data": X.assign({
      database: (c, e) => {
        /*
          ======================================
            Updates user object in the context.
          ======================================
        */
        const payload = e?.data
        const user = { ...c?.database?.user, ...payload }
        return { ...c?.database, user }
      }
    })
  },
  activities: {},
  services: {
    "get.current.user": async (c, e) => {
      /*
        ======================================
          Gets current user if they're logged in.
        ======================================
      */
      const Moralis = c?.api?.Moralis
      const user = Moralis.User.current()
      return user ? user : null
    },
    "connect.wallet": async (c, e) => {
      /*
        ======================================
          Connect user's wallet with the app.
          You can change the welcome message
          through `signingMessage` key.
        ======================================
      */
      const provider = e?.payload?.provider
      const Moralis = c?.api?.Moralis
      const message = "Welcome :D"
      const options = { provider, signingMessage: message }
      return Moralis.User.current() ? Moralis.User.current() : await Moralis.Web3.authenticate(options)
    },
    "sign.in.regular": async (c, e) => {
      /*
        ======================================
          If you want to sign in user using
          their email or phone number and a password,
          you should use this function. Modify this according
          to the application that you use.
        ======================================
      */
      const { username, password, email, phone } = e?.payload
      const Moralis = c?.api?.Moralis
      const user = new Moralis.User()
      email ? user.set("email", email) : null
      phone ? user.set("phone", phone) : null
      username ? user.set("username", username) : null
      password ? user.set("password", password) : null
      try {
        await user.signUp()
        return user
      } catch (e) {
        return await Moralis.User.logIn(username, password)
      }
    },
    "set.username.password": async (c, e) => {
      /*
        ======================================
          This function should really be modified
          based on the interface that you want to
          provide. For validations you should be
          using cloud functions.
        ======================================
      */
      const { username, password, email, phone } = e?.payload
      const Moralis = c?.api?.Moralis
      const user = Moralis.User.current()
      email ? user.set("email", email) : null
      phone ? user.set("phone", phone) : null
      username ? user.set("username", username) : null
      password ? user.set("password", password) : null
      try {
        await user.save()
        return user
      } catch (e) {
        return user
      }
    },
    "disconnect.wallet": async (c, e) => {
      /*
        ======================================
          Disconnects the wallet (logs out).
        ======================================
      */
      const Moralis = c?.api?.Moralis
      const user = await Moralis.User.logOut()
      return null
    },
    "database.get.user.transactions": async (c, e) => {
      /*
        ======================================
          Get all user transactions, to get
          chain-wise transactions, you need to
          make the implementaion a bit more flexible.
        ======================================
      */
      const Moralis = c?.api?.Moralis
      const transactions = await Moralis.Web3API.account.getTransactions()
      return { transactions }
    },
    "database.get.user.eth.balance": async (c, e) => {
      /*
        ======================================
          Get ETH balance for the user. You
          can modify the call, by selecting the
          chain the native currency of that chain
          changes, but you'll have to modify the
          implementation a little bit to allow that.
        ======================================
      */
      const Moralis = c?.api?.Moralis
      const ETH = await Moralis.Web3API.account.getNativeBalance()
      const balance = { ...c?.database?.user?.balance, ETH }
      return { balance }
    },
    "database.get.user.erc20.balances": async (c, e) => {
      /*
        ======================================
          Get ERC20 balance for the user.
        ======================================
      */
      const Moralis = c?.api?.Moralis
      const ERC20 = await Moralis.Web3API.account.getTokenBalances()
      const balance = { ...c?.database?.user?.balance, ERC20 }
      return { balance }
    },
    "database.get.user.nft.balances": async (c, e) => {
      /*
        ======================================
          Get NFT data for the user.
        ======================================
      */
      const Moralis = c?.api?.Moralis
      const NFT = await Moralis.Web3API.account.getNFTs()
      const balance = { ...c?.database?.user?.balance, NFT }
      return { balance }
    },
    "database.collection.create.record.private": async (c, e) => {
      /*
        ======================================
          This call needs { collection, query }
          where `query` is the object with keys
          and values that you want to insert in
          the collection. Collection can be accessed
          by anyone, but the record that's inserted
          can only be read or written by the author.
        ======================================
      */
      const Moralis = c?.api?.Moralis
      const Collection = Moralis.Object.extend(e?.payload?.collection)
      const collection = new Collection()
      const author = Moralis.User.current()
      const query = { ...e?.payload?.query, author }

      for (let [key, value] of Object.entries(query)) {
        collection.set(key, value)
      }
      collection.setACL(new Moralis.ACL(author))
      return await collection.save()
    }
  },
  guards: {
    "user.connected": (c, e) => c?.user || e?.data,
    "user.disconnected": (c, e) => !(c?.user || e?.data)
  }
}

export default options
