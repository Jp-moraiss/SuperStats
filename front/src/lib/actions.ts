"use server";

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

// Schemas de validação
const MovieSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  ano: z.number().min(1900, "Ano deve ser maior que 1900"),
  avaliacaoTmdb: z.number().min(0).max(10, "Avaliação deve estar entre 0 e 10"),
  posterUrl: z.string().url("URL do pôster inválida"),
  produtora: z.string().min(1, "Produtora é obrigatória"),
  diretor: z.string().min(1, "Diretor é obrigatório"),
  assistido: z.boolean().default(false),
});

const HqSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  volumeName: z.string().min(1, "Nome do volume é obrigatório"),
  editora: z.string().min(1, "Editora é obrigatória"),
  coverUrl: z.string().url("URL da capa inválida"),
  lido: z.boolean().default(false),
});

const CharacterSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  alignment: z.enum(['good', 'bad', 'neutral']),
  publisher: z.string().min(1, "Editora é obrigatória"),
  power: z.number().min(0).max(100),
  intelligence: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  durability: z.number().min(0).max(100),
  combat: z.number().min(0).max(100),
});

// Server Actions para Filmes
export async function addMovie(formData: FormData) {
  try {
    const rawData = {
      titulo: formData.get('titulo') as string,
      ano: Number(formData.get('ano')),
      avaliacaoTmdb: Number(formData.get('avaliacaoTmdb')),
      posterUrl: formData.get('posterUrl') as string,
      produtora: formData.get('produtora') as string,
      diretor: formData.get('diretor') as string,
      assistido: formData.get('assistido') === 'true',
    };

    const validatedData = MovieSchema.parse(rawData);

    // Simulação de chamada para API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error('Falha ao adicionar filme');
    }

    // Revalida o cache
    revalidateTag('movies', 'page');
    
    return { success: true, message: 'Filme adicionado com sucesso!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Dados inválidos', 
        errors: error.issues 
      };
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function deleteMovie(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Falha ao deletar filme');
    }

    revalidateTag('movies','page');
    
    return { success: true, message: 'Filme deletado com sucesso!' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function toggleMovieWatched(id: number, watched: boolean) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assistido: watched }),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar filme');
    }

    revalidateTag('movies', 'page');
    
    return { success: true, message: 'Status atualizado com sucesso!' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Server Actions para HQs
export async function addHq(formData: FormData) {
  try {
    const rawData = {
      titulo: formData.get('titulo') as string,
      volumeName: formData.get('volumeName') as string,
      editora: formData.get('editora') as string,
      coverUrl: formData.get('coverUrl') as string,
      lido: formData.get('lido') === 'true',
    };

    const validatedData = HqSchema.parse(rawData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hqs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error('Falha ao adicionar HQ');
    }

    revalidateTag('hqs', 'page');
    
    return { success: true, message: 'HQ adicionada com sucesso!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Dados inválidos', 
        errors: error.issues 
      };
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function deleteHq(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hqs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Falha ao deletar HQ');
    }

    revalidateTag('hqs', 'page');
    
    return { success: true, message: 'HQ deletada com sucesso!' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function toggleHqRead(id: number, read: boolean) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hqs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lido: read }),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar HQ');
    }

    revalidateTag('hqs', 'page');
    
    return { success: true, message: 'Status atualizado com sucesso!' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Server Actions para Personagens
export async function addCharacter(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name') as string,
      alignment: formData.get('alignment') as 'good' | 'bad' | 'neutral',
      publisher: formData.get('publisher') as string,
      power: Number(formData.get('power')),
      intelligence: Number(formData.get('intelligence')),
      speed: Number(formData.get('speed')),
      durability: Number(formData.get('durability')),
      combat: Number(formData.get('combat')),
    };

    const validatedData = CharacterSchema.parse(rawData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error('Falha ao adicionar personagem');
    }

    revalidateTag('characters', 'page');
    
    return { success: true, message: 'Personagem adicionado com sucesso!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Dados inválidos', 
        errors: error.issues 
      };
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Funções de busca com cache
export async function getMovies() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`, {
      next: { 
        revalidate: 3600, // Cache por 1 hora
        tags: ['movies'] 
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar filmes');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
}

export async function getHqs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hqs`, {
      next: { 
        revalidate: 3600, // Cache por 1 hora
        tags: ['hqs'] 
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar HQs');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar HQs:', error);
    return [];
  }
}

export async function getCharacters() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters`, {
      next: { 
        revalidate: 3600, // Cache por 1 hora
        tags: ['characters'] 
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar personagens');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    return [];
  }
}
