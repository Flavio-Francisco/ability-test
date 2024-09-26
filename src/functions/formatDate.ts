export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const year: number = date.getFullYear();
  
    return `${year}-${month}-${day}`; // Formato: dd/mm/yyyy
  }