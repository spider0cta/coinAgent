# cryptocurrency trading bot

A work in progress command-line cryptocurrency trading bot for Ether, Bitcoin & Litecoin currencies works with common exchanges like coinbase , Bitmex and Binance

## Features

- Fully-automated technical-analysis-based trading approach
- Full support for Coinbase ,Binance and Bitmex (work on further exchange support is ongoing )
- Plugin architecture for implementing exchange support, or writing new strategies
- Simulator for backtesting strategies against historical data
- Configurable sell stops, buy stops, and (trailing) profit stops

## Exchanges

- Coinbase
- Coinbase Pro
- Bitmex
  - with leverage configuration
- Bitmex
  - Testnet
- Binance
- Binance
  - Margin
- Binance
  - Futures

## Requirements

- Javascript
- Node.js
- MongoDB
- Docker
- Coinbase Api
- Bollinger Bands

## Deployment

it is easy you need to load it into Docker and then begin to run it in the cloud via Digital Ocean using a virtual wallet (that is more secure than wserv ). Creating a Docker image Uploading onto Digital Ocean Running our app with a virtual wallet & currency and done

- Docker docs
  - https://docs.docker.com/

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
