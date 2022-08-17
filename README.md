# AYCE

AYCE is an all you can eat companion we built for the fifth Supabase [Launch Week Hackathon](https://supabase.com/blog/launch-week-5-hackathon).

It is [available now](https://ayce.vercel.app), and we're always looking for feedback!

Many all you can eat restaurants require you to fill out a piece of paper documenting how many dishes of each type you want. This can quickly become complicated when eating with many people or if you frequently change your choices.

Create a room on AYCE and share the password with other people at the table. Everyone will be able to add dishes, and select (or deselect) them. At the end, you can simply press a button to see an organized list of all the dishes to order.

## Tech stack

This website is built using [Next.js](https://nextjs.org/) and is hosted on [Vercel](https://vercel.com/). We use many different [Supabase](https://supabase.com) features:

- Passwordless authentication: get a magic link directly in your inbox. No passwords to remember
- Database: every application needs some persistence. PostgreSQL is reliable and full of features, and Supabase makes it super easy to setup and manage
- Storage: personalize your account with your own profile picture
- Edge functions: some functionality like creating and joining a room require some server-side code to make sure the room passwords are not leaked. Deno functions work incredibly well and are easy to deploy
- Realtime: _coming soon_

## Credits

Made by me ([Twitter](https://twitter.com/emilioschepis), [GitHub](https://github.com/emilioschepis)) and my brother Federico.
