**#Mezo Community Hub**


**## Objective**



**A read-only web dashboard aggregating DeFi yield opportunities and community-built resources on the Mezo network. It serves as an informational routing layer—users discover yields here but execute transactions on the native protocols.**



**## Core Features**



**### 1. Yield Dashboard (Home)**



**\* \*\*Function:\*\* A master list of available Mezo yield pools and vaults.**

**\* \*\*Data Points:\*\* Protocol logo, asset pairs (e.g., MUSD/USDC), APR, TVL, Daily Rewards.**

**\* \*\*Controls:\*\* Sorting (APR, TVL) and basic filtering.**



**### 2. Yield Detail Page**



**\* \*\*Function:\*\* Deep analytics for a single vault/pool.**

**\* \*\*Visuals:\*\* Historical line charts (APY/TVL over time) and an LP breakdown donut chart.**

**\* \*\*Information:\*\* Strategy description and a "Risk Checklist" (e.g., Audits, Timelocks, Synthetic Assets).**

**\* \*\*Strict Constraint:\*\* \*\*No Web3 wallet integration.\*\* The main Call-to-Action must be an external link ("Go to Protocol") that opens the native dApp in a new tab.**



**### 3. Community Directory**



**\* \*\*Function:\*\* A dedicated hub listing tools, apps, and resources built by the Mezo community.**

**\* \*\*Data Points:\*\* Project name, category, description, and external link.**



**### 4. Admin Portal \& Authentication**



**\* \*\*Function:\*\* A hidden CMS route for moderators to add/edit yield listings and community apps.**

**\* \*\*Custom Auth Flow (Mallard Nexus Bot):\*\***

**1. Unauthenticated admin visits `/admin` and is presented with a generated UI Code (e.g., `8F2B`).**

**2. Admin DMs this code to the "Mallard Nexus" Discord bot.**

**3. The bot verifies the user has the "Moderator" role in the Mezo Discord server.**

**4. If approved, the bot replies with a single-use magic link containing a secure JWT.**

**5. The admin clicks the link to authenticate their browser session and access the CMS.**

