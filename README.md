# hackforplay-embed
To provide an environment for executing the content of the open source HackforPlay

オープンソースHackforPlayのコンテンツを実行するための環境を提供する

## Plan

[Trello](https://trello.com/b/gxWQpAnW/opensource-hackforplay)


## Install

1. Clone this repo.
2. `npm install`
3. `node server.js`
4. Open *example/local.html* in your browser **as local file.**


## How example/local.html works?

It has
```html
<iframe src="http://localhost:3000/index.html" width="480" height="320"></iframe>
```

*index.html* uses [require.js](http://requirejs.org) -- to resolve more dependencies dynamically.
At first it runs *public/hack.js* next *public/some_mod.js* is loaded.


