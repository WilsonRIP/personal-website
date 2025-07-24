# GitHub Private Repository Setup

To include private repository commits in your total commit count, you need to set up GitHub authentication.

## Setup Instructions

1. **Create a GitHub Personal Access Token:**
   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a descriptive name (e.g., "Personal Website Stats")
   - Select the following scopes:
     - `repo` (Full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Add the token to your environment:**
   - Create a `.env.local` file in your project root
   - Add the following line:
     ```
     GITHUB_TOKEN=your_github_personal_access_token_here
     ```
   - Replace `your_github_personal_access_token_here` with your actual token

3. **Restart your development server:**
   - Stop your current server (Ctrl+C)
   - Run `npm run dev` or `bun dev` again

## What This Does

- **Fetches private repositories:** The system will now access your private repositories to count commits
- **Includes in total count:** Private repository commits are added to the total commit count
- **Keeps private repos hidden:** Private repositories are not displayed in the UI, only their commits are counted
- **Maintains security:** The token is only used server-side and never exposed to the client

## Security Notes

- Keep your `.env.local` file secure and never commit it to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- The token only has access to your repositories and can be revoked at any time from GitHub settings

## Troubleshooting

If you see "0" commits from private repositories:
1. Verify your token has the `repo` scope
2. Check that the token is correctly set in `.env.local`
3. Restart your development server
4. Check the browser console for any error messages 