# hackforplay-embed
To provide an environment for executing the content of the open source HackforPlay

オープンソースHackforPlayのコンテンツを実行するための環境を提供する

## Plan

[Trello](https://trello.com/b/gxWQpAnW/opensource-hackforplay)


## CDN

https://embed.hackforplay.xyz/open-source/screen/alpha-3.html

## Install

1. Clone this repo.
2. `npm install`
3. `npm start`
4. Open `http://localhost:8080/`


## How it works?

It makes
```html
<iframe src="./screen.html"></iframe>
```

then send code to the frame.


*screen.html* loads [require.js](http://requirejs.org) and *screen.js*

So it can resolve dependencies with AMD.


See also:

- https://github.com/teramotodaiki/hackforplayer
