/**
 * Utilitários para formatação e manipulação de datas
 * 
 * @description Centraliza toda a lógica de formatação de datas,
 * eliminando duplicação entre componentes.
 */

/**
 * Formata uma string de data no formato YYYY-MM-DD para DD/MM/YYYY
 * 
 * @param dateString - String de data no formato YYYY-MM-DD
 * @returns String formatada no formato DD/MM/YYYY ou 'N/A' se inválida
 * 
 * @example
 * formatDate('2024-01-15') // '15/01/2024'
 * formatDate('invalid') // 'N/A'
 * formatDate(undefined) // 'N/A'
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const parts = dateString.split('-'); // YYYY-MM-DD
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return dateString;
  } catch {
    return dateString;
  }
};

/**
 * Formata uma data para exibição em tabelas
 * 
 * @param dateString - String de data no formato YYYY-MM-DD
 * @returns String formatada para exibição ou 'N/A'
 */
export const formatTableDate = (dateString?: string): string => {
  return formatDate(dateString);
};

/**
 * Valida se uma string é uma data válida no formato YYYY-MM-DD
 * 
 * @param dateString - String a ser validada
 * @returns true se for uma data válida, false caso contrário
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return false;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  } catch {
    return false;
  }
};
