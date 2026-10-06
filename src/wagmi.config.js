import { getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coreWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  mainnet,
  polygon,
  avalancheFuji,
  baseSepolia,
  arcTestnet,
} from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recomendadas',
      wallets: [metaMaskWallet, coreWallet, rainbowWallet, coinbaseWallet],
    },
    {
      groupName: 'Otras',
      wallets: [walletConnectWallet],
    },
  ],
  {
    appName: 'Optimype',
    projectId,
  }
);

// Augment Arc Testnet with the official logo served locally from /public
const arcTestnetWithIcon = {
  ...arcTestnet,
  iconUrl: '/arc-testnet-logo.svg',
  iconBackground: '#0A1628',
};

export const config = getDefaultConfig({
  appName: 'Optimype',
  projectId,
  chains: [mainnet, polygon, avalancheFuji, baseSepolia, arcTestnetWithIcon],
  connectors,
  ssr: false,
});
