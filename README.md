# MirrorDB

A p2p database with superpowers.

## Background

After building multiple CRUD applications I realized that many of these applications use a central database on a server with the only purpose to be able to sync between devices. Sure, there are some features that you can only implement by hosting all the data in one central repository but are those the features that the user wants? No, I don't think so. We settle on centralized storage because that is the only game in town if you want to sync across devices.

MirrorDB puts the data where it should be: in the hands of the user. Not in the hands of startups that go bust as soon as the VC money runs dry. It is a decentralized database for the masses with the convenience of the cloud and the privacy of a local database.

## Project Status

- [ ] Write an in-memory datalog engine
- [ ] Write a datalog engine with persistent storage for NodeJS

## Planned Features

- Reactive queries (queries incrementally update when updates are made)
- Transactions
- Automatic synchronization between databases
  - Bluetooth
  - HTTP
  - LAN
  - DBUS
  - ...
- Database Schemas
- Rich Query Language
- Automatic Discovery of nearby databases
  - Bluetooth
  - mDNS
  - DBUS
  - ICE
  - ...
- Node and Browser backend
