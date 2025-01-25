import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Configuration du client de requête
export const queryClient = new QueryClient();

// Configuration de base
const projectId = 'daed581b1779c4009ab6aee07ed40743';

const metadata = {
  name: 'Checkdot',
  description: 'Checkdot DeFi Platform',
  url: window.location.origin,
  icons: ['https://checkdot.io/logo.png'] // Remplacer par votre logo
};

const networks = [mainnet, arbitrum];

// Création des connecteurs
const connectors = [
  injected({ 
    target: 'metaMask' // Pour cibler spécifiquement MetaMask
  }),
  walletConnect({ 
    projectId: projectId,
    metadata
  }),
  coinbaseWallet({
    appName: metadata.name,
    appLogoUrl: metadata.icons[0]
  })
];

// Création de l'adaptateur Wagmi
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  connectors
});

// Création du kit
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
}); 