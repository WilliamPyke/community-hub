ALTER TYPE public.community_project_category ADD VALUE IF NOT EXISTS 'DeFi';
ALTER TYPE public.community_project_category ADD VALUE IF NOT EXISTS 'Social';
ALTER TYPE public.community_project_category ADD VALUE IF NOT EXISTS 'Infra & Tools';
ALTER TYPE public.community_project_category ADD VALUE IF NOT EXISTS 'Wallet';
ALTER TYPE public.community_project_category ADD VALUE IF NOT EXISTS 'AI';

TRUNCATE TABLE public.community_projects RESTART IDENTITY CASCADE;

INSERT INTO public.community_projects (
  slug,
  name,
  category,
  description,
  url,
  logo_code
)
VALUES
  ('lolli', 'Lolli', 'Wallet', 'Start stacking sats with Lolli. Link your account with Mezo to withdraw and spend your sats.', 'https://lolli.com/', '/community-project-icons/Lolli.jpg'),
  ('safe', 'Safe', 'Wallet', 'Battle tested smart wallet infrastructure built for Mezo', 'https://safe.mezo.org/welcome', '/community-project-icons/Safe.svg'),
  ('umy', 'Umy', 'DeFi', 'Book your travel using MUSD through Umy, a travel platform offering secure and convenient travel booking services.', 'https://www.umy.com/', '/community-project-icons/Umy.png'),
  ('musd-monitor', 'MUSD Monitor', 'Infra & Tools', 'Check trove status, recent redemptions and liquidations, price of BTC and MUSD from Mezo oracles, and more.', 'https://mezotools.cc/', '/community-project-icons/MUSD_Monitor.png'),
  ('veboost-calculator', 'veBoost Calculator', 'Infra & Tools', 'Calculate your earnings and boost multiplier from your veMEZO and veBTC locks.', 'https://boost.mallard.sh/', '/community-project-icons/veBoost_Calculator.png'),
  ('wormhole', 'Wormhole', 'DeFi', 'Bridge MUSD to Ethereum for additional yield, swaps, and off-ramping.', 'https://portalbridge.com/?sourceChain=mezo&targetChain=ethereum&asset=musd&targetAsset=musd', '/community-project-icons/Wormhole.png'),
  ('matchbox', 'Matchbox', 'Social', 'A marketplace connecting veBTC holders with veMEZO holders so both sides can maximize their earnings.', 'https://matchbox.mallard.sh/', '/community-project-icons/Matchbox.png'),
  ('brotocol', 'Brotocol', 'DeFi', 'Bridge your BTC in and out of Mezo in a few clicks.', 'https://brotocol.xyz/bridge/cross-bridge?toToken=evm%3A31612%3A0x7b7C000000000000000000000000000000000000', '/community-project-icons/Brotocol.svg'),
  ('mezo-agent', 'Mezo Agent', 'AI', 'An AI-powered web3 agent to engage with Mezo''s testnet using natural language.', 'https://github.com/LowPolyDuck/MezoAgent/tree/Smart-Agent', '/community-project-icons/Mezo_Agent.jpg'),
  ('morpho', 'Morpho', 'DeFi', 'Morpho''s earn vaults give users access to yield on any asset. The Alpha MUSD Core is designed to maximize risk-adjusted returns for MUSD.', 'https://app.morpho.org/ethereum/vault/0x52317a47585A6ACDfbD7a29B494c3E2baAE96aBc', '/community-project-icons/Morpho.svg'),
  ('bitfire', 'BitFire', 'DeFi', 'Stake BTC, borrow MUSD, and earn looping rewards all in one place.', 'https://bit-fire.xyz/', '/community-project-icons/BitFire.png'),
  ('uwi', 'Uwi', 'DeFi', 'The first RWA vault for MUSD. Funds used as loans to build pre-sold affordable housing in Philippines and Indonesia.', 'https://mezovault.uwihomes.com/signup', '/community-project-icons/Uwi.png');
