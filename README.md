# cryptocurrency trading bot

A work in progress command-line cryptocurrency trading bot for Ether, Bitcoin & Litecoin currencies works with common exchanges like coinbase , Bitmex and Binance

**Not production ready** only basic functionality
## Features

- Fully-automated technical-analysis-based trading approach
- Full support for Coinbase ,Binance and Bitmex (work on further exchange support is ongoing )
- Plugin architecture for implementing exchange support, or writing new strategies
- Simulator for backtesting strategies against historical data
- Configurable sell stops, buy stops, and (trailing) profit stops
- Support for going "Short" and "Long"
- Signal browser dashboard for pairs
- Slack and email notification
- Join foreign exchange candles (eg. Trade on Bitmex with the faster moving Binance trades / candles)

## Exchanges

- [Bitmex](https://www.bitmex.com/register/jS4mLN) with leverage configuration
- [Bitmex Testnet](https://www.bitmex.com/register/jS4mLN)
- [Binance](https://www.binance.com/?ref=17569916)
- [Binance Margin](https://www.binance.com/?ref=17569916)
- [Binance Futures](https://www.binance.com/en/futures/ref/302644)
- [Coinbase Pro](https://www.coinbase.com/join/5a2ae60e76531100d3af2ee5)
- [Bitfinex](https://www.bitfinex.com/?refcode=kDLceRHa) (margin wallet)
- [Bybit](https://www.bybit.com/app/register?ref=46AK7) with leverage configuration
- [FTX](https://ftx.com/#a=1494781) (Perpetual Futures only)

## Requirements

- Javascript
- Node.js
- MongoDB
- Docker
- Coinbase Api
- Bollinger Bands

## Deployment and installation


### [optional] Preinstall

The tulip library is used for indicators; which sometimes is having some issues on `npm install` because of code compiling:

Install build tools

```
sudo apt-get install build-essential
```

The nodejs wrapper for tulipindicators is called [Tulip Node (tuind)](https://www.npmjs.com/package/tulind), check out installation instructions there.

Also the build from source is not supporting all nodejs version. It looks like versions <= 10 are working. You can use nodejs 12 if you compiled it once via older version.

### Install packages

```
➜ npm install --production
➜ npm run postinstall
```

Create instance file for pairs and changes

```
cp instance.js.dist instance.js
```

Provide a configuration with your exchange credentials

```
cp conf.json.dist conf.json
```

Create a new sqlite database use bot.sql scheme to create the tables

```
sqlite3 bot.db < bot.sql
```

Lets start it

```
npm start
```

## How to use: Docker

For initialize the configuration once

```
➜ cp instance.js.dist instance.js && cp conf.json.dist conf.json && sqlite3 bot.db < bot.sql
➜ docker-compose build
➜ docker-compose up -d
```

After this you can use `docker-compose` which will give you a running bot via <http://127.0.0.1:8080>


## Setting Up Telegram Bot

First, you'll need to create a bot for Telegram. Just talk to [BotFather](https://telegram.me/botfather) and follow simple steps until it gives you a token for it.
You'll also need to create a Telegram group, the place where you and crypto-trading-bot will communicate. After creating it, add the bot as administrator (make sure to uncheck "All Members Are Admins").

### Retrieving Chat IDs

Invite `@RawDataBot` to your group and get your group id in sended chat id field

```text
Message
 ├ message_id: 338
 ├ from
 ┊  ├ id: *****
 ┊  ├ is_bot: false
 ┊  ├ first_name: 사이드
 ┊  ├ username: ******
 ┊  └ language_code: en
 ├ chat
 ┊  ├ id: -1001118554477
 ┊  ├ title: Test Group
 ┊  └ type: supergroup
 ├ date: 1544948900
 └ text: A
```

Look for id: -1001118554477 is your chat id (with the negative sign). 

### Log messages to Telegram

For example setup, check `conf.json.dist file`, log.telegram section , set chatId, token, level (default is info). Check more options https://github.com/ivanmarban/winston-telegram#readme

## Webserver

Some browser links

- UI: http://127.0.0.1:8080
- Signals: http://127.0.0.1:8080/signals
- Tradingview: http://127.0.0.1:8080/tradingview/BTCUSD
- Backtesting: http://127.0.0.1:8080/backtest
- Order & Pair Management: http://127.0.0.1:8080/pairs

### Security / Authentication
As the webserver provides just basic auth for access you should combine some with eh a https for public server. Here s simple `proxy_pass` for nginx.

```
# /etc/nginx/sites-available/YOURHOST
server {
    server_name YOURHOST;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/YOURHOST/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/YOURHOST/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

```

You should also set the listen ip to a local one

```
# config.json
webserver.ip: 127.0.0.1

```
## Web UI

### Dashboard

![Webserver UI](https://github.com/chainc00de/crypto-trading-bot/blob/master/documentation/cryptobot.png?raw=true)

### Trades / Positions / Orders

![Webserver UI](https://github.com/chainc00de/crypto-trading-bot/raw/master/documentation/trades.png)

### Backtesting

Currently there is a the UI for backtesting

![Webserver UI](https://github.com/chainc00de/crypto-trading-bot/raw/master/documentation/backtest_result.png)

### Manual Orders

![Webserver UI](https://github.com/chainc00de/crypto-trading-bot/raw/master/documentation/manual_order.png)

## Tools / Watchdog

- `order_adjust` Keep open orders in bid / ask of the orderbook in first position

### Watchdog

- `stoploss` provide general stoploss order in percent of entry price (Exchange Order)
- `risk_reward_ratio` Creates Risk Reward order for take profit and stoploss (Exchange Order Limit+Stop)
- `stoploss_watch` Close open position if ticker price falls below the percent lose; use this for exchange that dont support stop_loss order liek Binance
- `trailing_stop` Use native exchange trailing stop; if supported by exchange eg `Bitfinex`

```
    'watchdogs': [
        {
            'name': 'stoploss',
            'percent': 3,
        },
        {
            'name': 'risk_reward_ratio',
            'target_percent': 6,
            'stop_percent': 3,
        },
        {
            'name': 'stoploss_watch',
            'stop': 1.2,
        },
        {
            'name': 'trailing_stop',
            'target_percent': 1.2,
            'stop_percent': 0.5
        }
    ],
```

### Tick Interval

Per default every strategy is "ticked" every full minute with a ~10sec time window. If you want to tick every 15 minutes or less see possible examples below.

Supported units are "m" (minute) and "s" (seconds)

```json
{
  "strategies": [
    {
      "strategy": "cci",
      "interval": "15m"
    },
    {
      "strategy": "cci2",
      "interval": "30s"
    },
    {
      "strategy": "cci3",
      "interval": "60m"
    }
  ]
}
```

## Trading

### Capital

To allow the bot to trade you need to give some "playing capital". You can allow to by via asset or currency amount, see examples below.
You should only provide one of them, first wins.

```
    c.symbols.push({
        'symbol': 'BTC-EUR',
        'exchange': 'coinbase_pro',
        'trade': {
            'capital': 0.015, // this will buy 0.015 BTC
            'currency_capital': 50,  // this will use 50 EUR and buys the equal amount of BTC (example: BTC price 3000 use 50 EUR. will result in 0.016 BTC)
            'balance_percent': 75,  // this will use 75 % of your exchange margin tradable balance. Currently implemented only on Bitfinex exchange.
        },
    })
```

### Live Strategy

Every strategy stat should be live must be places inside `trade`.

```json
{
  "trade": {
    "strategies": [
      {
        "strategy": "dip_catcher",
        "interval": "15m",
        "options": {
          "period": "15m"
        }
      }
    ]
  }
}
```

Inside logs, visible via browser ui, you can double check the strategies init process after the application started.

```
[info] Starting strategy intervals
[info] "binance_futures" - "ETHUSDT" - "trade" - init strategy "dip_catcher" (15m) in 11.628 minutes
[info] "binance_futures" - "BTCUSDT" - "trade" first strategy run "dip_catcher" now every 15.00 minutes
```

### Full Trade Example

An example `instance.js` which trades can be found inside `instance.js.dist_trade`. Rename it or move the content to you file.

```js
const c = (module.exports = {});

c.symbols = [
  {
    symbol: 'ETHUSDT',
    exchange: 'binance_futures',
    periods: ['1m', '15m', '1h'],
    trade: {
      currency_capital: 10,
      strategies: [
        {
          strategy: 'dip_catcher',
          interval: '15m',
          options: {
            period: '15m'
          }
        }
      ]
    },
    watchdogs: [
      {
        name: 'risk_reward_ratio',
        target_percent: 3.1,
        stop_percent: 2.1
      }
    ]
  }
];
```

### Margin / Leverage

Per pair you can set used margin before orders are created; depending on exchange

```
    c.symbols.push({
        'symbol': 'BTCUSD',
        'exchange': 'bitmex',
        'extra': {
            'bitmex_leverage': 5,
        },
    })

    c.symbols.push({
        'symbol': 'EOSUSD',
        'exchange': 'bybit',
        'extra': {
            'bybit_leverage': 5,
        },
    })
```


## Disclaimer

- This bot is NOT a sure-fire profit . Use it AT YOUR OWN RISK.
- Crypto-currency isn't stable coins it is experiment , and therefore so is this bot. Meaning, both may fail at any time.
- Running a bot, and trading in general requires careful study of the risks and parameters involved. A wrong setting can cause you a major loss.
- Never leave the bot un-monitored for long periods of time. this bot doesn't know when to stop, so be prepared to stop it if too much loss occurs.
- Often times the default trade parameters will underperform vs. a buy-hold strategy, so run some simulations and find the optimal parameters for your chosen exchange/pair before going "all-in".

## Related Links

### Strategies

- https://github.com/freqtrade/freqtrade-strategies
- https://github.com/freqtrade/freqtrade-strategies/tree/master/user_data/strategies/berlinguyinca
- https://github.com/sthewissen/Mynt/tree/master/src/Mynt.Core/Strategies
- https://github.com/xFFFFF/Gekko-Strategies
- https://github.com/Superalgos/Strategy-BTC-BB-Top-Bounce
- https://github.com/Ekliptor/WolfBot/tree/master/src/Strategies
- https://github.com/Superalgos/Strategy-BTC-WeakHandsBuster
