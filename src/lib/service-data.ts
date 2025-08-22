// Arquivo: src/lib/service-data.ts

import React from 'react';
import { Home as HomeIcon, Shirt, Soup, UserPlus } from 'lucide-react';

export const pricingData = {
    "faxina": { "4": 140, "6": 198, "8": 240 },
    "passadoria": { "4": 148, "6": 210, "8": 264 },
    "cozinheira": { "4": 160, "6": 228, "8": 288 },
    "cuidador": { "4": 168, "6": 240, "8": 304 }
};

export const serviceNames: Record<string, string> = {
    faxina: 'Faxina Padrão',
    passadoria: 'Passadoria',
    cozinheira: 'Cozinheira',
    cuidador: 'Cuidador(a) de Idosos'
};

export const serviceIcons: Record<string, React.ElementType> = {
    faxina: HomeIcon,
    passadoria: Shirt,
    cozinheira: Soup,
    cuidador: UserPlus,
};
