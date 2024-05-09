  export function FormatDate(dateString?: string): string {
    if (!dateString) {
      return "Data não disponível";
    }
  
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      return "Data inválida"; 
    }
  
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  }