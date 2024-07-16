# Database

Database Schema

## Seeding (Migration from V1)

Using Dumped Database Information from V1

### Steps

- Set connection string in `.env`
- Run `pnpm migrate` to apply to local postgresql instance
- Get Course Data V1 (Dumped) from [Here](https://drive.google.com/drive/folders/1L8h4JCXYfC6oYdHY66nPfbfcfCZDLtmq?usp=sharing)
- Uncomment commands in `src/seed/index.ts` on User Data section if you don't
  have user data. (No way I give you)
- Run `pnpm seed`
