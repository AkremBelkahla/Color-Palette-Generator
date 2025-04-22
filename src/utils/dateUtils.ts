export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Get today and yesterday dates for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  // Format the time portion
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  const timeStr = date.toLocaleTimeString(undefined, timeOptions);
  
  // Check if date is today, yesterday, or another day
  if (dateOnly.getTime() === today.getTime()) {
    return `Today, ${timeStr}`;
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeStr}`;
  } else {
    // Format the date portion
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    
    // Add year only if it's not the current year
    if (date.getFullYear() !== today.getFullYear()) {
      dateOptions.year = 'numeric';
    }
    
    return date.toLocaleDateString(undefined, dateOptions);
  }
};