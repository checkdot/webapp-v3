interface CustomWallet {
  name: string;
  isAvailable: () => boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getAccount: () => Promise<string | null>;
}

// Variables pour stocker les adresses des comptes
let pontemAccountAddress: string | null = null;
let martianAccountAddress: string | null = null;

export const pontemWallet: CustomWallet = {
  name: 'Pontem',
  isAvailable: () => !!(window as any).pontem,
  connect: async () => {
    if (!(window as any).pontem) {
      throw new Error('Pontem wallet not found');
    }
    try {
      // Demander la connexion
      const response = await (window as any).pontem.connect();
      if (!response || !response.address) {
        throw new Error('Failed to connect to Pontem');
      }
      // Stocker l'adresse
      pontemAccountAddress = response.address;
      console.log('Connected to Pontem with address:', pontemAccountAddress);
    } catch (error) {
      console.error('Failed to connect to Pontem:', error);
      throw error;
    }
  },
  disconnect: async () => {
    if (!(window as any).pontem) {
      throw new Error('Pontem wallet not found');
    }
    try {
      await (window as any).pontem.disconnect();
      // Réinitialiser l'adresse stockée
      pontemAccountAddress = null;
      console.log('Disconnected from Pontem');
    } catch (error) {
      console.error('Failed to disconnect from Pontem:', error);
      throw error;
    }
  },
  getAccount: async () => {
    if (!(window as any).pontem) {
      throw new Error('Pontem wallet not found');
    }
    try {
      // Si nous avons déjà une adresse stockée, l'utiliser
      if (pontemAccountAddress) {
        return pontemAccountAddress;
      }

      // Sinon, essayer d'obtenir l'adresse via account()
      const account = await (window as any).pontem.account();
      if (!account) {
        console.log('No account selected or access denied');
        return null;
      }

      // Si account est un objet, extraire l'adresse
      if (typeof account === 'object' && account !== null) {
        pontemAccountAddress = account.address || null;
        return pontemAccountAddress;
      }

      return account;
    } catch (error) {
      console.error('Failed to get Pontem account:', error);
      throw error;
    }
  }
};

export const martianWallet: CustomWallet = {
  name: 'Martian',
  isAvailable: () => !!(window as any).martian,
  connect: async () => {
    if (!(window as any).martian) {
      throw new Error('Martian wallet not found');
    }
    try {
      const response = await (window as any).martian.connect();
      if (!response || !response.address) {
        throw new Error('Failed to connect to Martian');
      }
      // Stocker l'adresse
      martianAccountAddress = response.address;
      console.log('Connected to Martian with address:', martianAccountAddress);
    } catch (error) {
      console.error('Failed to connect to Martian:', error);
      throw error;
    }
  },
  disconnect: async () => {
    if (!(window as any).martian) {
      throw new Error('Martian wallet not found');
    }
    try {
      await (window as any).martian.disconnect();
      // Réinitialiser l'adresse stockée
      martianAccountAddress = null;
      console.log('Disconnected from Martian');
    } catch (error) {
      console.error('Failed to disconnect from Martian:', error);
      throw error;
    }
  },
  getAccount: async () => {
    if (!(window as any).martian) {
      throw new Error('Martian wallet not found');
    }
    try {
      // Si nous avons déjà une adresse stockée, l'utiliser
      if (martianAccountAddress) {
        // Obtenir les détails du compte
        const details = await (window as any).martian.getAccount(martianAccountAddress);
        console.log('Martian account details:', details);
        return martianAccountAddress;
      }

      // Sinon, essayer d'obtenir une nouvelle adresse
      const response = await (window as any).martian.connect();
      if (!response || !response.address) {
        console.log('No account selected or access denied');
        return null;
      }

      martianAccountAddress = response.address;
      return martianAccountAddress;
    } catch (error) {
      console.error('Failed to get Martian account:', error);
      throw error;
    }
  }
}; 