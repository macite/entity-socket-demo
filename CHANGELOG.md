# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.0.1 (2023-03-10)


### Features

* add ability to add and delete users ([02cfb98](https://github.com/macite/entity-socket-demo/commit/02cfb98f3e4431a04fa9dfd56d98a0b054a12ce1))
* add ability to filter user responses from api ([12728ed](https://github.com/macite/entity-socket-demo/commit/12728ed0c84ade07d90027ca68eefa477eeb9ece))
* add ability to include async calls in mapping process ([ebd7e0c](https://github.com/macite/entity-socket-demo/commit/ebd7e0c06b4d7196952d62b8456efbada50b8549))
* add ability to observe cache ([b3c2123](https://github.com/macite/entity-socket-demo/commit/b3c212314ab005df3fe37b8f464dab2b1a897e4b))
* add ability to specify how get requests interact with the cache ([b1accb8](https://github.com/macite/entity-socket-demo/commit/b1accb810e9356e3655662292d5965340dcd4c0a))
* add callback on mapping complete ([7ba4ae6](https://github.com/macite/entity-socket-demo/commit/7ba4ae61a0c8081c398167d8b0067e32e7e94acd))
* add initial grape api ([a51f9fa](https://github.com/macite/entity-socket-demo/commit/a51f9faa66eefed0fa22016e734216b7608164d3))
* add source cache to lookup entity on build ([1ac4964](https://github.com/macite/entity-socket-demo/commit/1ac49648b6a28e75a428ae906b48071e434b1bae))
* add user model ([ef9704e](https://github.com/macite/entity-socket-demo/commit/ef9704e03069f82866c7bc8132591e29ce798faf))
* Allow delete to define format of response ([203f6fd](https://github.com/macite/entity-socket-demo/commit/203f6fd6ceb3879d5448c7d524f2b80fe95b6d02))
* constructor params in options and iteration on cache ([3e1d63a](https://github.com/macite/entity-socket-demo/commit/3e1d63a70ed2fa07009a9aa065786df0027e5f78))
* enhance mapping functions in entity ([5957e35](https://github.com/macite/entity-socket-demo/commit/5957e355a9645b1b063a0f522cb8d92658ba030a))
* enhance path creation ([a25599b](https://github.com/macite/entity-socket-demo/commit/a25599b8f1f4e659646f81b0fa08198d77bf6c58))
* extend message entity to test additional service functionality ([7521dd2](https://github.com/macite/entity-socket-demo/commit/7521dd2bdf86bf0298a3af1157865556b9f13a4c))
* front-end messaging ([185b564](https://github.com/macite/entity-socket-demo/commit/185b564f6e6ea7371d0302e81888257dd6cb85f0))
* improve cached response with entity caches ([58b5f84](https://github.com/macite/entity-socket-demo/commit/58b5f84478a1007310e3b7207ac89fa47328565f))
* Messaging back-end in Ruby ([024b893](https://github.com/macite/entity-socket-demo/commit/024b893d447a65e0b2d17359e45bf1590af60e8b))
* register get queries with cache ([bcfc73c](https://github.com/macite/entity-socket-demo/commit/bcfc73c45c73c190c6d49f9793faee5e46907d0e))
* simplify mapping process ([ec4a65a](https://github.com/macite/entity-socket-demo/commit/ec4a65a3098204b358256809943c253a674fa532))
* to json includes only changes by default ([a5de2c0](https://github.com/macite/entity-socket-demo/commit/a5de2c0b17528214ea854c5d2601ae5034402f0c))
* update fetch and get behaviour ([757ca89](https://github.com/macite/entity-socket-demo/commit/757ca895906263ffb6f1b6d6debceceed7591e03))
* whitelist keys to map to json ([53470be](https://github.com/macite/entity-socket-demo/commit/53470bed7f7f4512097b989039b8fa9a908d1a75))


### Bug Fixes

* add id to user to enable delete ([06597e0](https://github.com/macite/entity-socket-demo/commit/06597e055d20e041c4a4bfefdee03b242d3a7726))
* allow key to be number or string ([64fb9c1](https://github.com/macite/entity-socket-demo/commit/64fb9c1ae2fa7261397afd8145990174c7ee207a))
* Apply fixes for ActionCable chat channels ([97b00eb](https://github.com/macite/entity-socket-demo/commit/97b00ebdbd3290d3eb2cd99aabdb0215d33adeb8))
* build instance uses source and options cache ([eeef299](https://github.com/macite/entity-socket-demo/commit/eeef2997278a37d746627986b7c28815f542a1a0))
* chat channel and message broadcast ([9a23fcb](https://github.com/macite/entity-socket-demo/commit/9a23fcb4f34694aef7de4fd1fea152edfbba86b1))
* correct fetch all and query to match get and fetch ([06dd4ff](https://github.com/macite/entity-socket-demo/commit/06dd4ff4394e90dabe7f5924147bc1e049d718c0))
* correct issue in getting path ids from object ([b4707c1](https://github.com/macite/entity-socket-demo/commit/b4707c15436522767e2b9bc73fe8b119b76f3923))
* correct package lock using node 14 ([e97d6bc](https://github.com/macite/entity-socket-demo/commit/e97d6bce2af838e791d9a95aad4ee7cf46633a94))
* correct reporting of errors in api ([306def5](https://github.com/macite/entity-socket-demo/commit/306def5afe835fc9332c62f39bd722e1bce6d25e))
* correct version tag in dependencies ([2eaa84a](https://github.com/macite/entity-socket-demo/commit/2eaa84a09fb8bb49d9f61c40379d1176c94a0ff8))
* ensure body works with non-entities ([ad88457](https://github.com/macite/entity-socket-demo/commit/ad88457af9ae11fdd78182723d8aa52033ffffd5))
* ensure entity id from path ids works for numbers ([b9ad5c6](https://github.com/macite/entity-socket-demo/commit/b9ad5c69acbe48d649685dc3f28c2c02d2ab9cba))
* ensure onQueryCacheReturn all works when query needs call ([5a86ae5](https://github.com/macite/entity-socket-demo/commit/5a86ae540603e8ebfb74afe12ca6e99d2bbd8336))
* ensure pathIds passed to all api urls ([15754a7](https://github.com/macite/entity-socket-demo/commit/15754a7ae2244b389b129c0a28542b8302725ef8))
* ensure pid removal wont fail if no pid ([8b84dc3](https://github.com/macite/entity-socket-demo/commit/8b84dc3c577928bdfa11f21b3dd224ddc3d2a57d))
* ensure that entity cache uses key in getOrCreate ([16ef44c](https://github.com/macite/entity-socket-demo/commit/16ef44c9da2f1508150eeabc5aa2570d2b3d296a))
* ensure that path components are encoded ([ddcef85](https://github.com/macite/entity-socket-demo/commit/ddcef859bc93d57aa4cb0f943aee900b57279d41))
* mapping complete is called for cached response ([198e27f](https://github.com/macite/entity-socket-demo/commit/198e27feb04fd546ee590e007142d2288fa86d0b))
* remove string conversion for key in cache update to 0.0.22 ([3e3799e](https://github.com/macite/entity-socket-demo/commit/3e3799ea2e4166ef4bb7179851a47fd547ae49c0))
* remove user identification in connection ([d80d4ba](https://github.com/macite/entity-socket-demo/commit/d80d4ba36101d6b2e39a37fa6ff88b8e07156f4d))
* switch entity mapping function to send jsonKey ([ff76883](https://github.com/macite/entity-socket-demo/commit/ff76883c12942f6c4508ce0b2a9eab7a87450383))
* switch to short term observables ([51ad0a2](https://github.com/macite/entity-socket-demo/commit/51ad0a27c76d6b7defc2a51c81494d3c86f83dac))
* update message service with new framework model ([9b96b89](https://github.com/macite/entity-socket-demo/commit/9b96b894a3a384fbedc41479953828c3fecb27fa))
* update version and map fetch all to return array ([7d237f5](https://github.com/macite/entity-socket-demo/commit/7d237f5a1662f21d59ef67e73d07eb1d2cb26af8))
