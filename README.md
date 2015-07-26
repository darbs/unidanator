# unidanator

Unidanator is a reddit vote manipulator inspired by the fallen angel Unidan. Using Unidanator you can pad your own comments, downvote your own comments, punish or praise an unsuspecting redditor. 

WARNING: Use of this clearly violates reddits terms of service and rules. You have been warned.

Warning aside, this takes some minor setup. You need to either have or setup your slave accounts prior to using this tool.

## Getting Started
1. Clone of download the repo. 
2. Create your slave accounts and get their key/secret from reddit
3. Set up a configuration.json in the project directory with the following structure:
```javascript
{
  "maxComments": 10, // max comments you want to retrieve from the user
  "useAccounts": 5, // number of accounts you want to use from pool of slaves
  "slaves": [
    {
      "key": "XXXXXXXXXXX",
      "secret": "ABC123ABC123",
      "username": "slave_acount1",
      "password": "slave_password1"
    },
    //...
    {
      "key": "XXXXXXXXXXX",
      "secret": "DEF123DEF123",
      "username": "slave_acount2",
      "password": "slave_password2"
    }
  ]
}
```
4.run ```node unidanator.js <account name> <(+/-)1>```

## TODOs
* Random intervals between votes
* Specs
* verbose flag for logs

## License
Copyright (c) 2015 darbs  
Licensed under the MIT license.
