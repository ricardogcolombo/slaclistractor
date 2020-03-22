# SLACLISTRACTOR

A terminal client to extract and save slack conversations.


## Table of Contents

1.  [Documentation](#documentation)
    1.  [Installation & Use](#installation)
    2.  [Parameters](#use)
 2.  [TODO](#TODO)
3.  [Support](#support)

## [Documentation](#documentation)

<a name="documentation"></a>

### Installation and Use
Install the cli in terminal running. 

<a name="installation"></a>

```shell
npm -g install slaclistractor
```

Add slaclistractor to your Slack workspace

<a href="https://slack.com/oauth/v2/authorize?client_id=11221063959.1000724979104&user_scope=channels:history,channels:read,groups:history,groups:read,im:history,im:read,mpim:history,mpim:read,users:read"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

After that you will need an "Bot User OAuth Access Token" that you can find it here.

![Image Token](https://github.com/ricardogcolombo/slaclistractor/blob/master/images/token.png)

Then you can run and the question would appear and you should paste your token here.
``` slaclistractor ```

![Image Token](https://github.com/ricardogcolombo/slaclistractor/blob/master/images/tokenNotFound.png)

### Parameters

- --channel="CHANNELS_NAMES" (Separated with commas)
- --directmessages="USER_NAMES" (Separated with commas)
for short versions you may use 

- -d USER_NAMES
- -c CHANNELS_NAMES

### TODO
- [ ] improve Docs
- [ ] Support dm in groups of users
- [ ] Improve logger
