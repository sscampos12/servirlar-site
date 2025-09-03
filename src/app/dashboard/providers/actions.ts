
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { initializeAdminApp } from '@/lib/firebase-admin';

// Função para criar um novo provedor
export async function createProvider(formData: FormData) {
  try {
    const { db } = initializeAdminApp();
    
    const providerData = {
      fullName: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      services: JSON.parse(formData.get('services') as string || '[]'),
      location: {
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zipCode: formData.get('zipCode') as string,
      },
      experience: parseInt(formData.get('experience') as string || '0'),
      rating: 0,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('professionals').add(providerData);
    
    revalidatePath('/dashboard/providers');
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao criar provedor:', error);
    return { success: false, error: 'Falha ao criar provedor' };
  }
}

// Função para atualizar um provedor
export async function updateProvider(id: string, formData: FormData) {
  try {
    const { db } = initializeAdminApp();
    
    const updateData: { [key: string]: any } = {};

    // Iterar sobre as chaves do FormData e construir o objeto de atualização
    // Isso evita sobrescrever o documento inteiro
    formData.forEach((value, key) => {
      // Simple key-value pairs
      if (key !== 'services' && !key.startsWith('location.')) {
        updateData[key] = value;
      }
    });

    // Handle nested location object
    const location: { [key: string]: any } = {};
    if (formData.has('location.city')) location.city = formData.get('location.city');
    if (formData.has('location.state')) location.state = formData.get('location.state');
    if (formData.has('location.zipCode')) location.zipCode = formData.get('location.zipCode');
    if (Object.keys(location).length > 0) updateData.location = location;

    // Handle services array
    if (formData.has('services')) {
      updateData.services = JSON.parse(formData.get('services') as string || '[]');
    }

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: 'Nenhum dado para atualizar.' };
    }

    updateData.updatedAt = new Date();

    await db.collection('professionals').doc(id).update(updateData);
    
    revalidatePath('/dashboard/providers');
    revalidatePath(`/dashboard/providers/${id}`);
    
    return { success: true, message: 'Provedor atualizado com sucesso.' };
  } catch (error) {
    console.error('Erro ao atualizar provedor:', error);
    return { success: false, error: 'Falha ao atualizar provedor' };
  }
}


// Função para deletar um provedor
export async function deleteProvider(id: string) {
  try {
    const { auth, db } = initializeAdminApp();
    
    await db.collection('professionals').doc(id).delete();

    try {
      await auth.deleteUser(id);
    } catch (authError: any) {
      if (authError.code !== 'auth/user-not-found') {
        throw authError;
      }
    }
    
    revalidatePath('/dashboard/providers');
    return { success: true, message: "Profissional deletado com sucesso." };
    
  } catch (error) {
    console.error('Erro ao deletar provedor:', error);
    return { success: false, error: 'Falha ao deletar provedor' };
  }
}


// Função para buscar provedores (para uso em componentes)
export async function getProviders() {
  try {
    const { db } = initializeAdminApp();
    
    const snapshot = await db.collection('professionals').orderBy('createdAt', 'desc').get();
    const providers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return providers;
  } catch (error) {
    console.error('Erro ao buscar provedores:', error);
    return [];
  }
}

// Função para buscar um provedor específico
export async function getProviderById(id: string) {
  try {
    const { db } = initializeAdminApp();
    
    const doc = await db.collection('professionals').doc(id).get();
    
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar provedor:', error);
    return null;
  }
}
